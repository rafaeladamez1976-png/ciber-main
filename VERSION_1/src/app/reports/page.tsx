'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Eye,
    Trash2,
    Calendar,
    Shield,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { Scan } from '@/types/scan';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScanReportPDF from '@/components/scanner/ScanReportPDF';

export default function ReportsPage() {
    const [reports, setReports] = useState<Scan[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterRisk, setFilterRisk] = useState<string>('all');

    const supabase = createClient();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        if (!supabase) {
            // Mock data for development
            setTimeout(() => {
                const mockReports: Scan[] = [
                    {
                        id: 's1',
                        target: 'enterprise-data.net',
                        target_type: 'domain',
                        status: 'completed',
                        score: 42,
                        risk_level: 'critical',
                        findings: [],
                        api_results: {},
                        owasp_results: {},
                        headers_results: {},
                        created_at: new Date(Date.now() - 86400000).toISOString()
                    },
                    {
                        id: 's2',
                        target: 'safeweb-portal.io',
                        target_type: 'domain',
                        status: 'completed',
                        score: 89,
                        risk_level: 'low',
                        findings: [],
                        api_results: {},
                        owasp_results: {},
                        headers_results: {},
                        created_at: new Date(Date.now() - 172800000).toISOString()
                    },
                    {
                        id: 's3',
                        target: '192.168.100.45',
                        target_type: 'ip',
                        status: 'completed',
                        score: 65,
                        risk_level: 'medium',
                        findings: [],
                        api_results: {},
                        owasp_results: {},
                        headers_results: {},
                        created_at: new Date(Date.now() - 259200000).toISOString()
                    }
                ];
                setReports(mockReports);
                setIsLoading(false);
            }, 800);
            return;
        }

        const { data, error } = await supabase
            .from('scans')
            .select(`
                *,
                findings (*)
            `)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });

        if (data) setReports(data);
        if (error) console.error('Error fetching reports:', error);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este reporte permanentemente?')) return;

        if (!supabase) {
            setReports(prev => prev.filter(r => r.id !== id));
            return;
        }

        const { error } = await supabase.from('scans').delete().eq('id', id);
        if (error) alert('Error: ' + error.message);
        else fetchReports();
    };

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.target.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'all' || r.risk_level === filterRisk;
        return matchesSearch && matchesRisk;
    });

    const avgScore = reports.length > 0
        ? Math.round(reports.reduce((acc, r) => acc + (r.score || 0), 0) / reports.length)
        : 0;

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <FileText className="text-primary sm:size-32" size={24} />
                        Centro de Reportes
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Historial detallado de análisis y diagnósticos de seguridad</p>
                </div>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-primary">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generados</p>
                        <h3 className="text-2xl font-black text-white">{reports.length}</h3>
                        <p className="text-[10px] text-primary font-bold uppercase">Reportes listos</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-info">
                    <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score Promedio</p>
                        <h3 className="text-2xl font-black text-white">{avgScore}%</h3>
                        <p className="text-[10px] text-info font-bold uppercase">Nivel de confianza</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-danger">
                    <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Riesgos Críticos</p>
                        <h3 className="text-2xl font-black text-white">
                            {reports.filter(r => r.risk_level === 'critical').length}
                        </h3>
                        <p className="text-[10px] text-danger font-bold uppercase">Requieren atención</p>
                    </div>
                </GlassCard>
            </div>

            {/* Filters Bar */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por dominio o dirección IP..."
                        className="w-full bg-black/20 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10 w-full md:w-auto">
                    <Filter size={16} className="text-slate-500 ml-2" />
                    <select
                        value={filterRisk}
                        onChange={e => setFilterRisk(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none pr-4"
                    >
                        <option value="all">TODOS LOS RIESGOS</option>
                        <option value="critical">CRÍTICO</option>
                        <option value="high">ALTO</option>
                        <option value="medium">MEDIO</option>
                        <option value="low">BAJO</option>
                    </select>
                </div>
            </GlassCard>

            {/* Reports List */}
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                    ))
                ) : filteredReports.length > 0 ? (
                    <AnimatePresence>
                        {filteredReports.map((report, idx) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <GlassCard className="p-1 hover:bg-white/[0.05] transition-all group overflow-hidden">
                                    <div className="flex items-center gap-4 p-4">
                                        {/* Status Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${report.risk_level === 'critical' ? 'bg-danger/20 text-danger' :
                                            report.risk_level === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                                report.risk_level === 'medium' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                                            }`}>
                                            {report.score && report.score > 80 ? <CheckCircle2 size={24} /> : <Shield size={24} />}
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">
                                                {report.target}
                                            </h4>
                                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(report.created_at).toLocaleDateString()}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded border ${report.risk_level === 'critical' ? 'border-danger/30 text-danger bg-danger/5' :
                                                    report.risk_level === 'high' ? 'border-orange-500/30 text-orange-500 bg-orange-500/5' :
                                                        report.risk_level === 'medium' ? 'border-warning/30 text-warning bg-warning/5' : 'border-primary/30 text-primary bg-primary/5'
                                                    }`}>
                                                    RIESGO {report.risk_level?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Score Gauge */}
                                        <div className="hidden md:flex flex-col items-center px-6 border-x border-white/10">
                                            <span className={`text-2xl font-black ${(report.score || 0) > 80 ? 'text-primary' :
                                                (report.score || 0) > 50 ? 'text-warning' : 'text-danger'
                                                }`}>{report.score}%</span>
                                            <span className="text-[8px] font-bold text-slate-600 uppercase">Seguridad</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pl-4">
                                            <PDFDownloadLink
                                                document={<ScanReportPDF scan={report} />}
                                                fileName={`SIAR-C-Report-${report.target}.pdf`}
                                                className="p-3 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all text-slate-400"
                                                title="Descargar PDF"
                                            >
                                                {({ loading }) => loading ? <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Download size={20} />}
                                            </PDFDownloadLink>

                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="p-3 bg-white/5 rounded-xl hover:bg-danger/20 hover:text-danger transition-all text-slate-400"
                                                title="Eliminar Reporte"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress indicator or highlight for severe reports */}
                                    {report.risk_level === 'critical' && (
                                        <div className="h-1 w-full bg-danger/20">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                className="h-full bg-danger shadow-[0_0_10px_#ff4d4d]"
                                            />
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="py-20 text-center">
                        <FileText size={48} className="text-slate-800 mx-auto mb-4" />
                        <h4 className="text-white font-bold text-xl">No hay reportes disponibles</h4>
                        <p className="text-slate-500 mt-2">Realiza un escaneo para generar tu primer informe de seguridad.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
