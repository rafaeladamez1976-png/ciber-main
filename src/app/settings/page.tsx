'use client';

import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Key,
    Bell,
    Database,
    CheckCircle2,
    AlertCircle,
    Globe,
    Shield,
    Save,
    Cpu,
    ExternalLink,
    Mail,
    Zap,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // UI State for form fields
    const [config, setConfig] = useState({
        name: 'Admin User',
        email: 'admin@siarc.security',
        role: 'Chief Security Officer',
        organization: 'SIAR-C Defense Org',
        vtApiKey: '••••••••••••••••••••••••••••',
        urlScanKey: '••••••••••••••••••••••••••••',
        hibpKey: '••••••••••••••••••••••••••••',
        ipInfoKey: '••••••••••••••••••••••••••••',
        emailAlerts: true,
        highRiskOnly: false,
        theme: 'cyberpunk-dark'
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        alert('Configuración guardada exitosamente.');
    };

    const tabs = [
        { id: 'profile', label: 'PERFIL', icon: <User size={18} /> },
        { id: 'api', label: 'INTEGRACIONES', icon: <Key size={18} /> },
        { id: 'notifications', label: 'NOTIFICACIONES', icon: <Bell size={18} /> },
        { id: 'system', label: 'SISTEMA', icon: <Database size={18} /> },
    ];

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <SettingsIcon className="text-primary" size={32} />
                        Ajustes del Sistema
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Configura tu entorno de trabajo y claves de monitoreo</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] text-[#0a0a0a] font-black px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {isSaving ? <Cpu className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all border ${activeTab === tab.id
                                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,255,136,0.1)]'
                                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.04]'
                                }`}
                        >
                            {tab.icon}
                            <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={16} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase">Soporte Premium</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                            ¿Necesitas ayuda con las integraciones API?
                        </p>
                        <button className="text-[10px] font-bold text-white uppercase flex items-center gap-1 hover:text-primary transition-colors">
                            Contactar Soporte <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GlassCard className="p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                        <User className="text-primary" size={20} /> Información del Operador
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre Completo</label>
                                            <input
                                                value={config.name}
                                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Profesional</label>
                                            <input
                                                value={config.email}
                                                onChange={e => setConfig({ ...config, email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cargo / Función</label>
                                            <input
                                                value={config.role}
                                                onChange={e => setConfig({ ...config, role: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organización</label>
                                            <input
                                                value={config.organization}
                                                onChange={e => setConfig({ ...config, organization: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* API Tab */}
                            {activeTab === 'api' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                            <Key className="text-primary" size={20} /> Llaves Externas (Open Source Intelligence)
                                        </h3>
                                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-black tracking-widest">4 ACTIVAS</span>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'VirusTotal API Key', field: 'vtApiKey', help: 'Para escaneo de archivos y reputación de dominios' },
                                            { label: 'URLScan.io API Key', field: 'urlScanKey', help: 'Para capturas de pantalla y análisis de scripts maliciosos' },
                                            { label: 'HIBP (Have I Been Pwned) API Key', field: 'hibpKey', help: 'Para monitoreo de filtraciones de bases de datos' },
                                            { label: 'IPInfo API Key', field: 'ipInfoKey', help: 'Para geolocalización precisa de activos' },
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</label>
                                                    <button className="text-[10px] font-bold text-primary hover:underline">REGENERAR</button>
                                                </div>
                                                <input
                                                    type="password"
                                                    value={config[item.field as keyof typeof config] as string}
                                                    onChange={e => setConfig({ ...config, [item.field]: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-primary/80 focus:border-primary outline-none transition-all"
                                                />
                                                <p className="text-[10px] text-slate-600 font-medium italic">{item.help}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                        <Bell className="text-primary" size={20} /> Alertas y Notificaciones
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase">Notificaciones por Correo</p>
                                                <p className="text-[11px] text-slate-500">Recibir reporte automático al finalizar el escaneo</p>
                                            </div>
                                            <button
                                                onClick={() => setConfig({ ...config, emailAlerts: !config.emailAlerts })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${config.emailAlerts ? 'bg-primary' : 'bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.emailAlerts ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase">Solo Riesgos Críticos</p>
                                                <p className="text-[11px] text-slate-500">Ignorar hallazgos de severidad baja o informativa</p>
                                            </div>
                                            <button
                                                onClick={() => setConfig({ ...config, highRiskOnly: !config.highRiskOnly })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${config.highRiskOnly ? 'bg-primary' : 'bg-slate-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.highRiskOnly ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-info/20 bg-info/5 rounded-xl flex gap-3">
                                        <Info className="text-info shrink-0" size={18} />
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Las notificaciones críticas no pueden ser desactivadas por política de seguridad del SOC.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* System Tab */}
                            {activeTab === 'system' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                        <Database className="text-primary" size={20} /> Estado de Infraestructura
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Datos</span>
                                                <span className="flex items-center gap-1 text-[10px] font-black text-primary">
                                                    <CheckCircle2 size={12} /> ONLINE
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-white">Supabase Cluster</p>
                                            <p className="text-[10px] font-mono text-slate-600">ref: sb_siarc_prod_01</p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motor de Análisis</span>
                                                <span className="flex items-center gap-1 text-[10px] font-black text-primary">
                                                    <CheckCircle2 size={12} /> ACTIVO
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-white">Vercel Edge Engine</p>
                                            <p className="text-[10px] font-mono text-slate-600">lat: 24ms | pkg: v2.4.1</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Versión de Plataforma</p>
                                        <div className="flex items-center justify-between group">
                                            <span className="text-sm text-white font-mono">SIAR-C Enterprise v1.0.4 - Release (Titan)</span>
                                            <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 italic text-[10px]">Ver Changelog</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ArrowUpRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 7h10v10" />
            <path d="M7 17L17 7" />
        </svg>
    );
}
