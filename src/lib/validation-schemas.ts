import { z } from 'zod';

// Esquema para información personal
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
      'El apellido solo puede contener letras',
    ),

  email: z
    .string()
    .email('Ingresa un email válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres'),

  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede tener más de 15 dígitos')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido'),
});

// Esquema para dirección de envío
export const shippingAddressSchema = z.object({
  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede tener más de 200 caracteres'),

  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'La ciudad solo puede contener letras'),

  state: z
    .string()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(100, 'El departamento no puede tener más de 100 caracteres'),

  postalCode: z
    .string()
    .min(5, 'El código postal debe tener al menos 5 caracteres')
    .max(10, 'El código postal no puede tener más de 10 caracteres')
    .regex(
      /^[\d\-]+$/,
      'El código postal solo puede contener números y guiones',
    ),

  country: z.string().min(2, 'El país es requerido').default('Colombia'),
});

// Esquema para información de pago
export const paymentInfoSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'El número de tarjeta debe tener al menos 13 dígitos')
    .max(19, 'El número de tarjeta no puede tener más de 19 dígitos')
    .regex(/^[\d\s]+$/, 'El número de tarjeta solo puede contener números')
    .transform((val) => val.replace(/\s/g, '')) // Remover espacios
    .refine((val) => {
      // Validación básica de Luhn para tarjetas de crédito (ficticio)
      return val.length >= 13 && val.length <= 19;
    }, 'Número de tarjeta inválido'),

  cardHolderName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'El nombre solo puede contener letras'),

  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Mes inválido (01-12)'),

  expiryYear: z
    .string()
    .regex(/^20\d{2}$/, 'Año inválido')
    .refine((year) => {
      const currentYear = new Date().getFullYear();
      const expYear = Number.parseInt(year);
      return expYear >= currentYear && expYear <= currentYear + 20;
    }, 'La tarjeta está vencida o el año es inválido'),

  cvv: z
    .string()
    .min(3, 'El CVV debe tener 3 o 4 dígitos')
    .max(4, 'El CVV debe tener 3 o 4 dígitos')
    .regex(/^\d+$/, 'El CVV solo puede contener números'),
});

// Esquema combinado para todo el checkout
export const checkoutSchema = z.object({
  personalInfo: personalInfoSchema,
  shippingAddress: shippingAddressSchema,
  paymentInfo: paymentInfoSchema,
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
  subscribeNewsletter: z.boolean().optional().default(false),
});

// Tipos TypeScript derivados de los esquemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Esquema para la información del pedido completado
export const orderSchema = z.object({
  orderId: z.string(),
  items: z.array(
    z.object({
      productId: z.number(),
      title: z.string(),
      price: z.number(),
      quantity: z.number(),
      image: z.string(),
    }),
  ),
  totalAmount: z.number(),
  shippingCost: z.number(),
  finalTotal: z.number(),
  customerInfo: personalInfoSchema,
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.object({
    cardLast4: z.string(),
    cardType: z.string(),
  }),
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
  ]),
  createdAt: z.date(),
  estimatedDelivery: z.date(),
});

export type Order = z.infer<typeof orderSchema>;

// Utilitades para validación
export const validatePersonalInfo = (data: unknown) => {
  return personalInfoSchema.safeParse(data);
};

export const validateShippingAddress = (data: unknown) => {
  return shippingAddressSchema.safeParse(data);
};

export const validatePaymentInfo = (data: unknown) => {
  return paymentInfoSchema.safeParse(data);
};

export const validateCheckoutForm = (data: unknown) => {
  return checkoutSchema.safeParse(data);
};
