'use client';

import { useState } from 'react';
import { 
    Terminal, 
    ShieldAlert, 
    Globe, 
    Search, 
    Activity, 
    Zap, 
    Lock, 
    Server, 
    ShieldCheck,
    ArrowRight,
    Loader2,
    RefreshCw,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

type ToolType = 'ports' | 'dns' | 'headers' | 'kerbrute' | 'metasploit' | 'network';

export default function SecurityToolsPage() {
    const [activeTool, setActiveTool] = useState<ToolType>('ports');
    const [target, setTarget] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runTool = async () => {
        if (!target && activeTool !== 'network') return;
        setIsLoading(true);
        setResult(null);
        try {
            let endpoint = '';
            switch (activeTool) {
              case 'ports': endpoint = `/api/tools/ports?target=${target}`; break;
              case 'dns': endpoint = `/api/tools/dns?domain=${target}`; break;
              case 'headers': endpoint = `/api/tools/headers?target=${target}`; break;
              case 'kerbrute': endpoint = `/api/tools/kerbrute?domain=${target}`; break;
              case 'metasploit': endpoint = `/api/tools/metasploit?target=${target}`; break;
              case 'network': endpoint = `/api/scan/local?range=${target || '192.168.1'}`; break;
            }
            const res = await fetch(endpoint);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full neon-glow" />
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Arsenal de Auditoría</h2>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Herramientas de Penetración y Análisis Ofensivo
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tools Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    <button 
                        onClick={() => {setActiveTool('ports'); setResult(null);}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'ports' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Server size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">Port Scanner</p>
                            <p className="text-[10px] opacity-70">Servicios y Versiones</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => {setActiveTool('network'); setResult(null); if (!target) setTarget('192.168.1');}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'network' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Activity size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">Discovery</p>
                            <p className="text-[10px] opacity-70">Escáner de Red Local</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => {setActiveTool('kerbrute'); setResult(null);}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'kerbrute' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Users size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">Kerbrute</p>
                            <p className="text-[10px] opacity-70">Enumeración de Usuarios AD</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => {setActiveTool('metasploit'); setResult(null);}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'metasploit' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <ShieldAlert size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">Metasploit</p>
                            <p className="text-[10px] opacity-70">Vulnerability Scan</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => {setActiveTool('dns'); setResult(null);}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'dns' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Globe size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">DNS Recon</p>
                            <p className="text-[10px] opacity-70">Auditoría de registros DNS</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => {setActiveTool('headers'); setResult(null);}}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all border ${activeTool === 'headers' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Lock size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase">Headers</p>
                            <p className="text-[10px] opacity-70">Políticas HTTP</p>
                        </div>
                    </button>
                </div>

                {/* Main Interaction Area */}
                <div className="lg:col-span-3 space-y-6">
                    <GlassCard className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder={
                                      activeTool === 'network' ? "Ej: 192.168.1" :
                                      activeTool === 'kerbrute' ? "Ej: corp.local" :
                                      "Ej: 192.168.1.1 o google.com"
                                    }
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-primary outline-none transition-all font-mono"
                                />
                            </div>
                            <button 
                                onClick={runTool}
                                disabled={isLoading || (!target && activeTool !== 'network')}
                                className="bg-primary text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:neon-glow transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                                {isLoading ? 'Ejecutando...' : 'Lanzar Análisis'}
                            </button>
                        </div>
                    </GlassCard>

                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 gap-4"
                            >
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Interactuando con el objetivo...</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {activeTool === 'ports' && <PortResults results={result} />}
                                {activeTool === 'dns' && <DnsResults results={result} />}
                                {activeTool === 'headers' && <HeaderResults results={result} />}
                                {activeTool === 'kerbrute' && <KerbruteResults results={result} />}
                                {activeTool === 'metasploit' && <MetasploitResults results={result} />}
                                {activeTool === 'network' && <NetworkResults results={result} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function KerbruteResults({ results }: { results: any }) {
    if (results.error) return <ErrorMessage message={results.error} />;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 border-l-4 border-l-primary">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Dominio</p>
                    <h3 className="text-2xl font-black text-white">{results.domain}</h3>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-info">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Usuarios Encontrados</p>
                    <h3 className="text-2xl font-black text-info">{results.usersFound}</h3>
                </GlassCard>
            </div>
            <GlassCard className="p-0 overflow-hidden border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-8 py-4">Usuario</th>
                            <th className="px-8 py-4">Estado</th>
                            <th className="px-8 py-4">Método</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.results.map((r: any, i: number) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-4 font-mono text-sm text-white">{r.user}</td>
                                <td className="px-8 py-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${r.status === 'present' ? 'bg-primary/20 text-primary' : 'bg-slate-700/20 text-slate-300'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-xs font-bold text-slate-400">{r.method}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}

function MetasploitResults({ results }: { results: any }) {
    if (results.error) return <ErrorMessage message={results.error} />;
    return (
        <div className="space-y-6">
            <GlassCard className="p-6 bg-black/40 border-danger/30">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert size={20} className="text-danger" />
                    <h3 className="text-lg font-black text-white uppercase italic">MSF Security Findings</h3>
                </div>
                <div className="space-y-4">
                    {results.findings.map((f: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-primary">{f.plugin}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${f.severity === 'CRITICAL' ? 'bg-danger text-white' : 'bg-info/20 text-info'}`}>{f.severity}</span>
                            </div>
                            <p className="text-sm font-bold text-white">{f.description}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black">Result: {f.result}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>
            <GlassCard className="p-6">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Raw Console Output</p>
                <div className="bg-black p-4 rounded-lg font-mono text-xs text-green-500 overflow-x-auto whitespace-pre border border-white/5">
                    {results.raw_output}
                </div>
            </GlassCard>
        </div>
    );
}

function NetworkResults({ results }: { results: any }) {
    if (results.error) return <ErrorMessage message={results.error} />;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-l-4 border-l-primary">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Dispositivos</p>
                    <h3 className="text-4xl font-black text-white">{results.totalFound}</h3>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-info">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Escaneado en</p>
                    <h3 className="text-2xl font-black text-info">{results.scanTime.split('T')[1].split('.')[0]}</h3>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-warning">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Rango</p>
                    <h3 className="text-2xl font-black text-warning">{results.range}</h3>
                </GlassCard>
            </div>
            <GlassCard className="p-0 overflow-hidden border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-8 py-4">IP</th>
                            <th className="px-8 py-4">Hostname</th>
                            <th className="px-8 py-4">Fabricante</th>
                            <th className="px-8 py-4">MAC</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.devices.map((d: any, i: number) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-8 py-4 font-mono text-sm text-primary">{d.ip}</td>
                                <td className="px-8 py-4 text-xs font-bold text-white">{d.hostname}</td>
                                <td className="px-8 py-4 text-xs text-slate-400 font-bold">{d.vendor}</td>
                                <td className="px-8 py-4 font-mono text-[10px] text-slate-500">{d.mac}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <GlassCard className="p-8 border-danger/20 text-center">
            <ShieldAlert className="text-danger mx-auto mb-4" size={48} />
            <h3 className="text-xl font-black text-white uppercase italic">Error en el Proceso</h3>
            <p className="text-slate-400 mt-2 text-sm">{message}</p>
        </GlassCard>
    );
}

function PortResults({ results }: { results: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-l-4 border-l-primary">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Puertos Abiertos</p>
                    <h3 className="text-4xl font-black text-white">{results.openCount}</h3>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-danger">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Riesgo Crítico</p>
                    <h3 className="text-4xl font-black text-danger">{results.highRiskCount}</h3>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-info">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Risk Score</p>
                    <h3 className="text-4xl font-black text-info">{results.riskScore}%</h3>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden p-0 border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-8 py-4">Puerto</th>
                            <th className="px-8 py-4">Servicio</th>
                            <th className="px-8 py-4">Versión / Banner</th>
                            <th className="px-8 py-4">Estado</th>
                            <th className="px-8 py-4">Severidad</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.results.map((r: any, i: number) => (
                            <tr key={i} className={`hover:bg-white/5 transition-colors ${r.state === 'open' ? 'bg-white/[0.02]' : ''}`}>
                                <td className="px-8 py-4 font-mono text-sm text-white">{r.port}</td>
                                <td className="px-8 py-4 text-xs font-bold text-slate-400">{r.service}</td>
                                <td className="px-8 py-4 text-[10px] font-mono text-slate-500 max-w-xs truncate">{r.version}</td>
                                <td className="px-8 py-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${r.state === 'open' ? 'bg-primary/20 text-primary' : 'bg-slate-700/20 text-slate-500'}`}>
                                        {r.state}
                                    </span>
                                </td>
                                <td className="px-8 py-4">
                                    <span className={`text-[10px] font-black uppercase ${r.risk === 'high' ? 'text-danger' : r.risk === 'medium' ? 'text-warning' : 'text-slate-600'}`}>
                                        {r.risk}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}

function DnsResults({ results }: { results: any }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-primary" size={24} />
                    <h3 className="text-xl font-black text-white uppercase italic">Análisis de Registros</h3>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">DNS Audit Score</p>
                    <p className={`text-2xl font-black ${results.score > 80 ? 'text-primary' : results.score > 50 ? 'text-warning' : 'text-danger'}`}>{results.score}/100</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {Object.entries(results.records).map(([type, value]: [string, any]) => (
                        value && (Array.isArray(value) ? value.length > 0 : value) && (
                            <GlassCard key={type} className="p-6">
                                <h4 className="text-xs font-black text-primary uppercase mb-4 tracking-widest">{type} Records</h4>
                                <div className="space-y-2">
                                    {Array.isArray(value) ? value.map((v: any, j: number) => (
                                        <div key={j} className="bg-black/20 p-3 rounded-lg border border-white/5 font-mono text-xs break-all">
                                            {typeof v === 'string' ? v : JSON.stringify(v)}
                                        </div>
                                    )) : (
                                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 font-mono text-xs break-all">
                                            {JSON.stringify(value)}
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        )
                    ))}
                </div>

                <div className="space-y-6">
                    <GlassCard className="p-6 border-white/10 bg-gradient-to-br from-primary/5 to-transparent">
                        <h4 className="text-xs font-black text-white uppercase mb-6 tracking-widest flex items-center gap-2">
                            <Lock size={14} className="text-primary" /> Security Posture
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: 'SPF Framework', val: results.security.hasSPF },
                                { label: 'DKIM Signatures', val: results.security.hasDKIM },
                                { label: 'DMARC Policy', val: results.security.hasDMARC },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-xs font-bold text-slate-300">{s.label}</span>
                                    {s.val ? (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-primary">
                                            <ShieldCheck size={12} /> CONFIGURADO
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-danger">
                                            <ShieldAlert size={12} /> AUSENTE
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {results.issues.length > 0 && (
                        <GlassCard className="p-6 border-danger/20 bg-danger/5">
                            <h4 className="text-xs font-black text-danger uppercase mb-4 tracking-widest">Hallazgos de Seguridad</h4>
                            <div className="space-y-3">
                                {results.issues.map((issue: string, i: number) => (
                                    <div key={i} className="flex gap-3 text-xs text-slate-400 font-medium">
                                        <span className="text-danger mt-0.5">●</span>
                                        {issue}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}

function HeaderResults({ results }: { results: any }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black ${
                        results.grade === 'A' ? 'text-primary bg-primary/10' :
                        results.grade === 'B' ? 'text-info bg-info/10' :
                        results.grade === 'C' ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'
                    }`}>
                        {results.grade}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Security Grade</p>
                        <h3 className="text-xl font-black text-white uppercase italic">Análisis de Encabezados</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Puntuación: {results.score}/100</p>
                    </div>
                </div>

                <div className="flex-1 max-w-sm">
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${results.score}%` }}
                            className={`h-full ${results.score > 80 ? 'bg-primary' : results.score > 50 ? 'bg-warning' : 'bg-danger'}`}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-slate-500 tracking-widest">
                        <span>Pobre</span>
                        <span>Promedio</span>
                        <span>Excelente</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.checks.map((check: any, i: number) => (
                    <GlassCard key={i} className={`p-5 border-l-4 ${check.status === 'ok' ? 'border-l-primary' : check.status === 'missing' ? 'border-l-danger' : 'border-l-warning'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-white">{check.name}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">{check.desc}</p>
                            </div>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                check.status === 'ok' ? 'bg-primary/20 text-primary' :
                                check.status === 'missing' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                            }`}>
                                {check.status}
                            </span>
                        </div>
                        {check.value && (
                            <div className="mt-3 bg-black/30 p-2 rounded text-[10px] font-mono text-slate-400 break-all border border-white/5">
                                {check.value}
                            </div>
                        )}
                        {!check.valid && check.severity !== 'info' && (
                            <p className="mt-2 text-[9px] font-black text-danger uppercase italic flex items-center gap-1">
                                <ShieldAlert size={10} /> Gravedad: {check.severity}
                            </p>
                        )}
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
