import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target, type } = await req.json();
        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        if (!apiKey || apiKey === 'your_virustotal_key') {
            console.warn('VirusTotal API key missing. Returning mock data.');
            return NextResponse.json({
                subScore: 100,
                findings: [],
                raw: { last_analysis_stats: { malicious: 0, suspicious: 0, harmless: 70, undetected: 20 } }
            });
        }

        // Sanitizamos el target por si el usuario inserta "https://ejemplo.com/ruta"
        // VirusTotal (y otras APIs) solo acepta el dominio puro o la IP pura.
        const cleanTarget = target.replace(/^https?:\/\//i, '').split('/')[0].trim();

        const endpoint = type === 'domain'
            ? `https://www.virustotal.com/api/v3/domains/${cleanTarget}`
            : `https://www.virustotal.com/api/v3/ip_addresses/${cleanTarget}`;

        const res = await fetch(endpoint, {
            headers: { 'x-apikey': apiKey }
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.error?.message || 'VirusTotal API error' }, { status: res.status });
        }

        const data = await res.json();
        const stats = data.data.attributes.last_analysis_stats;
        const malicious = stats.malicious || 0;

        // Calculate sub-score
        let subScore = 100;
        if (malicious > 2) subScore = 0;
        else if (malicious > 0) subScore = 50;

        const findings = [];
        if (malicious > 0) {
            findings.push({
                source: 'VirusTotal',
                severity: malicious > 2 ? 'critical' : 'high',
                title: `Detecciones de malware: ${malicious}`,
                description: `Se han encontrado ${malicious} motores que marcan este target como malicioso.`,
                recommendation: 'Revisar la reputación del dominio/IP y realizar una limpieza profunda si es necesario.',
                owasp_category: 'A00:2021-Common Threats'
            });
        }

        return NextResponse.json({
            subScore,
            findings,
            raw: data.data.attributes
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
