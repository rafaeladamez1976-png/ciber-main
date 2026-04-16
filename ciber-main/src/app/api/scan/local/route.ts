import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// MAC vendor lookup table
const vendors: Record<string, string> = {
  '00:15:5D': 'Microsoft Hyper-V',
  '00:0C:29': 'VMware',
  '08:00:27': 'VirtualBox',
  'BC:D1:D3': 'Apple Inc.',
  '70:85:C6': 'ASUSTek Computer',
  '00:50:56': 'VMware',
  'DC:A6:32': 'Raspberry Pi',
  'B8:27:EB': 'Raspberry Pi',
  'FC:FB:FB': 'Cisco Systems',
  '00:1A:2B': 'Ayecom Technology',
  '48:2C:A0': 'Xiaomi',
  'AC:CF:23': 'Hi-Flying Technology',
  '00:1E:58': 'D-Link',
  'C8:3A:35': 'Tenda Technology',
  '00:26:18': 'ASUSTek Computer',
  'F8:D1:11': 'TP-Link',
  '50:C7:BF': 'TP-Link',
  'E4:F0:42': 'Google',
  '30:FD:38': 'Google',
  '44:07:0B': 'Google',
  '00:17:88': 'Philips Hue',
  'EC:FA:BC': 'Espressif',
  '24:0A:C4': 'Espressif',
  '3C:71:BF': 'Espressif',
  '68:C6:3A': 'Intel',
  'A4:34:D9': 'Intel',
  '00:1F:16': 'Wistron',
  '74:D4:35': 'Giga-Byte',
  '1C:1B:0D': 'Giga-Byte',
  '00:25:22': 'ASRock',
  '18:C0:4D': 'Giga-Byte',
};

interface DeviceResult {
  ip: string;
  mac: string;
  type: string;
  status: 'alive' | 'dead';
  hostname: string;
  vendor: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range'); // e.g. 192.168.1

  if (!range) {
    return NextResponse.json({ error: 'Range is required' }, { status: 400 });
  }

  try {
    // First, do a quick ping sweep to discover new hosts on the network
    // This ensures ARP cache is populated with active devices
    const pingPromises: Promise<any>[] = [];
    for (let i = 1; i <= 254; i++) {
      const ip = `${range}.${i}`;
      pingPromises.push(
        execAsync(`ping -n 1 -w 200 ${ip}`, { timeout: 3000 }).catch(() => {})
      );
    }
    
    // Process in batches of 50 to avoid overwhelming the system
    for (let batch = 0; batch < pingPromises.length; batch += 50) {
      await Promise.all(pingPromises.slice(batch, batch + 50));
    }

    // Now read the ARP table which should be populated
    const { stdout } = await execAsync('arp -a');
    const lines = stdout.split('\n');
    const devices: DeviceResult[] = [];

    // Parse ARP output lines
    for (const line of lines) {
      const match = line.match(/^\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+([0-9a-f-]{17})\s+(\w+)/i);
      if (match) {
        const [_, ip, mac, type] = match;
        if (ip.startsWith(range)) {
          const normalizedMac = mac.toUpperCase().replace(/-/g, ':');
          const prefix = normalizedMac.substring(0, 8);
          
          // Try DNS reverse lookup for hostname
          let hostname = `Node-${ip.split('.').pop()}`;
          try {
            const { stdout: dnsResult } = await execAsync(`nslookup ${ip}`, { timeout: 2000 });
            const nameMatch = dnsResult.match(/Name:\s+(.+)/i);
            if (nameMatch) {
              hostname = nameMatch[1].trim();
            }
          } catch {
            // Keep default hostname
          }

          devices.push({
            ip,
            mac: normalizedMac,
            type,
            status: 'alive',
            hostname,
            vendor: vendors[prefix] || 'Unknown Device'
          });
        }
      }
    }

    // Sort by IP
    devices.sort((a, b) => {
      const aOctets = a.ip.split('.').map(Number);
      const bOctets = b.ip.split('.').map(Number);
      for (let i = 0; i < 4; i++) {
        if (aOctets[i] !== bOctets[i]) return aOctets[i] - bOctets[i];
      }
      return 0;
    });

    return NextResponse.json({ 
      devices,
      scanTime: new Date().toISOString(),
      totalFound: devices.length,
      range: `${range}.0/24`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
