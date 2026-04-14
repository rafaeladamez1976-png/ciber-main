'use client';

import {
    HelpCircle,
    Book,
    Shield,
    Radar,
    Users,
    FileText,
    Bell,
    Settings,
    ExternalLink,
    ChevronRight,
    Zap,
    Globe,
    Terminal,
    MessageCircle,
    Mail,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const faqItems = [
    {
        question: '¿Cómo funciona el escáner de seguridad?',
        answer: 'SIAR-C utiliza múltiples APIs de inteligencia (VirusTotal, SSL Labs, URLScan, AbuseIPDB, HIBP, etc.) para realizar un análisis integral de la superficie de ataque de un dominio o IP. Los resultados se correlacionan con el framework OWASP Top 10 para proporcionar un diagnóstico completo.',
        icon: <Shield size={20} />
    },
    {
        question: '¿Qué es el escáner de red local?',
        answer: 'El módulo Local Scanner realiza un barrido ARP de tu red local (similar a Advanced IP Scanner), detectando todos los dispositivos conectados, sus direcciones MAC, fabricantes y nombres de host. Es ideal para auditorías de red internas.',
        icon: <Radar size={20} />
    },
    {
        question: '¿Necesito configurar claves API?',
        answer: 'Para funcionalidad completa, sí. Ve a Ajustes > Integraciones para configurar tus claves de VirusTotal, URLScan.io, HIBP e IPInfo. Sin embargo, el escáner de red local funciona sin claves externas.',
        icon: <Settings size={20} />
    },
    {
        question: '¿Cómo se generan los reportes PDF?',
        answer: 'Después de completar un escaneo, el sistema genera automáticamente un informe PDF descargable que incluye: puntuación de seguridad, hallazgos clasificados por severidad, resultados por API, y recomendaciones OWASP.',
        icon: <FileText size={20} />
    },
    {
        question: '¿Qué significan los niveles de riesgo?',
        answer: 'CRÍTICO: Amenaza activa que requiere acción inmediata. ALTO: Vulnerabilidad explotable. MEDIO: Debilidad que debe ser monitoreada. BAJO: Hallazgo informativo sin impacto directo.',
        icon: <Bell size={20} />
    },
    {
        question: '¿Puedo monitorear múltiples clientes?',
        answer: 'Sí. El módulo de Clientes permite registrar organizaciones con sus dominios, IPs y contactos. Cada escaneo se puede asociar a un cliente para mantener un historial de seguridad por organización.',
        icon: <Users size={20} />
    },
];

const quickLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <Shield size={18} />, desc: 'Vista general del sistema' },
    { label: 'Escáner de Red', href: '/scanner/local', icon: <Radar size={18} />, desc: 'Analizar dispositivos locales' },
    { label: 'Escáner Web', href: '/scanner', icon: <Globe size={18} />, desc: 'Analizar dominios e IPs' },
    { label: 'Reportes', href: '/reports', icon: <FileText size={18} />, desc: 'Historial de análisis' },
    { label: 'Alertas', href: '/alerts', icon: <Bell size={18} />, desc: 'Monitoreo de amenazas' },
    { label: 'Ajustes', href: '/settings', icon: <Settings size={18} />, desc: 'Configuración del sistema' },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="space-y-10 pb-12 max-w-5xl mx-auto">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full neon-glow" />
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">Centro de Soporte</h2>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                    Documentación y recursos de la plataforma SIAR-C
                </p>
            </header>

            {/* Quick Access Grid */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-primary" /> Acceso Rápido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((link, i) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -4 }}
                        >
                            <GlassCard className="p-5 flex items-center gap-4 group hover:border-primary/20 transition-all">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:neon-glow transition-all">
                                    {link.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{link.label}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{link.desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
                            </GlassCard>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Book size={16} className="text-info" /> Preguntas Frecuentes
                </h3>
                <div className="space-y-3">
                    {faqItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <GlassCard
                                className={`overflow-hidden transition-all ${openFaq === i ? 'border-primary/30' : 'border-white/5'}`}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center gap-4 p-5 text-left group"
                                >
                                    <div className={`p-2 rounded-lg transition-all ${openFaq === i ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`flex-1 text-sm font-bold transition-colors ${openFaq === i ? 'text-primary' : 'text-white'}`}>
                                        {item.question}
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className={`text-slate-600 transition-transform duration-300 ${openFaq === i ? 'rotate-90 text-primary' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 pl-16">
                                                <p className="text-sm text-slate-400 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Architecture Overview */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Terminal size={16} className="text-warning" /> Arquitectura del Sistema
                </h3>
                <GlassCard className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Globe size={20} />
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase">Frontend</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Next.js 15 (App Router)</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> React 19</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Tailwind CSS 4</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Framer Motion</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center text-info">
                                <Shield size={20} />
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase">APIs de Inteligencia</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-info" /> VirusTotal</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-info" /> SSL Labs</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-info" /> URLScan.io</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-info" /> AbuseIPDB / HIBP</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                                <Radar size={20} />
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase">Backend / Data</h4>
                            <ul className="space-y-2 text-xs text-slate-400">
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-warning" /> Supabase (PostgreSQL)</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-warning" /> Node.js ARP Scanner</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-warning" /> PDF Generation</li>
                                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-warning" /> Edge Functions</li>
                            </ul>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Contact/Support */}
            <GlassCard className="p-8 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="text-primary" size={20} />
                            <h3 className="text-white font-bold uppercase tracking-tight">¿Necesitas asistencia?</h3>
                        </div>
                        <p className="text-sm text-slate-400 max-w-lg">
                            Si tienes preguntas sobre la configuración, integraciones API o funcionalidades avanzadas,
                            nuestro equipo de soporte técnico está disponible 24/7.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-sm font-bold text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-wider">
                            <Mail size={16} /> Email
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-[#0a0a0a] rounded-xl text-sm font-black hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all uppercase tracking-wider">
                            <ArrowUpRight size={16} /> Soporte
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
