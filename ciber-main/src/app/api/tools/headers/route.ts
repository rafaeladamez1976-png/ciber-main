import { NextResponse } from 'next/server';

const SECURITY_HEADERS = [
  { name: 'Strict-Transport-Security', desc: 'Fuerza HTTPS', severity: 'high', check: (v: string) => v.includes('max-age') },
  { name: 'Content-Security-Policy', desc: 'Previene XSS e inyección', severity: 'high', check: (v: string) => v.length > 0 },
  { name: 'X-Frame-Options', desc: 'Previene clickjacking', severity: 'medium', check: (v: string) => ['DENY', 'SAMEORIGIN'].includes(v.toUpperCase()) },
  { name: 'X-Content-Type-Options', desc: 'Previene MIME sniffing', severity: 'medium', check: (v: string) => v.toLowerCase() === 'nosniff' },
  { name: 'X-XSS-Protection', desc: 'Protección XSS del navegador', severity: 'low', check: (v: string) => v.startsWith('1') },
  { name: 'Referrer-Policy', desc: 'Controla información de referencia', severity: 'low', check: (v: string) => v.length > 0 },
  { name: 'Permissions-Policy', desc: 'Restringe APIs del navegador', severity: 'low', check: (v: string) => v.length > 0 },
  { name: 'Cross-Origin-Opener-Policy', desc: 'Aislamiento de contexto', severity: 'medium', check: (v: string) => v.length > 0 },
  { name: 'Cross-Origin-Resource-Policy', desc: 'Controla carga de recursos', severity: 'low', check: (v: string) => v.length > 0 },
  { name: 'Cache-Control', desc: 'Control de caché seguro', severity: 'info', check: (v: string) => v.includes('no-store') || v.includes('no-cache') },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  let targetUrl = url;
  if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    }).finally(() => clearTimeout(timeout));

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });

    const checks = SECURITY_HEADERS.map(h => {
      const headerValue = headers[h.name.toLowerCase()];
      const present = !!headerValue;
      const valid = present && h.check(headerValue);
      return {
        name: h.name,
        desc: h.desc,
        severity: h.severity,
        present,
        valid,
        value: headerValue || null,
        status: !present ? 'missing' : valid ? 'ok' : 'misconfigured',
      };
    });

    const missing = checks.filter(c => !c.present);
    const misconfigs = checks.filter(c => c.present && !c.valid);
    const highRisk = checks.filter(c => c.severity === 'high' && !c.valid);
    const grade = highRisk.length >= 2 ? 'F' : highRisk.length === 1 ? 'D' :
      misconfigs.length >= 3 ? 'C' : missing.length >= 3 ? 'B' : 'A';

    return NextResponse.json({
      url: targetUrl,
      finalUrl: response.url,
      status: response.status,
      grade,
      score: Math.max(0, 100 - missing.length * 8 - misconfigs.length * 5 - highRisk.length * 15),
      checks,
      summary: { total: checks.length, ok: checks.filter(c => c.valid).length, missing: missing.length, misconfigs: misconfigs.length },
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: `No se pudo conectar: ${err.message}` }, { status: 500 });
  }
}
