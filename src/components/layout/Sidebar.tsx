'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Shield, Radar, Users, FileText, Bell, Settings, HelpCircle, 
    LogOut, Terminal, ShieldAlert, Wrench 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navSections = [
    {
        label: 'PRINCIPAL',
        items: [
            { label: 'Dashboard', icon: <Shield size={18} />, href: '/dashboard' },
            { label: 'Alertas', icon: <Bell size={18} />, href: '/alerts', badge: 3 },
        ]
    },
    {
        label: 'ESCANEO',
        items: [
            { label: 'Escáner Web', icon: <ShieldAlert size={18} />, href: '/scanner' },
            { label: 'Red Local', icon: <Radar size={18} />, href: '/scanner/local' },
            { label: 'Arsenal Tools', icon: <Terminal size={18} />, href: '/tools' },
        ]
    },
    {
        label: 'SEGURIDAD',
        items: [
            { label: 'Auto-Auditoría', icon: <ShieldAlert size={18} />, href: '/audit', badge: '!' },
        ]
    },
    {
        label: 'GESTIÓN',
        items: [
            { label: 'Clientes', icon: <Users size={18} />, href: '/clients' },
            { label: 'Reportes', icon: <FileText size={18} />, href: '/reports' },
            { label: 'Ajustes', icon: <Settings size={18} />, href: '/settings' },
        ]
    },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 w-[240px] bg-[#0d1117] border-r border-white/10 flex flex-col h-screen flex-shrink-0 z-40 transition-transform duration-300 transform lg:translate-x-0 lg:static",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Logo */}
            <div className="p-6 flex items-center justify-between gap-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00ff88] rounded flex items-center justify-center">
                        <Shield className="text-[#0a0a0a] fill-[#0a0a0a]" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-wider text-[#00ff88] leading-none">SIAR-C</h1>
                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Security Platform</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 text-slate-400 hover:text-white"
                >
                    <LogOut size={18} className="rotate-180" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 overflow-y-auto">
                <div className="flex flex-col gap-0">
                    {navSections.map((section) => (
                        <div key={section.label} className="mb-4">
                            <p className="px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">
                                {section.label}
                            </p>
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || 
                                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => onClose?.()}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-2.5 transition-all group relative",
                                            isActive
                                                ? "text-[#00ff88] bg-gradient-to-r from-[#00ff88]/10 to-transparent"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00ff88]" />}
                                        <span className={cn("transition-colors", isActive ? "text-[#00ff88]" : "text-slate-500 group-hover:text-slate-300")}>
                                            {item.icon}
                                        </span>
                                        <span className="text-xs font-bold flex-1">{item.label}</span>
                                        {(item as any).badge && (
                                            <span className={cn(
                                                "ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-black",
                                                (item as any).badge === '!' 
                                                    ? "bg-warning/20 text-warning"
                                                    : "bg-[#ff4d4d] text-white"
                                            )}>
                                                {(item as any).badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex flex-col gap-1">
                <Link
                    href="/help"
                    onClick={() => onClose?.()}
                    className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all",
                        pathname === '/help' ? "text-[#00ff88] bg-[#00ff88]/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <HelpCircle size={16} />
                    Soporte & Ayuda
                </Link>
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full text-left">
                    <LogOut size={16} />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
