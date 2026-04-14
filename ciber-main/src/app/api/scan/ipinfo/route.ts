import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target } = await req.json(); // target is the IP
        const token = process.env.IPINFO_TOKEN;

        const endpoint = token
            ? `https://ipinfo.io/${target}/json?token=${token}`
            : `https://ipinfo.io/${target}/json`;

        const res = await fetch(endpoint);
        if (!res.ok) {
            return NextResponse.json({ error: 'IPInfo API error' }, { status: res.status });
        }

        const data = await res.json();
        const findings = [];

        if (data.bogon) {
            findings.push({
                source: 'IPInfo',
                severity: 'info',
                title: 'IP privada o reservada (Bogon)',
                description: `La IP ${target} está clasificada como bogon (espacio de direcciones no asignado o privado).`,
                recommendation: 'Esta información es puramente informativa. No se requiere acción a menos que la IP deba ser pública.',
                owasp_category: 'A00:2021-Information'
            });
        }

        return NextResponse.json({
            subScore: 100, // IPInfo usually doesn't affect security score directly unless categorized
            findings,
            raw: data
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
