'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Radar, Users, FileText, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { label: 'DASHBOARD', icon: <Shield size={20} />, href: '/dashboard' },
    { label: 'LOCAL SCAN', icon: <Radar size={20} />, href: '/scanner/local' },
    { label: 'SCANNER', icon: <Shield size={20} />, href: '/scanner' },
    { label: 'CLIENTS', icon: <Users size={20} />, href: '/clients' },
    { label: 'REPORTS', icon: <FileText size={20} />, href: '/reports' },
    { label: 'ALERTS', icon: <Bell size={20} />, href: '/alerts', badge: 3 },
    { label: 'SETTINGS', icon: <Settings size={20} />, href: '/settings' },
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
            <div className="p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00ff88] rounded flex items-center justify-center">
                        <Shield className="text-[#0a0a0a] fill-[#0a0a0a]" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-wider text-[#00ff88]">SIAR-C</h1>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 text-slate-400 hover:text-white"
                >
                    <LogOut size={20} className="rotate-180" />
                </button>
            </div>

            <nav className="flex-1 mt-4">
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose?.()}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3 transition-all group relative",
                                    isActive
                                        ? "text-[#00ff88] bg-gradient-to-r from-[#00ff88]/10 to-transparent border-l-3 border-[#00ff88]"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ff88]" />}
                                {item.icon}
                                <span className="text-sm font-semibold">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#ff4d4d] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-6 border-t border-white/5 flex flex-col gap-2">
                <Link
                    href="/help"
                    onClick={() => onClose?.()}
                    className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <HelpCircle size={18} />
                    Support
                </Link>
                <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium w-full text-left">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
