import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlsProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
    min?: number;
    max?: number;
}

export function QuantityControls({
    quantity,
    onIncrease,
    onDecrease,
    disabled = false,
    size = 'md',
    min = 1,
    max = 99,
}: QuantityControlsProps) {
    const canDecrease = quantity > min;
    const canIncrease = quantity < max;

    const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className={buttonSize}
                onClick={onDecrease}
                disabled={disabled || !canDecrease}
                aria-label="Disminuir cantidad"
            >
                <Minus className={iconSize} />
            </Button>

            <span
                className={`min-w-[2rem] text-center font-medium ${size === 'sm' ? 'text-sm' : 'text-base'
                    }`}
            >
                {quantity}
            </span>

            <Button
                variant="outline"
                size="icon"
                className={buttonSize}
                onClick={onIncrease}
                disabled={disabled || !canIncrease}
                aria-label="Aumentar cantidad"
            >
                <Plus className={iconSize} />
            </Button>
        </div>
    );
}
