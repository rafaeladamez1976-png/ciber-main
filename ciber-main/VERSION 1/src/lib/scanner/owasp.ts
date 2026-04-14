import { Finding } from "@/types/scan";

export const OWASP_CATEGORIES = [
    { id: 'A01', name: 'Broken Access Control' },
    { id: 'A02', name: 'Cryptographic Failures' },
    { id: 'A03', name: 'Injection' },
    { id: 'A04', name: 'Insecure Design' },
    { id: 'A05', name: 'Security Misconfiguration' },
    { id: 'A06', name: 'Vulnerable and Outdated Components' },
    { id: 'A07', name: 'Identification and Authentication Failures' },
    { id: 'A08', name: 'Software and Data Integrity Failures' },
    { id: 'A09', name: 'Security Logging and Monitoring Failures' },
    { id: 'A10', name: 'Server-Side Request Forgery' },
];

/**
 * Intelligent mapping of findings to OWASP Top 10 categories.
 * Includes heuristics for findings with missing or generic categories.
 */
export function mapToOWASP(findings: Finding[]) {
    const result: Record<string, { status: 'ok' | 'warning' | 'critical', count: number }> = {};

    OWASP_CATEGORIES.forEach(cat => {
        result[cat.id] = { status: 'ok', count: 0 };
    });

    findings.forEach(finding => {
        let catId = (finding.owasp_category || '').split(':')[0].toUpperCase();

        // Heuristics for missing or generic (A00) categories
        if (!catId || catId === 'A00' || !result[catId]) {
            const title = (finding.title || '').toLowerCase();
            const source = (finding.source || '').toLowerCase();

            if (title.includes('ssl') || title.includes('tls') || title.includes('crypto')) {
                catId = 'A02';
            } else if (title.includes('header') || title.includes('config') || source === 'abuseipdb' || source === 'threatcrowd') {
                catId = 'A05'; // Reputational issues and misconfigs often fall here
            } else if (title.includes('breach') || title.includes('pwned') || source === 'hibp') {
                catId = 'A07'; // Credential exposures
            } else if (title.includes('injection') || title.includes('xss') || title.includes('sql')) {
                catId = 'A03';
            } else if (title.includes('vulnerable') || title.includes('cve') || title.includes('outdated')) {
                catId = 'A06';
            } else {
                // Default fallback if no heuristic matches
                catId = 'A05';
            }
        }

        if (result[catId]) {
            result[catId].count++;
            if (finding.severity === 'critical' || finding.severity === 'high') {
                result[catId].status = 'critical';
            } else if (result[catId].status !== 'critical') {
                result[catId].status = 'warning';
            }
        }
    });

    return result;
}
