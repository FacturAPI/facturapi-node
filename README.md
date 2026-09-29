# Facturapi para Node.js y TypeScript

[![npm](https://img.shields.io/npm/v/facturapi)](https://www.npmjs.com/package/facturapi)
[![CI](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml/badge.svg)](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Integra facturación electrónica en México desde JavaScript o TypeScript. Crea CFDI, entrega sus archivos PDF y XML y administra clientes, productos y organizaciones con el SDK oficial de [Facturapi](https://www.facturapi.io).

[Documentación](https://docs.facturapi.io) · [Referencia de la API](https://docs.facturapi.io/api/) · [Crear una cuenta](https://www.facturapi.io/register) · [Changelog](CHANGELOG.md)

## Tu primera factura de prueba

Necesitas Node.js 18 o superior y la **Test Secret Key de una organización**. Obtén la llave en tu cuenta de Facturapi y guárdala en la variable de entorno `FACTURAPI_KEY`. El ambiente Test no requiere suscripción; sus facturas no se envían al SAT ni tienen validez fiscal.

```sh
npm install facturapi
```

También puedes instalarlo con `pnpm add facturapi` o `yarn add facturapi`.

Guarda lo siguiente en `primera-factura.mjs`. Los datos del receptor son ficticios para este ejemplo en ambiente Test. No necesitas crear previamente un cliente o un producto: puedes incluir sus datos en la misma petición.

```js
import Facturapi, { PaymentForm } from 'facturapi'

if (!process.env.FACTURAPI_KEY) {
  throw new Error(
    'Configura FACTURAPI_KEY con la Test Secret Key de tu organización',
  )
}

const facturapi = new Facturapi(process.env.FACTURAPI_KEY)

const invoice = await facturapi.invoices.create({
  customer: {
    legal_name: 'Cliente de prueba',
    tax_id: 'ABC101010111',
    tax_system: '601',
    address: { zip: '85900' },
  },
  items: [
    {
      quantity: 1,
      product: {
        description: 'Ukelele',
        product_key: '60131324',
        price: 345.6,
        taxes: [{ type: 'IVA', rate: 0.16 }],
      },
    },
  ],
  use: 'G01',
  payment_form: PaymentForm.TARJETA_DE_DEBITO,
})

console.log({ id: invoice.id, status: invoice.status, total: invoice.total })
```

Ejecuta `node primera-factura.mjs` con la variable de entorno configurada. Conserva `invoice.id` para consultar, descargar o enviar la factura.

Para emitir en producción, configura los datos fiscales y el CSD de la organización y utiliza su Live Secret Key. Consulta la [guía de configuración de organizaciones](https://docs.facturapi.io/docs/getting-started/organization-onboarding).

## ESM, CommonJS y TypeScript

Con ESM o TypeScript:

```ts
import Facturapi, { InvoiceType, type Invoice } from 'facturapi'
```

Con CommonJS, desde el SDK 6:

```js
const Facturapi = require('facturapi')
const { InvoiceType, FacturapiError } = Facturapi
```

Los tipos y enums públicos se importan desde `facturapi`. El paquete incluye declaraciones para ESM y CommonJS; no necesitas instalar un paquete de tipos adicional para el SDK.

## Operaciones frecuentes

Los siguientes ejemplos continúan con las variables `facturapi` e `invoice` del primer ejemplo; usa `await` dentro de una función `async` si tu proyecto es CommonJS.

### Consultar y buscar facturas

```js
const savedInvoice = await facturapi.invoices.retrieve(invoice.id)
const results = await facturapi.invoices.list({
  limit: 10,
  date: { gte: new Date('2026-01-01T00:00:00Z') },
})

console.log(savedInvoice.status, results.data)
```

### Entregar el PDF o enviarlo por correo

```js
const download = await facturapi.invoices.downloadPdfUrl(invoice.id)
console.log(download.url, download.expires_at)

await facturapi.invoices.sendByEmail(invoice.id, {
  email: 'cliente@example.com',
})
```

La URL de descarga es temporal y permite acceder al archivo a quien la tenga. Compártela solo con el destinatario correspondiente. También existen `downloadXmlUrl` y `downloadZipUrl`.

Si necesitas recibir los archivos en tu aplicación, `downloadPdf`, `downloadXml` y `downloadZip` devuelven un stream en Node.js y un `Blob` en navegador. Por ejemplo, para guardar un ZIP en Node.js:

```js
import { createWriteStream } from 'node:fs'

const file = await facturapi.invoices.downloadZip(invoice.id)
if ('pipe' in file && typeof file.pipe === 'function') {
  file.pipe(createWriteStream('factura.zip'))
}
```

### Manejar errores

```js
import { FacturapiError } from 'facturapi'

try {
  await facturapi.invoices.retrieve(invoice.id)
} catch (error) {
  if (error instanceof FacturapiError) {
    console.error(error.status, error.code, error.message)
    console.error(error.errors) // Detalles de validación, cuando existen
  } else {
    throw error
  }
}
```

Usa `error.code` y los detalles de validación para decidir cómo responder; evita depender del texto del mensaje. Consulta la [referencia de errores](https://docs.facturapi.io/docs/getting-started/errors).

## Qué puedes integrar

| Necesitas…                                | Recurso o guía                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Emitir ingresos, egresos y complementos   | `facturapi.invoices` · [Guías de facturas](https://docs.facturapi.io/docs/guides/invoices)                          |
| Reutilizar clientes y productos           | `facturapi.customers` y `facturapi.products`                                                                        |
| Ofrecer autofactura con recibos digitales | `facturapi.receipts` · [Guía de recibos](https://docs.facturapi.io/docs/guides/receipts)                            |
| Administrar emisores y certificados       | `facturapi.organizations` · [Configuración](https://docs.facturapi.io/docs/getting-started/organization-onboarding) |
| Emitir retenciones                        | `facturapi.retentions` · [Guía de retenciones](https://docs.facturapi.io/docs/guides/invoices/retencion)            |
| Consultar catálogos del SAT               | `facturapi.catalogs`, `facturapi.cartaPorteCatalogs` y `facturapi.comercioExteriorCatalogs`                         |
| Recibir eventos y validar firmas          | `facturapi.webhooks` · [Referencia de la API](https://docs.facturapi.io/api/)                                       |

## Compatibilidad y migración a v6

| Entorno      | Soporte                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| Node.js      | 18 o superior; CI ejecuta pruebas en Node 18 y 24                               |
| Navegador    | Requiere `fetch`, `FormData` y `Blob`; probado en Chromium                      |
| React Native | Requiere esas APIs globales; no se ejecuta una suite específica de React Native |

Mantén las llaves secretas en tu servidor. La compatibilidad de runtime con navegadores no convierte una llave secreta en pública.

Al migrar de v5 a v6:

- Las fechas de respuesta documentadas como instantes se entregan como `Date`. Para obtener un string, usa `toISOString()`. `stamp.date` conserva el texto de fecha y hora del SAT.
- Algunos campos de fecha pueden ser `null`; consulta los tipos antes de usarlos.
- Importa desde `facturapi`. Los paths internos como `facturapi/dist/...` ya no forman parte del contrato público.
- CommonJS acepta el constructor directamente. La forma anterior con `.default` sigue funcionando como alias de compatibilidad.

Consulta los detalles en el [changelog](CHANGELOG.md).

## Ayuda y contribuciones

¿Encontraste un problema? [Abre un issue](https://github.com/FacturAPI/facturapi-node/issues/new) con la versión del SDK, tu runtime y un ejemplo mínimo reproducible. Omite llaves secretas y datos fiscales reales.

Para dudas de integración, consulta la [documentación](https://docs.facturapi.io) o escribe a [contacto@facturapi.io](mailto:contacto@facturapi.io).

Para contribuir, instala las dependencias con la versión de pnpm indicada en `package.json` y Node.js 24.11 o superior compatible con las herramientas de build:

```sh
pnpm install
pnpm test
pnpm run lint
```

El proyecto se distribuye bajo la [licencia MIT](LICENSE).
