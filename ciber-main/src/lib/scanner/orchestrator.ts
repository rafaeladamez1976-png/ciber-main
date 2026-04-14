import { createClient } from "../supabase/server";
import { calculateScore } from "./scorer";
import { mapToOWASP } from "./owasp";

export async function runScan(scanId: string, target: string, type: 'domain' | 'ip', emails?: string[]) {
    const supabase = await createClient();
    if (!supabase) {
        console.warn('Supabase not configured. Running scan in ephemeral mode (results will not be saved to DB).');
    }

    // 1. Update status to 'running' (solo si hay DB)
    if (supabase) {
        await supabase
            .from('scans')
            .update({ status: 'running' })
            .eq('id', scanId);
    }

    // Helper to call internal APIs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` :
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));

    async function callApi(endpoint: string, body: unknown, source: string) {
        try {
            const res = await fetch(`${baseUrl}/api/scan/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`API ${source} returned ${res.status}`);
            const data = await res.json();
            return { ...data, source };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Error calling ${source} API:`, message);
            return { error: message, source, raw: { error: message } };
        }
    }

    // 2. Launch all APIs in PARALLEL
    const results = await Promise.allSettled([
        callApi('virustotal', { target, type }, 'VirusTotal'),
        type === 'domain' ? callApi('ssllabs', { target }, 'SSL Labs') : Promise.resolve(null),
        type === 'domain' ? callApi('headers', { target }, 'HTTP Headers') : Promise.resolve(null),
        type === 'domain' ? callApi('urlscan', { target }, 'URLScan') : Promise.resolve(null),
        callApi('threatcrowd', { target, type }, 'ThreatCrowd'),
        type === 'ip' ? callApi('abuseipdb', { target, type }, 'AbuseIPDB') : Promise.resolve(null),
        type === 'ip' ? callApi('ipinfo', { target }, 'IPInfo') : Promise.resolve(null),
        (emails && emails.length > 0) ? callApi('hibp', { emails }, 'HIBP') : Promise.resolve(null),
    ]);

    // 3. Aggregate all findings
    const allFindings = results
        .filter((r): r is PromiseFulfilledResult<{ findings?: any[], source: string, raw?: any }> => r.status === 'fulfilled' && r.value !== null)
        .flatMap(r => r.value.findings || []);

    // 4. Calculate score
    const { score, riskLevel } = calculateScore(results);

    // 5. Map to OWASP
    const owaspResults = mapToOWASP(allFindings);

    // 6. Save findings to Supabase
    if (supabase && allFindings.length > 0) {
        const findingsToInsert = allFindings.map(f => ({
            scan_id: scanId,
            ...f
        }));
        await supabase.from('findings').insert(findingsToInsert);
    }

    // 7. Update scan record
    const api_results: Record<string, unknown> = {};
    results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value) {
            api_results[r.value.source] = r.value.raw;
        }
    });

    if (supabase) {
        const { error: updateError } = await supabase
            .from('scans')
            .update({
                status: 'completed',
                score,
                risk_level: riskLevel,
                api_results,
                owasp_results: owaspResults,
                completed_at: new Date().toISOString()
            })
            .eq('id', scanId);

        if (updateError) {
            console.error('Error updating scan results:', updateError);
        }
    }

    return { scanId, score, riskLevel, allFindings, api_results, owasp_results: owaspResults };
}
