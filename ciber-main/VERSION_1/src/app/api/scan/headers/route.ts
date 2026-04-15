import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target } = await req.json();

        const response = await fetch(`https://${target}`, {
            method: 'HEAD',
            redirect: 'follow'
        }).catch(() => null);

        if (!response) {
            return NextResponse.json({ error: 'No se pudo conectar al dominio' }, { status: 502 });
        }

        const headers = Object.fromEntries(response.headers.entries());

        const securityHeaders = [
            { name: 'strict-transport-security', owasp: 'A05', severity: 'high', title: 'HSTS no configurado' },
            { name: 'content-security-policy', owasp: 'A05', severity: 'high', title: 'CSP ausente' },
            { name: 'x-frame-options', owasp: 'A05', severity: 'medium', title: 'Protección clickjacking ausente' },
            { name: 'x-content-type-options', owasp: 'A05', severity: 'medium', title: 'MIME sniffing habilitado' },
            { name: 'referrer-policy', owasp: 'A05', severity: 'low', title: 'Referrer Policy no definida' },
            { name: 'permissions-policy', owasp: 'A05', severity: 'low', title: 'Permissions Policy ausente' },
        ];

        const findings = [];
        let presentCount = 0;

        for (const sh of securityHeaders) {
            if (headers[sh.name]) {
                presentCount++;
            } else {
                findings.push({
                    source: 'HTTP Headers',
                    severity: sh.severity as any,
                    title: sh.title,
                    description: `El encabezado de seguridad '${sh.name}' no está presente en la respuesta del servidor.`,
                    recommendation: `Implementar el encabezado ${sh.name.toUpperCase()} con una política adecuada.`,
                    owasp_category: sh.owasp
                });
            }
        }

        const subScore = (presentCount / securityHeaders.length) * 100;

        return NextResponse.json({
            subScore,
            findings,
            raw: headers
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
