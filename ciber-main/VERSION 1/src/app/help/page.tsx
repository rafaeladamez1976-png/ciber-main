'use client';

import { useState } from 'react';
import {
    HelpCircle,
    Mail,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    Book,
    Shield,
    Zap,
    Send
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const faqs = [
    {
        question: "¿Qué es SIAR-C?",
        answer: "SIAR-C es una plataforma profesional de análisis de ciberseguridad diseñada para monitorizar la exposición externa, vulnerabilidades y el cumplimiento de estándares de seguridad en infraestructuras digitales."
    },
    {
        question: "¿Cómo funciona el escaneo de seguridad?",
        answer: "El motor de orquestación utiliza múltiples APIs (VirusTotal, SSL Labs, etc.) para analizar el target (IP o Dominio) en tiempo real, agregando hallazgos y calculando un score de riesgo basado en severidad."
    },
    {
        question: "¿Mis datos están seguros?",
        answer: "Absolutamente. Utilizamos cifrado de grado militar para proteger tus configuraciones y resultados de escaneo. SIAR-C cumple con las mejores prácticas de seguridad de datos."
    },
    {
        question: "¿Ofrecen soporte 24/7?",
        answer: "Sí, nuestro equipo de expertos en ciberseguridad está disponible las 24 horas del día para ayudarte con cualquier duda técnica o incidente detectado."
    }
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => setFormStatus('success'), 1500);
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <HelpCircle className="text-[#00ff88]" size={32} />
                    Centro de Soporte SIAR-C
                </h2>
                <p className="text-slate-400">
                    ¿Necesitas ayuda con la plataforma? Encuentra respuestas rápidas o contacta con nuestros especialistas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ Section */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                        <Book className="text-[#00ff88]" size={20} />
                        Preguntas Frecuentes
                    </h3>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, index) => (
                            <GlassCard
                                key={index}
                                className="overflow-hidden border-white/5"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <span className="font-medium text-slate-200">{faq.question}</span>
                                    {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                                {openFaq === index && (
                                    <div className="px-4 pb-4 text-sm text-slate-400 border-t border-white/5 pt-3 animate-in fade-in duration-300">
                                        {faq.answer}
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>

                    {/* Resources section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassCard className="p-6 flex flex-col gap-3 group hover:border-[#00ff88]/30 transition-colors">
                            <Shield className="text-[#00ff88] group-hover:scale-110 transition-transform" size={24} />
                            <h4 className="font-bold text-white">Documentación Técnica</h4>
                            <p className="text-sm text-slate-400">Explora guías detalladas sobre cómo integrar SIAR-C en tu workflow.</p>
                            <button className="text-[#00ff88] text-xs font-bold flex items-center gap-1 mt-2">
                                LEER MÁS <Zap size={10} />
                            </button>
                        </GlassCard>
                        <GlassCard className="p-6 flex flex-col gap-3 group hover:border-[#00ff88]/30 transition-colors">
                            <Zap className="text-[#00ff88] group-hover:scale-110 transition-transform" size={24} />
                            <h4 className="font-bold text-white">Webinar de Seguridad</h4>
                            <p className="text-sm text-slate-400">Aprende sobre las últimas amenazas con nuestros expertos en vivo.</p>
                            <button className="text-[#00ff88] text-xs font-bold flex items-center gap-1 mt-2">
                                VER CALENDARIO <Zap size={10} />
                            </button>
                        </GlassCard>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                        <MessageSquare className="text-[#00ff88]" size={20} />
                        Contacto Directo
                    </h3>

                    <GlassCard className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Email</p>
                                    <p className="text-sm text-white font-medium">soporte@siar-c.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Chat en Vivo</p>
                                    <p className="text-sm text-white font-medium">Disponible (L-V, 24h)</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4 border-t border-white/5">
                            <p className="text-xs font-bold text-slate-500">ENVÍANOS UN TICKET</p>
                            <input
                                required
                                type="text"
                                placeholder="Asunto"
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00ff88]/50"
                            />
                            <textarea
                                required
                                placeholder="Describe tu problema..."
                                rows={4}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00ff88]/50 resize-none"
                            />
                            <button
                                disabled={formStatus === 'sending'}
                                className="w-full py-2.5 bg-[#00ff88] hover:bg-[#00cc6e] text-[#0a0a0a] font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {formStatus === 'sending' ? (
                                    "Enviando..."
                                ) : formStatus === 'success' ? (
                                    "Ticket Enviado"
                                ) : (
                                    <>
                                        Enviar Ticket
                                        <Send size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
