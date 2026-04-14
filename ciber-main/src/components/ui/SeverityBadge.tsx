import { Severity } from "@/types/scan";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SeverityBadgeProps {
    severity: Severity;
    className?: string;
}

const severityConfig: Record<Severity, { label: string, styles: string }> = {
    critical: { label: 'CRÍTICO', styles: 'bg-red-500/20 text-red-500 border-red-500/30' },
    high: { label: 'ALTO', styles: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
    medium: { label: 'MEDIO', styles: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
    low: { label: 'BAJO', styles: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
    info: { label: 'INFO', styles: 'bg-slate-500/20 text-slate-500 border-slate-500/30' },
};

export default function SeverityBadge({ severity, className }: SeverityBadgeProps) {
    const config = severityConfig[severity];

    return (
        <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold border",
            config.styles,
            className
        )}>
            {config.label}
        </span>
    );
}
