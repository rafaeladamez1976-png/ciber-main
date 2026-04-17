import { Severity } from "@/types/scan";

export function calculateScore(results: any[]) {
    // VirusTotal: 30% del score
    // SSL Labs: 25%
    // Headers HTTP: 25%
    // URLScan: 15%
    // HIBP: 5%

    const weights: Record<string, number> = {
        'VirusTotal': 0.20,
        'SSL Labs': 0.15,
        'HTTP Headers': 0.15,
        'URLScan': 0.10,
        'ThreatCrowd': 0.10,
        'AbuseIPDB': 0.15,
        'IPInfo': 0.10,
        'HIBP': 0.05
    };

    let weightedSum = 0;
    let totalWeight = 0;

    results.forEach(res => {
        if (res.status === 'fulfilled' && res.value && !res.value.error) {
            const source = res.value.source;
            const score = typeof res.value.subScore === 'number' ? res.value.subScore : 100;
            const weight = weights[source] || 0;

            weightedSum += score * weight;
            totalWeight += weight;
        }
    });

    // Normalize if some APIs failed
    let finalScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    // Penalizaciones adicionales
    const allFindings = results
        .filter(r => r.status === 'fulfilled' && r.value?.findings)
        .flatMap(r => r.value.findings);

    const criticals = allFindings.filter(f => f.severity === 'critical').length;
    const highs = allFindings.filter(f => f.severity === 'high').length;
    const mediums = allFindings.filter(f => f.severity === 'medium').length;

    if (criticals > 0) finalScore -= 20;
    finalScore -= Math.min(30, highs * 10);
    finalScore -= Math.min(15, mediums * 5);

    finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

    let riskLevel: Severity = 'low';
    if (finalScore < 40) riskLevel = 'critical';
    else if (finalScore < 60) riskLevel = 'high';
    else if (finalScore < 80) riskLevel = 'medium';

    return { score: finalScore, riskLevel };
}
