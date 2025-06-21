import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  type ShippingAddress,
  shippingAddressSchema,
} from '@/lib/validation-schemas';
import { Building, Globe, Home, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShippingAddressFormProps {
  initialData?: Partial<ShippingAddress>;
  onSubmit: (data: ShippingAddress) => void;
  onNext: () => void;
  onBack: () => void;
  className?: string;
}

type FormErrors = {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

const colombianCities = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Manizales',
  'Ibagué',
  'Santa Marta',
  'Villavicencio',
  'Bello',
  'Valledupar',
  'Montería',
  'Popayán',
  'Pasto',
  'Armenia',
];

const colombianStates = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
];

export function ShippingAddressForm({
  initialData,
  onSubmit,
  onNext,
  onBack,
  className,
}: ShippingAddressFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'Colombia',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof ShippingAddress, value: string) => {
    try {
      shippingAddressSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Campo inválido';
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      return false;
    }
  };

  const handleInputChange = (name: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.length > 0) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = shippingAddressSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: FormErrors = {};
        result.error.errors.forEach((error) => {
          const field = error.path[0] as keyof ShippingAddress;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
        toast.error('Por favor corrige los errores en el formulario');
        return;
      }

      onSubmit(result.data);
      toast.success('Dirección de envío guardada');
      onNext();
    } catch (error) {
      toast.error('Error al procesar la dirección');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return shippingAddressSchema.safeParse(formData).success;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground text-xl">
            Dirección de Envío
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Indica dónde quieres recibir tu pedido
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dirección completa */}
        <div className="space-y-2">
          <label
            htmlFor="address"
            className="font-medium text-foreground text-sm"
          >
            Dirección completa *
          </label>
          <div className="relative">
            <Home className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => validateField('address', formData.address)}
              placeholder="Calle 123 #45-67, Barrio Centro"
              className={cn(
                'pl-10',
                errors.address &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
          </div>
          {errors.address && (
            <p className="text-destructive text-xs">{errors.address}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Incluye calle, número, apartamento o casa
          </p>
        </div>

        {/* Ciudad y Departamento */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="font-medium text-foreground text-sm"
            >
              Ciudad *
            </label>
            <div className="relative">
              <Building className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => validateField('city', formData.city)}
                placeholder="Bogotá"
                className={cn(
                  'pl-10',
                  errors.city &&
                    'border-destructive focus-visible:ring-destructive',
                )}
                list="cities"
              />
              <datalist id="cities">
                {colombianCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            {errors.city && (
              <p className="text-destructive text-xs">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="state"
              className="font-medium text-foreground text-sm"
            >
              Departamento *
            </label>
            <div className="relative">
              <MapPin className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                onBlur={() => validateField('state', formData.state)}
                placeholder="Cundinamarca"
                className={cn(
                  'pl-10',
                  errors.state &&
                    'border-destructive focus-visible:ring-destructive',
                )}
                list="states"
              />
              <datalist id="states">
                {colombianStates.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </div>
            {errors.state && (
              <p className="text-destructive text-xs">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Código Postal y País */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="postalCode"
              className="font-medium text-foreground text-sm"
            >
              Código Postal *
            </label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              onBlur={() => validateField('postalCode', formData.postalCode)}
              placeholder="110111"
              className={cn(
                errors.postalCode &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {errors.postalCode && (
              <p className="text-destructive text-xs">{errors.postalCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="font-medium text-foreground text-sm"
            >
              País *
            </label>
            <div className="relative">
              <Globe className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                onBlur={() => validateField('country', formData.country)}
                placeholder="Colombia"
                className={cn(
                  'pl-10',
                  errors.country &&
                    'border-destructive focus-visible:ring-destructive',
                )}
                readOnly
              />
            </div>
            {errors.country && (
              <p className="text-destructive text-xs">{errors.country}</p>
            )}
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
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

      {/* Información de envío */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="mb-2 font-medium text-foreground text-sm">
          📦 Información de Envío
        </h4>
        <div className="space-y-1 text-muted-foreground text-xs">
          <p>• Tiempo de entrega: 3-5 días hábiles</p>
          <p>• Envío gratis en compras superiores a $380.000 COP</p>
          <p>• Realizamos entregas de lunes a viernes</p>
          <p>• Te contactaremos para coordinar la entrega</p>
        </div>
      </div>
    </div>
  );
}
