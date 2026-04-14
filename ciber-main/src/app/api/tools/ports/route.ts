import { NextResponse } from 'next/server';
import * as net from 'net';

const COMMON_PORTS: Record<number, string> = {
  21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
  80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 445: 'SMB',
  3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 5900: 'VNC',
  6379: 'Redis', 8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB',
  1433: 'MSSQL', 1521: 'Oracle', 2049: 'NFS', 8888: 'Jupyter',
  9200: 'Elasticsearch', 5601: 'Kibana', 2375: 'Docker', 11211: 'Memcached',
};

const HIGH_RISK_PORTS = [21, 23, 445, 3389, 5900, 2375, 11211];

function scanPort(host: string, port: number, timeout = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const cleanup = (result: boolean) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeout);
    socket.on('connect', () => cleanup(true));
    socket.on('timeout', () => cleanup(false));
    socket.on('error', () => cleanup(false));

    try {
      socket.connect(port, host);
    } catch {
      cleanup(false);
    }
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const mode = searchParams.get('mode') || 'common'; // common | full

  if (!target) {
    return NextResponse.json({ error: 'Target IP/hostname required' }, { status: 400 });
  }

  // Security: only allow private/local IPs or explicit targets
  const isPrivate = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(target) || target === 'localhost';
  
  const portsToScan = mode === 'full' 
    ? Object.keys(COMMON_PORTS).map(Number)
    : [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017];

  const results = await Promise.all(
    portsToScan.map(async (port) => {
      const isOpen = await scanPort(target, port, 1500);
      return {
        port,
        service: COMMON_PORTS[port] || 'Unknown',
        state: isOpen ? 'open' : 'closed',
        risk: HIGH_RISK_PORTS.includes(port) && isOpen ? 'high' : isOpen ? 'medium' : 'none',
        banner: isOpen && HIGH_RISK_PORTS.includes(port) 
          ? `⚠️ Service ${COMMON_PORTS[port]} exposed — consider firewall rules` 
          : undefined,
      };
    })
  );

  const openPorts = results.filter(r => r.state === 'open');
  const highRiskOpen = openPorts.filter(r => r.risk === 'high');

  return NextResponse.json({
    target,
    isPrivate,
    scannedAt: new Date().toISOString(),
    totalScanned: portsToScan.length,
    openCount: openPorts.length,
    highRiskCount: highRiskOpen.length,
    riskScore: Math.min(100, highRiskOpen.length * 20 + openPorts.length * 5),
    results: results.sort((a, b) => a.port - b.port),
  });
}
