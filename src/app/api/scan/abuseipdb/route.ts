import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { target, type } = await req.json();

        // AbuseIPDB is primarily for IPs
        if (type !== 'ip') {
            return NextResponse.json({ subScore: 100, findings: [] });
        }

        const apiKey = process.env.ABUSEIPDB_API_KEY;

        if (!apiKey || apiKey === 'your_abuseipdb_key') {
            console.warn('AbuseIPDB API key missing. Returning mock data.');
            return NextResponse.json({
                subScore: 100,
                findings: [],
                raw: { data: { abuseConfidenceScore: 0, totalReports: 0 } }
            });
        }

        const res = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${target}&maxAgeInDays=90`, {
            headers: {
                'Key': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error('AbuseIPDB API error');
        const { data } = await res.json();

        const findings = [];
        let scoreImpact = 0;

        if (data.abuseConfidenceScore > 20) {
            findings.push({
                source: 'AbuseIPDB',
                severity: data.abuseConfidenceScore > 75 ? 'critical' : 'high',
                title: `IP Reputation: ${data.abuseConfidenceScore}% Confidence of Abuse`,
                description: `This IP has been reported ${data.totalReports} times for ${data.lastReportedAt ? 'recent' : 'past'} malicious activity.`,
                recommendation: 'Block this IP address in your firewall if it is not a part of your authorized infrastructure.',
                owasp_category: 'A00:2021-Unknown'
            });
            scoreImpact = data.abuseConfidenceScore;
        } else if (data.totalReports > 0) {
            findings.push({
                source: 'AbuseIPDB',
                severity: 'medium',
                title: 'Suspicious IP History',
                description: `IP has ${data.totalReports} historical abuse reports, but low recent confidence.`,
                recommendation: 'Monitor traffic from this IP closely.',
                owasp_category: 'A00:2021-Unknown'
            });
            scoreImpact = 20;
        }

        return NextResponse.json({
            subScore: 100 - scoreImpact,
            findings,
            raw: data
        });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
