import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { emails } = await req.json();
        const apiKey = process.env.HIBP_API_KEY;

        if (!apiKey || apiKey === 'your_hibp_key') {
            console.warn('HIBP API key missing. Returning mock data.');
            return NextResponse.json({
                subScore: 100,
                findings: [],
                raw: { info: 'Mock mode: no breaches found' }
            });
        }

        if (!emails || !Array.isArray(emails)) {
            return NextResponse.json({ error: 'Emails list is required' }, { status: 400 });
        }

        const allFindings: any[] = [];
        const rawResults: any = {};

        for (const email of emails) {
            const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
                headers: {
                    'hibp-api-key': apiKey,
                    'user-agent': 'SIAR-C'
                }
            });

            if (res.status === 200) {
                const breaches = await res.json();
                rawResults[email] = breaches;

                for (const breach of breaches) {
                    const breachDate = new Date(breach.BreachDate);
                    const yearsAgo = (new Date().getTime() - breachDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

                    allFindings.push({
                        source: 'HIBP',
                        severity: yearsAgo < 2 ? 'critical' : 'high',
                        title: `Filtración de datos: ${breach.Name}`,
                        description: `El email ${email} fue encontrado en la filtración ${breach.Title}. Datos expuestos: ${breach.DataClasses.join(', ')}.`,
                        recommendation: `Cambiar la contraseña de la cuenta ${email} y activar autenticación de dos factores (2FA).`,
                        owasp_category: 'A04:2021-Insecure Design'
                    });
                }
            } else if (res.status === 404) {
                rawResults[email] = [];
            } else {
                // Rate limit or other error
                rawResults[email] = { error: 'HIBP API status ' + res.status };
            }

            // Wait a bit to avoid HIBP rate limits (only if more emails remain)
            if (emails.indexOf(email) < emails.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        const subScore = allFindings.length > 0 ? Math.max(0, 100 - (allFindings.length * 10)) : 100;

        return NextResponse.json({
            subScore,
            findings: allFindings,
            raw: rawResults
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
