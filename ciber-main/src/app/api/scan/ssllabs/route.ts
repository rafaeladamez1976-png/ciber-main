import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target } = await req.json(); // target is the domain

        // Step 1: Start analysis
        let res = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${target}&startNew=on&all=done`);
        let data = await res.json();

        // Step 2: Polling (simplified for the handler, orchestrator should ideally handle long waits or we do it here with a timeout)
        // For a serverless function, we should be careful with long execution times.
        // However, the orchestrator call will wait.

        let attempts = 0;
        while (data.status !== 'READY' && data.status !== 'ERROR' && attempts < 15) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            res = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${target}&all=done`);
            data = await res.json();
            attempts++;
        }

        if (data.status !== 'READY') {
            return NextResponse.json({ error: 'SSL Labs scan timed out or failed', status: data.status }, { status: 504 });
        }

        const endpoint = data.endpoints?.[0];
        const grade = endpoint?.grade || 'F';

        // Sub-score by grade: A+ o A → 100 | B → 75 | C → 50 | D → 25 | F o T → 0
        let subScore = 0;
        if (grade.startsWith('A')) subScore = 100;
        else if (grade === 'B') subScore = 75;
        else if (grade === 'C') subScore = 50;
        else if (grade === 'D') subScore = 25;

        const findings = [];
        if (!grade.startsWith('A')) {
            findings.push({
                source: 'SSL Labs',
                severity: grade === 'F' || grade === 'T' ? 'critical' : 'high',
                title: `Configuración SSL deficiente (Grado ${grade})`,
                description: `El servidor tiene una calificación de seguridad SSL de ${grade}.`,
                recommendation: 'Mejorar la configuración del servidor web, desactivar protocolos obsoletos y asegurar el uso de suites de cifrado fuertes.',
                owasp_category: 'A05:2021-Security Misconfiguration'
            });
        }

        // Check for TLS 1.0/1.1
        const protocols = endpoint?.details?.protocols || [];
        const obsoleteProtocols = protocols.filter((p: { version: string }) => p.version === '1.0' || p.version === '1.1');
        if (obsoleteProtocols.length > 0) {
            findings.push({
                source: 'SSL Labs',
                severity: 'high',
                title: 'Protocolo TLS obsoleto detectado',
                description: `Se detectó soporte para TLS ${obsoleteProtocols.map((p: { version: string }) => p.version).join(', ')}.`,
                recommendation: 'Deshabilitar TLS 1.0 y 1.1 en el servidor web. Forzar TLS 1.2 o superior.',
                owasp_category: 'A02:2021-Cryptographic Failures'
            });
        }

        return NextResponse.json({
            subScore,
            findings,
            raw: data
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
