import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type PaymentInfo, paymentInfoSchema } from '@/lib/validation-schemas';
import { Calendar, CreditCard, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentInfoFormProps {
    initialData?: Partial<PaymentInfo>;
    onSubmit: (data: PaymentInfo) => void;
    onNext: () => void;
    onBack: () => void;
    className?: string;
}

type FormErrors = {
    cardNumber?: string;
    cardHolderName?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
};

export function PaymentInfoForm({
    initialData,
    onSubmit,
    onNext,
    onBack,
    className,
}: PaymentInfoFormProps) {
    const [formData, setFormData] = useState<PaymentInfo>({
        cardNumber: initialData?.cardNumber || '',
        cardHolderName: initialData?.cardHolderName || '',
        expiryMonth: initialData?.expiryMonth || '',
        expiryYear: initialData?.expiryYear || '',
        cvv: initialData?.cvv || '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formatear número de tarjeta
    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        return formatted.slice(0, 19); // Máximo 19 caracteres (16 dígitos + 3 espacios)
    };

    // Detectar tipo de tarjeta
    const getCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'visa';
        if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
        if (cleaned.startsWith('3')) return 'amex';
        return 'generic';
    };

    const validateField = (name: keyof PaymentInfo, value: string) => {
        try {
            paymentInfoSchema.shape[name].parse(value);
            setErrors((prev) => ({ ...prev, [name]: undefined }));
            return true;
        } catch (error: any) {
            const errorMessage = error.errors?.[0]?.message || 'Campo inválido';
            setErrors((prev) => ({ ...prev, [name]: errorMessage }));
            return false;
        }
    };

    const handleInputChange = (name: keyof PaymentInfo, value: string) => {
        let processedValue = value;

        // Formateo especial para número de tarjeta
        if (name === 'cardNumber') {
            processedValue = formatCardNumber(value);
        }

        // Solo números para CVV
        if (name === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        // Formateo para mes (agregar 0 si es necesario)
        if (name === 'expiryMonth') {
            processedValue = value.replace(/\D/g, '').slice(0, 2);
            if (processedValue.length === 1 && Number.parseInt(processedValue) > 1) {
                processedValue = `0${processedValue}`;
            }
        }

        // Formateo para año
        if (name === 'expiryYear') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
            if (processedValue.length === 2) {
                processedValue = `20${processedValue}`;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: processedValue }));

        if (processedValue.length > 0) {
            validateField(name, processedValue);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Limpiar número de tarjeta antes de validar
            const dataToValidate = {
                ...formData,
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
            };

            const result = paymentInfoSchema.safeParse(dataToValidate);

            if (!result.success) {
                const fieldErrors: FormErrors = {};
                result.error.errors.forEach((error) => {
                    const field = error.path[0] as keyof PaymentInfo;
                    fieldErrors[field] = error.message;
                });
                setErrors(fieldErrors);
                toast.error('Por favor corrige los errores en el formulario');
                return;
            }

            onSubmit(result.data);
            toast.success('Información de pago validada');
            onNext();
        } catch (error) {
            toast.error('Error al procesar la información de pago');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        const dataToValidate = {
            ...formData,
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
        };
        return paymentInfoSchema.safeParse(dataToValidate).success;
    };

    const cardType = getCardType(formData.cardNumber);

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header */}
            <div className="text-center sm:text-left">
                <div className='mb-2 flex items-center justify-center gap-2 sm:justify-start'>
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className='font-semibold text-foreground text-xl'>
                        Información de Pago
                    </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                    Ingresa los datos de tu tarjeta de crédito o débito
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Número de tarjeta */}
                <div className="space-y-2">
                    <label
                        htmlFor="cardNumber"
                        className='font-medium text-foreground text-sm'
                    >
                        Número de tarjeta *
                    </label>
                    <div className="relative">
                        <CreditCard className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            onBlur={() =>
                                validateField(
                                    'cardNumber',
                                    formData.cardNumber.replace(/\s/g, ''),
                                )
                            }
                            placeholder="1234 5678 9012 3456"
                            className={cn(
                                'pr-12 pl-10 font-mono',
                                errors.cardNumber &&
                                'border-destructive focus-visible:ring-destructive',
                            )}
                            maxLength={19}
                        />
                        {/* Icono del tipo de tarjeta */}
                        <div className='-translate-y-1/2 absolute top-1/2 right-3'>
                            <div
                                className={cn(
                                    'flex h-4 w-6 items-center justify-center rounded border font-bold text-xs',
                                    cardType === 'visa' && 'bg-blue-600 text-white',
                                    cardType === 'mastercard' && 'bg-red-600 text-white',
                                    cardType === 'amex' && 'bg-green-600 text-white',
                                    cardType === 'generic' && 'bg-gray-200 text-gray-600',
                                )}
                            >
                                {cardType === 'visa' && 'V'}
                                {cardType === 'mastercard' && 'MC'}
                                {cardType === 'amex' && 'AX'}
                                {cardType === 'generic' && '💳'}
                            </div>
                        </div>
                    </div>
                    {errors.cardNumber && (
                        <p className='text-destructive text-xs'>{errors.cardNumber}</p>
                    )}
                </div>

                {/* Nombre en la tarjeta */}
                <div className="space-y-2">
                    <label
                        htmlFor="cardHolderName"
                        className='font-medium text-foreground text-sm'
                    >
                        Nombre en la tarjeta *
                    </label>
                    <div className="relative">
                        <User className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            id="cardHolderName"
                            name="cardHolderName"
                            value={formData.cardHolderName}
                            onChange={(e) =>
                                handleInputChange(
                                    'cardHolderName',
                                    e.target.value.toUpperCase(),
                                )
                            }
                            onBlur={() =>
                                validateField('cardHolderName', formData.cardHolderName)
                            }
                            placeholder="JUAN PÉREZ"
                            className={cn(
                                'pl-10 uppercase',
                                errors.cardHolderName &&
                                'border-destructive focus-visible:ring-destructive',
                            )}
                        />
                    </div>
                    {errors.cardHolderName && (
                        <p className='text-destructive text-xs'>{errors.cardHolderName}</p>
                    )}
                    <p className='text-muted-foreground text-xs'>
                        Tal como aparece en tu tarjeta
                    </p>
                </div>

                {/* Fecha de expiración y CVV */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Mes */}
                    <div className="space-y-2">
                        <label
                            htmlFor="expiryMonth"
                            className='font-medium text-foreground text-sm'
                        >
                            Mes *
                        </label>
                        <div className="relative">
                            <Calendar className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                            <Input
                                id="expiryMonth"
                                name="expiryMonth"
                                value={formData.expiryMonth}
                                onChange={(e) =>
                                    handleInputChange('expiryMonth', e.target.value)
                                }
                                onBlur={() =>
                                    validateField('expiryMonth', formData.expiryMonth)
                                }
                                placeholder="12"
                                className={cn(
                                    'pl-10 text-center',
                                    errors.expiryMonth &&
                                    'border-destructive focus-visible:ring-destructive',
                                )}
                                maxLength={2}
                            />
                        </div>
                        {errors.expiryMonth && (
                            <p className='text-destructive text-xs'>{errors.expiryMonth}</p>
                        )}
                    </div>

                    {/* Año */}
                    <div className="space-y-2">
                        <label
                            htmlFor="expiryYear"
                            className='font-medium text-foreground text-sm'
                        >
                            Año *
                        </label>
                        <Input
                            id="expiryYear"
                            name="expiryYear"
                            value={formData.expiryYear}
                            onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                            onBlur={() => validateField('expiryYear', formData.expiryYear)}
                            placeholder="2028"
                            className={cn(
                                'text-center',
                                errors.expiryYear &&
                                'border-destructive focus-visible:ring-destructive',
                            )}
                            maxLength={4}
                        />
                        {errors.expiryYear && (
                            <p className='text-destructive text-xs'>{errors.expiryYear}</p>
                        )}
                    </div>

                    {/* CVV */}
                    <div className="space-y-2">
                        <label
                            htmlFor="cvv"
                            className='font-medium text-foreground text-sm'
                        >
                            CVV *
                        </label>
                        <div className="relative">
                            <Shield className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                            <Input
                                id="cvv"
                                name="cvv"
                                type="password"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                onBlur={() => validateField('cvv', formData.cvv)}
                                placeholder="123"
                                className={cn(
                                    'pl-10 text-center font-mono',
                                    errors.cvv &&
                                    'border-destructive focus-visible:ring-destructive',
                                )}
                                maxLength={4}
                            />
                        </div>
                        {errors.cvv && (
                            <p className='text-destructive text-xs'>{errors.cvv}</p>
                        )}
                    </div>
                </div>

                {/* Botones de navegación */}
                <div className='flex flex-col gap-3 sm:flex-row sm:justify-between'>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="w-full sm:w-auto sm:min-w-[120px]"
                    >
                        Anterior
                    </Button>

                    <Button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        className="w-full sm:w-auto sm:min-w-[200px]"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Validando...
                            </div>
                        ) : (
                            'Continuar'
                        )}
                    </Button>
                </div>
            </form>

            {/* Información de seguridad */}
            <div className='rounded-lg bg-muted/50 p-4'>
                <h4 className='mb-2 font-medium text-foreground text-sm'>
                    🔒 Pago Seguro
                </h4>
                <div className='space-y-1 text-muted-foreground text-xs'>
                    <p>• Tu información está protegida con encriptación SSL</p>
                    <p>• No almacenamos datos de tu tarjeta</p>
                    <p>• Procesamiento seguro con PSE y redeban</p>
                    <p>• Acepta todas las tarjetas débito y crédito</p>
                </div>
            </div>

            {/* Tarjetas de prueba */}
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20'>
                <h4 className='mb-2 font-medium text-blue-900 text-sm dark:text-blue-100'>
                    🧪 Tarjetas de Prueba (Demo)
                </h4>
                <div className='space-y-1 text-blue-700 text-xs dark:text-blue-300'>
                    <p>
                        • Visa:{' '}
                        <code className='rounded bg-blue-100 px-1 dark:bg-blue-900'>
                            4111 1111 1111 1111
                        </code>
                    </p>
                    <p>
                        • Mastercard:{' '}
                        <code className='rounded bg-blue-100 px-1 dark:bg-blue-900'>
                            5555 5555 5555 4444
                        </code>
                    </p>
                    <p>• CVV: cualquier número de 3 dígitos</p>
                    <p>• Fecha: cualquier fecha futura</p>
                </div>
            </div>
        </div>
    );
}
