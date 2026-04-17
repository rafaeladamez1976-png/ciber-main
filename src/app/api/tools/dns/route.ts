import { NextResponse } from 'next/server';
import * as dns from 'dns/promises';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  const results: Record<string, any> = {};
  const issues: string[] = [];

  await Promise.allSettled([
    dns.resolve4(domain).then(r => { results.A = r; }).catch(() => { results.A = []; }),
    dns.resolve6(domain).then(r => { results.AAAA = r; }).catch(() => { results.AAAA = []; }),
    dns.resolveMx(domain).then(r => { results.MX = r; }).catch(() => { results.MX = []; }),
    dns.resolveTxt(domain).then(r => { results.TXT = r.map(t => t.join('')); }).catch(() => { results.TXT = []; }),
    dns.resolveNs(domain).then(r => { results.NS = r; }).catch(() => { results.NS = []; }),
    dns.resolveCname(domain).then(r => { results.CNAME = r; }).catch(() => { results.CNAME = []; }),
    dns.resolveSoa(domain).then(r => { results.SOA = r; }).catch(() => { results.SOA = null; }),
  ]);

  // Security checks
  const txtRecords: string[] = results.TXT || [];
  const hasSPF = txtRecords.some(t => t.startsWith('v=spf1'));
  const hasDKIM = txtRecords.some(t => t.includes('DKIM') || t.includes('dkim'));
  const hasDMARC = txtRecords.some(t => t.startsWith('v=DMARC1'));

  if (!hasSPF) issues.push('Sin registro SPF — riesgo de spoofing de correo');
  if (!hasDMARC) issues.push('Sin registro DMARC — sin política anti-spoofing');
  if (results.MX?.length > 0 && !hasSPF) issues.push('Servidores de correo detectados sin SPF configurado');
  if (results.NS?.length < 2) issues.push('Solo 1 servidor NS — sin redundancia DNS');

  return NextResponse.json({
    domain,
    records: results,
    security: { hasSPF, hasDKIM, hasDMARC },
    issues,
    score: Math.max(0, 100 - issues.length * 20),
    resolvedAt: new Date().toISOString(),
  });
}
