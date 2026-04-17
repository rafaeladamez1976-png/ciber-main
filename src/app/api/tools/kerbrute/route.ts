import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const dc = searchParams.get('dc'); // Optional Domain Controller IP

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  try {
    // Attempt to run kerbrute if available, otherwise return simulated data
    // In a real environment, we'd check if the binary exists
    let results = [];
    
    try {
      // This is a placeholder for where the actual command would go
      // const { stdout } = await execAsync(`kerbrute userenum -d ${domain} --dc ${dc || domain} userlist.txt`);
      // Since we don't have the tool, we simulate the output for the UI demonstration
      throw new Error('Tool not found');
    } catch {
      // Simulation for UI/Demo purposes
      results = [
        { user: 'administrator', status: 'present', method: 'Kerberos Pre-Auth' },
        { user: 'guest', status: 'disabled', method: 'Kerberos Pre-Auth' },
        { user: 'krbtgt', status: 'present', method: 'Kerberos Pre-Auth' },
        { user: 'svc_sql', status: 'present', method: 'Kerberos Pre-Auth' },
        { user: 'j.doe', status: 'present', method: 'Kerberos Pre-Auth' },
        { user: 'backup_admin', status: 'present', method: 'Kerberos Pre-Auth' },
      ];
    }

    return NextResponse.json({
      domain,
      dc: dc || 'Auto-detected',
      scannedAt: new Date().toISOString(),
      tool: 'Kerbrute v1.0.3 (Simulated)',
      usersFound: results.length,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
