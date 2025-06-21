import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  type PersonalInfo,
  personalInfoSchema,
} from '@/lib/validation-schemas';
import { Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PersonalInfoFormProps {
  initialData?: Partial<PersonalInfo>;
  onSubmit: (data: PersonalInfo) => void;
  onNext: () => void;
  className?: string;
}

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export function PersonalInfoForm({
  initialData,
  onSubmit,
  onNext,
  className,
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof PersonalInfo, value: string) => {
    try {
      personalInfoSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Campo inválido';
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      return false;
    }
  };

  const handleInputChange = (name: keyof PersonalInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Validar en tiempo real pero solo si el campo ya tiene valor
    if (value.length > 0) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar todos los campos
      const result = personalInfoSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: FormErrors = {};
        result.error.errors.forEach((error) => {
          const field = error.path[0] as keyof PersonalInfo;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
        toast.error('Por favor corrige los errores en el formulario');
        return;
      }

      // Si todo está bien, enviar datos
      onSubmit(result.data);
      toast.success('Información personal guardada');
      onNext();
    } catch (error) {
      toast.error('Error al procesar la información');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return personalInfoSchema.safeParse(formData).success;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground text-xl">
            Información Personal
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Ingresa tus datos de contacto para procesar tu pedido
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="font-medium text-foreground text-sm"
            >
              Nombre *
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => validateField('firstName', formData.firstName)}
              placeholder="Tu nombre"
              className={cn(
                errors.firstName &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {errors.firstName && (
              <p className="text-destructive text-xs">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="font-medium text-foreground text-sm"
            >
              Apellido *
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => validateField('lastName', formData.lastName)}
              placeholder="Tu apellido"
              className={cn(
                errors.lastName &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {errors.lastName && (
              <p className="text-destructive text-xs">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="font-medium text-foreground text-sm"
          >
            Email *
          </label>
          <div className="relative">
            <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => validateField('email', formData.email)}
              placeholder="tu@email.com"
              className={cn(
                'pl-10',
                errors.email &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="font-medium text-foreground text-sm"
          >
            Teléfono *
          </label>
          <div className="relative">
            <Phone className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => validateField('phone', formData.phone)}
              placeholder="+57 300 123 4567"
              className={cn(
                'pl-10',
                errors.phone &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-destructive text-xs">{errors.phone}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Te contactaremos para coordinar la entrega
          </p>
        </div>

        {/* Botón de continuar */}
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
      </form>

      {/* Información adicional */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="mb-2 font-medium text-foreground text-sm">
          🔒 Información Segura
        </h4>
        <p className="text-muted-foreground text-xs">
          Tus datos personales están protegidos y solo se utilizarán para
          procesar tu pedido y coordinar la entrega. No compartimos tu
          información con terceros.
        </p>
      </div>
    </div>
  );
}
