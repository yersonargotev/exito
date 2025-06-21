import Script from 'next/script';

interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  );
}

// Componente para múltiples schemas
interface MultipleStructuredDataProps {
  schemas: object[];
}

export function MultipleStructuredData({
  schemas,
}: MultipleStructuredDataProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for schemas
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}
