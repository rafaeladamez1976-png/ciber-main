'use client';

import { useState, useEffect } from 'react';
import ScanForm from '@/components/scanner/ScanForm';
import ScanProgress from '@/components/scanner/ScanProgress';
import ScanResults from '@/components/scanner/ScanResults';
import { createClient } from '@/lib/supabase/client';
import { Scan } from '@/types/scan';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScanReportPDF from '@/components/scanner/ScanReportPDF';
import GlassCard from '@/components/ui/GlassCard';
import { XCircle } from 'lucide-react';

export default function ScannerPage() {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'completed' | 'error'>('idle');
    const [currentScan, setCurrentScan] = useState<Scan | null>(null);
    const [progress, setProgress] = useState(0);
    const supabase = createClient();

    const dummyScan: Scan = {
        id: 'dummy',
        target: 'example.com',
        target_type: 'domain',
        status: 'completed',
        score: 85,
        risk_level: 'low',
        findings: [
            {
                id: '1',
                scan_id: 'dummy',
                source: 'VirusTotal',
                severity: 'low',
                title: 'Clean Reputation',
                description: 'The domain has a clean reputation on VirusTotal.',
                recommendation: 'No action needed.',
                owasp_category: 'A01'
            },
            {
                id: '2',
                scan_id: 'dummy',
                source: 'SSL Labs',
                severity: 'medium',
                title: 'Weak Cipher Support',
                description: 'The server supports some weak ciphers.',
                recommendation: 'Disable TLS 1.0 and 1.1.',
                owasp_category: 'A02'
            }
        ],
        api_results: {
            'VirusTotal': { status: 'ok' },
            'SSL Labs': { grade: 'B' },
            'HTTP Headers': { missing: ['CSP'] },
            'URLScan': { score: 100 },
            'ThreatCrowd': { status: 'completed' },
            'AbuseIPDB': { confidence_score: 0 },
            'IPInfo': { country: 'US' },
            'HIBP': { breaches: 0 }
        },
        owasp_results: {
            'A01': { status: 'ok', count: 0 },
            'A02': { status: 'warning', count: 1 },
            'A03': { status: 'ok', count: 0 }
        },
        headers_results: {},
        created_at: new Date().toISOString()
    };

    const handleStartScan = async (formData: { target: string, clientId: string, emails: string[] }) => {
        try {
            setStatus('scanning');
            setProgress(5);

            // Simular progreso de escaneo para que el usuario vea avance (algunas APIs tardan)
            const fakeProgressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 2;
                });
            }, 1000);

            const res = await fetch('/api/scan/orchestrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const { scanId, error, isEphemeral, scanResult } = await res.json();

            clearInterval(fakeProgressInterval);

            if (error) throw new Error(error);

            if (isEphemeral) {
                const ephemeralScan: Scan = {
                    id: scanId,
                    target: formData.target,
                    target_type: /^(\d{1,3}\.){3}\d{1,3}$/.test(formData.target) ? 'ip' : 'domain',
                    status: 'completed',
                    score: scanResult.score,
                    risk_level: scanResult.riskLevel,
                    findings: scanResult.allFindings,
                    api_results: scanResult.api_results,
                    owasp_results: scanResult.owasp_results,
                    headers_results: {},
                    created_at: new Date().toISOString()
                };
                setCurrentScan(ephemeralScan);
                setProgress(100);
                setStatus('completed');
                return;
            }

            // Start polling (Solo si no es efímero)
            pollScan(scanId);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const pollScan = async (scanId: string) => {
        const supabase = createClient();

        if (!supabase) {
            console.warn('Supabase not configured. Simulating scan for development...');
            setCurrentScan({ ...dummyScan, target: scanId.split('-').slice(2).join('-') || 'example.com' });
            // Simulate progress for dev
            let simulatedProgress = 5;
            const simInterval = setInterval(() => {
                simulatedProgress += 15;
                if (simulatedProgress >= 100) {
                    setProgress(100);
                    setStatus('completed');
                    clearInterval(simInterval);
                } else {
                    setProgress(simulatedProgress);
                }
            }, 2000);
            return;
        }

        const interval = setInterval(async () => {
            const { data: scan, error } = await supabase
                .from('scans')
                .select(`
          *,
          findings (*)
        `)
                .eq('id', scanId)
                .single();

            if (error) {
                console.error('Polling error:', error);
                return;
            }

            const scanData = scan as Scan;
            setCurrentScan(scanData);

            // Calculate progress based on status and filled results
            if (scanData.status === 'completed') {
                setProgress(100);
                setStatus('completed');
                clearInterval(interval);
            } else if (scanData.status === 'running') {
                // Estimate progress based on how many APIs have returned results stored in api_results
                const resultsCount = Object.keys(scanData.api_results || {}).length;
                const totalApis = 8; // VT, SSL, Headers, URLScan, ThreatCrowd, AbuseIPDB, IPInfo, HIBP
                const calculatedProgress = Math.min(95, 10 + (resultsCount / totalApis) * 85);
                setProgress(calculatedProgress);
            } else if (scanData.status === 'error') {
                setStatus('error');
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    };

    const steps = [
        { id: 'vt', name: 'VirusTotal', desc: 'Base de datos de malware', status: getStepStatus(currentScan, 'VirusTotal') },
        { id: 'threatcrowd', name: 'ThreatCrowd', desc: 'OSINT y Redes', status: getStepStatus(currentScan, 'ThreatCrowd') },
        { id: 'abuseipdb', name: 'AbuseIPDB', desc: 'Reputación de IP', status: getStepStatus(currentScan, 'AbuseIPDB') },
        { id: 'ssl', name: 'SSL Labs', desc: 'Verificación de certificado', status: getStepStatus(currentScan, 'SSL Labs') },
        { id: 'headers', name: 'HTTP Headers', desc: 'Políticas de seguridad', status: getStepStatus(currentScan, 'HTTP Headers') },
        { id: 'urlscan', name: 'URLScan.io', desc: 'Comportamiento y recursos', status: getStepStatus(currentScan, 'URLScan') },
        { id: 'ipinfo', name: 'IPInfo', desc: 'Geolocalización y ASN', status: getStepStatus(currentScan, 'IPInfo') },
        { id: 'hibp', name: 'HIBP', desc: 'Filtraciones de datos', status: getStepStatus(currentScan, 'HIBP') },
    ];

    function getStepStatus(scan: Scan | null, source: string): 'pending' | 'running' | 'completed' | 'error' {
        if (!scan) return 'pending';
        if (scan.api_results && scan.api_results[source]) return 'completed';
        if (scan.status === 'running') return 'running';
        if (scan.status === 'completed' && (!scan.api_results || !scan.api_results[source])) return 'pending';
        return 'pending';
    }

    const handleDownloadPdf = () => {
        console.log('Generating PDF...');
        // Implementation for PDF generation will go here
    };

    return (
        <div className="flex flex-col items-center">
            <header className="mb-8 sm:mb-12 text-center">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2 uppercase italic">Scanner de Seguridad</h2>
                <p className="text-primary font-mono text-[10px] sm:text-sm tracking-widest uppercase">Detectando vulnerabilidades en tiempo real</p>
            </header>

            {(status === 'idle' || status === 'scanning') && progress === 0 && (
                <ScanForm onStart={handleStartScan} isLoading={status === 'scanning'} />
            )}

            {(status === 'scanning' || (status === 'completed' && progress < 100)) && (
                <ScanProgress
                    steps={steps as any}
                    target={currentScan?.target || ''}
                    progress={progress}
                />
            )}

            {status === 'completed' && progress === 100 && currentScan && (
                <div className="w-full flex flex-col items-center">
                    <ScanResults
                        scan={currentScan}
                        onDownloadPdf={() => { }} // Not used as we have the download link component
                    />
                    <div className="mt-4 flex justify-center pb-12">
                        <PDFDownloadLink
                            document={<ScanReportPDF scan={currentScan} />}
                            fileName={`SIAR-C-Informe-${currentScan.target}-${new Date().toISOString().split('T')[0]}.pdf`}
                            className="bg-primary text-[#0a0a0a] px-8 py-4 rounded-xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-3"
                        >
                            {({ loading }) => (loading ? 'GENERANDO ARCHIVO...' : 'DESCARGAR INFORME PDF COMPLETO')}
                        </PDFDownloadLink>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <GlassCard className="p-8 border-red-500/20 text-center">
                    <XCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold">Error en el Análisis</h3>
                    <p className="text-slate-500 mt-2">Hubo un problema al procesar el escaneo. Por favor, inténtalo de nuevo.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        VOLVER AL FORMULARIO
                    </button>
                </GlassCard>
            )}
        </div>
    );
}

