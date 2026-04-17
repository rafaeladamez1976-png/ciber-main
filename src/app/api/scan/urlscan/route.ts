import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target } = await req.json();
        const apiKey = process.env.URLSCAN_API_KEY;

        if (!apiKey || apiKey === 'your_urlscan_key') {
            console.warn('URLScan API key missing. Returning mock data.');
            return NextResponse.json({
                subScore: 100,
                findings: [],
                raw: { stats: { malicious: 0 }, verdicts: { overall: { score: 0 } } }
            });
        }

        // Step 1: Submit scan
        const submitRes = await fetch('https://urlscan.io/api/v1/scan/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-Key': apiKey
            },
            body: JSON.stringify({
                url: target,
                visibility: 'public'
            })
        });

        if (!submitRes.ok) {
            const errorData = await submitRes.json();
            return NextResponse.json({ error: 'URLScan Submission Error: ' + errorData.message }, { status: submitRes.status });
        }

        const submitData = await submitRes.json();
        const uuid = submitData.uuid;

        // Step 2: Poll for results (Reduce initial wait for serverless)
        await new Promise(resolve => setTimeout(resolve, 5000));

        let resultRes = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`);
        let resultData;

        let attempts = 0;
        // Poll every 1.5s up to 3 more times (total ~10s limit)
        while (resultRes.status === 404 && attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            resultRes = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`);
            attempts++;
        }

        resultData = await resultRes.json();

        if (!resultRes.ok) {
            return NextResponse.json({ error: 'Failed to retrieve URLScan results' }, { status: resultRes.status });
        }

        const maliciousCount = resultData.stats?.malicious || 0;
        const scorethreat = resultData.verdicts?.overall?.score || 0;

        const findings = [];
        if (maliciousCount > 0) {
            findings.push({
                source: 'URLScan',
                severity: 'critical',
                title: 'Recursos maliciosos detectados',
                description: `URLScan ha detectado ${maliciousCount} recursos maliciosos cargados por la página.`,
                recommendation: 'Analizar los scripts y recursos externos cargados por el sitio. Eliminar cualquier referencia a dominios maliciosos.',
                owasp_category: 'A00:2021-Malware'
            });
        }

        let subScore = 100 - scorethreat;
        if (subScore < 0) subScore = 0;

        return NextResponse.json({
            subScore,
            findings,
            raw: resultData
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
