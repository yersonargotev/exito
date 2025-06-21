import { cn } from '@/lib/utils';
import { Check, CreditCard, MapPin, Package, User } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  className?: string;
}

const steps = [
  {
    id: 1,
    title: 'Información Personal',
    icon: User,
    description: 'Datos de contacto',
  },
  {
    id: 2,
    title: 'Dirección de Envío',
    icon: MapPin,
    description: 'Dónde enviar tu pedido',
  },
  {
    id: 3,
    title: 'Información de Pago',
    icon: CreditCard,
    description: 'Método de pago',
  },
  {
    id: 4,
    title: 'Confirmación',
    icon: Package,
    description: 'Revisar y confirmar',
  },
];

export function CheckoutSteps({ currentStep, className }: CheckoutStepsProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Steps horizontales compactos */}
      <div className="sm:hidden">
        <div className="mb-4 flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Círculo del step */}
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full font-semibold text-xs transition-all duration-200',
                    {
                      'bg-primary text-primary-foreground': isCurrent,
                      'bg-green-500 text-white': isCompleted,
                      'bg-muted text-muted-foreground':
                        !isCurrent && !isCompleted,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                {/* Línea conectora */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mt-2 h-0.5 w-12 transition-all duration-200',
                      isCompleted ? 'bg-green-500' : 'bg-border',
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Título del step actual */}
        <div className="text-center">
          <h2 className="font-semibold text-foreground text-lg">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            Paso {currentStep} de {steps.length}
          </p>
        </div>
      </div>

      {/* Desktop: Steps verticales detallados */}
      <div className="hidden sm:block">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative">
                <div className="flex items-center space-x-4 rounded-lg p-3 transition-all duration-200">
                  {/* Círculo del step */}
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-200',
                      {
                        'border-primary bg-primary text-primary-foreground shadow-lg':
                          isCurrent,
                        'border-green-500 bg-green-500 text-white': isCompleted,
                        'border-border bg-background text-muted-foreground':
                          !isCurrent && !isCompleted,
                      },
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  {/* Información del step */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        'font-medium text-sm transition-colors duration-200',
                        {
                          'text-foreground': isCurrent || isCompleted,
                          'text-muted-foreground': !isCurrent && !isCompleted,
                        },
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn('text-xs transition-colors duration-200', {
                        'text-muted-foreground': isCurrent || isCompleted,
                        'text-muted-foreground/60': !isCurrent && !isCompleted,
                      })}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Indicador de estado */}
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    </div>
                  )}
                </div>

                {/* Línea conectora vertical */}
                {index < steps.length - 1 && (
                  <div className="absolute top-16 left-8 h-4 w-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-muted-foreground text-xs">
            <span>Progreso</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
