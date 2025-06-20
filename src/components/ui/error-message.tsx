import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
    variant?: 'default' | 'compact';
}

export function ErrorMessage({
    title = 'Error',
    message,
    onRetry,
    className,
    variant = 'default',
}: ErrorMessageProps) {
    if (variant === 'compact') {
        return (
            <div
                className={cn(
                    'flex items-center gap-2 text-destructive text-sm',
                    className,
                )}
            >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{message}</span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="ml-auto flex items-center gap-1 text-xs hover:underline"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Reintentar
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'rounded-lg border border-destructive/20 bg-destructive/10 p-4',
                className,
            )}
        >
            <div className="flex items-start gap-3">
                <AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0 text-destructive' />
                <div className='min-w-0 flex-1'>
                    <h3 className="font-medium text-destructive">{title}</h3>
                    <p className="mt-1 text-destructive/80 text-sm">{message}</p>
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className='mt-3 inline-flex items-center gap-2 font-medium text-destructive text-sm transition-colors hover:text-destructive/80'
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reintentar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
