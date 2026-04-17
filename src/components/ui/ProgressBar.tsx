interface ProgressBarProps {
    progress: number;
    className?: string;
    showText?: boolean;
}

export default function ProgressBar({ progress, className, showText = false }: ProgressBarProps) {
    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-2">
                {showText && <span className="text-xs font-semibold text-primary">PROGRESO</span>}
                {showText && <span className="text-sm font-black text-primary">{Math.round(progress)}%</span>}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,136,0.4)] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            </div>
        </div>
    );
}
