# Facturapi para JavaScript y TypeScript

[![npm](https://img.shields.io/npm/v/facturapi)](https://www.npmjs.com/package/facturapi)
[![CI](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml/badge.svg)](https://github.com/FacturAPI/facturapi-node/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Integra facturación electrónica en México desde Node.js o navegadores, con JavaScript o TypeScript. Crea CFDI, entrega sus archivos PDF y XML y administra clientes, productos y organizaciones con el SDK oficial de [Facturapi](https://www.facturapi.io).

[Documentación](https://docs.facturapi.io) · [Referencia de la API](https://docs.facturapi.io/api/) · [Crear una cuenta](https://www.facturapi.io/register) · [Changelog](CHANGELOG.md)

## Tu primera factura de prueba 🚀

Vamos a crear una factura de prueba. Necesitas Node.js 18 o superior y la **Test Secret Key de una organización**, que encontrarás en tu cuenta de Facturapi. Guárdala en la variable de entorno `FACTURAPI_KEY`.

Puedes empezar sin una suscripción: las facturas del ambiente Test no se envían al SAT ni tienen validez fiscal. Primero, instala el SDK:

```sh
npm install facturapi
```

También puedes instalarlo con `pnpm add facturapi` o `yarn add facturapi`.

Guarda lo siguiente en `primera-factura.mjs`. Los datos del receptor son ficticios para este ejemplo en ambiente Test. No necesitas crear previamente un cliente o un producto: puedes incluir sus datos en la misma petición.

```js
import Facturapi, { PaymentForm } from 'facturapi'

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

Ejecuta `node primera-factura.mjs` con la variable de entorno configurada. Si todo salió bien, verás el ID, el estado y el total de tu primera factura. Guarda `invoice.id`: lo usaremos en los siguientes ejemplos.

Para emitir en producción, configura los datos fiscales y el CSD de la organización y utiliza su Live Secret Key. Consulta la [guía de configuración de organizaciones](https://docs.facturapi.io/docs/getting-started/organization-onboarding).

## ESM, CommonJS y TypeScript

Elige la forma de importar que ya usas en tu proyecto. Con ESM o TypeScript:

```ts
import Facturapi, { InvoiceType, type Invoice } from 'facturapi'
```

Con CommonJS:

```js
const Facturapi = require('facturapi')
const { InvoiceType, FacturapiError } = Facturapi
```

Los tipos y enums públicos se importan desde `facturapi`. El paquete incluye declaraciones para ESM y CommonJS; no necesitas instalar un paquete de tipos adicional para el SDK.

## Operaciones frecuentes

Ya tienes una factura. Ahora puedes consultarla, descargarla o enviarla por correo. Estos ejemplos usan las variables `facturapi` e `invoice` que creaste arriba. Si usas CommonJS, coloca las llamadas con `await` dentro de una función `async`.

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

### Crear clientes con tipos específicos

Elige el método que corresponde a tu cliente para ver sus campos requeridos en el autocompletado:

```ts
await facturapi.customers.createNational({
  legal_name: 'EMPRESA DE EJEMPLO',
  tax_id: 'ABC101010111',
  tax_system: '601',
  address: { zip: '83200' },
})
await facturapi.customers.createForeign({
  legal_name: 'Example Company',
  address: { country: 'USA' },
})
await facturapi.customers.createGeneric({
  legal_name: 'PUBLICO EN GENERAL',
  tax_id: 'XAXX010101000',
})
```

Los tres métodos usan la misma operación de la API. `create()` sigue disponible si decides el caso dinámicamente, o si quieres guardar datos incompletos con `{ createEditLink: true }`. Las validaciones siguen siendo responsabilidad de la API.

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

## Compatibilidad

| Entorno      | Soporte                                                                         |
| ------------ | ------------------------------------------------------------------------------- |
| Node.js      | 18 o superior; CI ejecuta pruebas en Node 18 y 24                               |
| Navegador    | Requiere `fetch`, `FormData` y `Blob`; probado en Chromium                      |
| React Native | Requiere esas APIs globales; no se ejecuta una suite específica de React Native |

Mantén las llaves secretas en tu servidor. La compatibilidad de runtime con navegadores no convierte una llave secreta en pública.

## Actualizar desde v3, v4 o v5

Puedes pasar directamente a v6; no necesitas instalar las versiones intermedias. En Node.js, comprueba primero que uses la versión 18 o superior. Busca tu versión actual y revisa los apartados que le corresponden:

| Tu versión | Qué revisar                                                     |
| ---------- | --------------------------------------------------------------- |
| 5.x        | Fechas, imports y tipos de entrada                               |
| 4.x        | Lo anterior y tipos de respuesta                                 |
| 3.x        | Los tres apartados, incluidos los métodos renombrados y Node.js |

### ✅ Cuándo puedes actualizar sin cambiar tu código

Si tu integración usa los métodos vigentes, importa desde `facturapi`, corre en Node.js 18+ y no depende de fechas como strings ni de los tipos anteriores que se describen abajo, puedes conservar tus llamadas al SDK. Por ejemplo, crear una factura, leer su `id` y descargar su PDF con los métodos actuales no requiere reescribir ese flujo.

También puedes conservar:

- **Tus imports públicos:** `import Facturapi from 'facturapi'` y el `require('facturapi')` de v3 funcionan en v6. Si usabas `.default` en v4/v5, ese alias sigue disponible.
- **La inicialización y los enums:** `new Facturapi(apiKey)` y accesos como `Facturapi.PaymentForm.EFECTIVO` siguen funcionando. No necesitas cambiar tus llaves por actualizar el SDK.
- **Las descargas en Node.js:** los métodos `downloadPdf`, `downloadXml` y `downloadZip` siguen devolviendo streams que puedes guardar con `.pipe()`.
- **El manejo básico de errores:** puedes seguir usando `catch` y `error.message`. Los campos de `FacturapiError` son información adicional que puedes adoptar cuando la necesites.

Actualiza la dependencia con `npm install facturapi@^6` (o el equivalente de tu gestor) y ejecuta las pruebas de tu integración. Si usas TypeScript, comprueba también la compilación: sus tipos ahora describen más casos reales de la respuesta.

### Desde v5: fechas, imports y tipos de entrada

**Fechas de respuesta.** Los campos de fecha como `created_at`, `date` y `expires_at` ahora son objetos `Date` en ejecución, incluso donde versiones anteriores ya los declaraban como `Date` en TypeScript. Esto también aplica al evento que devuelve `webhooks.validateSignature`.

Si usabas métodos de string como `.slice()` o `.split()`, convierte primero la fecha. Comprueba `null` cuando el campo lo permita:

```js
const invoiceDate = invoice.date?.toISOString() ?? null
```

Si ya usabas métodos de `Date`, o no leías esos campos, no necesitas adaptarlos. `JSON.stringify()` convierte los objetos `Date` a strings ISO automáticamente, aunque su formato puede normalizarse (por ejemplo, incluir milisegundos); no dependas de conservar el texto exacto de la respuesta anterior.

`stamp.date` conserva el string de fecha y hora del SAT. Las fechas de calendario declaradas como `date` en la API también conservan su texto, por ejemplo las fechas de nómina en formato `YYYY-MM-DD`. El SDK tampoco convierte los valores de `metadata`. Los filtros de entrada, como `date: { gte, lt }`, siguen siendo objetos de rango; no necesitas convertirlos en una sola fecha.

**Valores ausentes.** Los tipos ahora permiten `null` donde la API puede devolverlo: por ejemplo, en `invoice.date`, `retention.fecha_exp` y `organization.pending_plan_update`. Conserva tus comprobaciones si ya contemplabas ese caso; de lo contrario, agrégalas antes de acceder al valor. Revisa también tus fixtures de TypeScript.

**Imports.** Si importas desde `facturapi`, puedes seguir haciéndolo. Si importabas desde `facturapi/dist/...` u otra ruta interna, usa la raíz del paquete: los tipos, enums y el constructor públicos están disponibles allí.

**TypeScript.** Las entradas ahora describen los campos que acepta la API. Si tus objetos ya cumplen ese contrato, no necesitas cambiar las llamadas. Corrige los campos desconocidos o de otro tipo que antes pasaban por `Record<string, any>`; las fechas de entrada siguen aceptando strings ISO y objetos `Date`. Los tipos de respuesta también reflejan campos opcionales: por ejemplo, `property_tax_account` puede faltar y las fechas de un rol pueden ser `null`.

Los tipos de CFDI distinguen emisión, borrador y edición; cada complemento relaciona su `type` con la estructura de `data`. En nómina, las entradas usan las claves del catálogo de percepciones publicado: `019` requiere `horas_extra`, y el origen de recursos `IM` requiere `monto_recurso_propio`. Si incluyes autotransporte de Carta Porte, completa su vehículo y seguro de responsabilidad civil. Estas relaciones ayudan a detectar errores al compilar; la API sigue siendo responsable de validar los datos.

**Clientes.** No necesitas reemplazar `customers.create()`: los métodos `createNational()`, `createForeign()` y `createGeneric()` son opcionales. Para crear datos incompletos, usa `customers.create(data, { createEditLink: true })`. El flag debe ser literalmente `true` para que TypeScript seleccione esa entrada; un boolean dinámico conserva los campos del contrato normal. Los métodos específicos conservan sus campos requeridos aunque envíes ese flag.

**Cancelaciones.** Cuando uses los motivos `01` o `04`, incluye `substitution`. Los motivos `02` y `03` no lo requieren. Para eliminar un borrador, puedes seguir llamando a `cancel(id)` sin parámetros.

**Recibos.** `receipts.toInvoice(data)` distingue la factura creada del resumen devuelto con `dry_run: true`. Si el flag es dinámico, comprueba qué respuesta recibiste antes de acceder a campos exclusivos de una factura. En `createGlobalInvoice()`, si proporcionas `receipts`, incluye `from` y `to`; si tu petición ya los incluía, no necesitas cambiarla.

Si consultabas `invoice.cancellation`, usa `invoice.cancellation_status` para el estado y `invoice.canceled_at` para la fecha de cancelación. En solicitudes de ZIP, utiliza las fechas documentadas como `created_at` y `scheduled_at`; `updated_at` no forma parte de esa respuesta.

### Desde v4: tipos de respuesta

Además de lo anterior, revisa el código que depende de la forma de las respuestas:

- En `SearchResult<T>`, `page`, `total_pages` y `total_results` pueden faltar. Comprueba que existan antes de hacer cálculos; un total ausente no significa cero. Si solo recorres `result.data`, no necesitas cambiar ese código.
- Si importabas `CursorSearchResult<T>`, usa `SearchResult<T>`. Los campos `previous_cursor` y `next_cursor` son opcionales.
- Si vienes de una versión anterior a 4.20, `property_tax_account` se declara como un arreglo de strings. Si tus datos ya reflejan la respuesta de la API, no necesitas transformarlos.

### Desde v3: métodos renombrados y Node.js

Revisa también los dos apartados anteriores. Necesitas **Node.js 18 o superior**; si ya lo usas, no tienes que cambiar de runtime para instalar v6.

Estos son los reemplazos de los métodos retirados en v4. Solo necesitas cambiar las llamadas que uses:

| Antes                                    | En v6                                              |
| ---------------------------------------- | -------------------------------------------------- |
| `facturapi.products.keys('café')`        | `facturapi.catalogs.searchProducts({ q: 'café' })` |
| `facturapi.products.units('pieza')`      | `facturapi.catalogs.searchUnits({ q: 'pieza' })`   |
| `facturapi.invoices.editDraft(id, data)` | `facturapi.invoices.updateDraft(id, data)`         |

Si sigues en **3.0 o 3.1** y usabas `organizations.getApiKeys`, ese método se retiró en 3.2. Para consultar la llave de prueba, usa `organizations.getTestApiKey(id)`. Para producción, conserva tu llave existente; `listLiveApiKeys(id)` devuelve información de las llaves, no sus secretos completos. Los métodos `renewTestApiKey` y `renewLiveApiKey` rotan credenciales: no los uses como sustituto de una consulta.

Si usas TypeScript, el SDK ya incluye sus propios tipos. Revisa tus declaraciones locales y fixtures: las respuestas antes sin tipar ahora incluyen enums, campos opcionales y valores nullable. Una integración en JavaScript no necesita convertirse a TypeScript.

Para ver las novedades de cada versión, consulta el [changelog](CHANGELOG.md).

## Ayuda y contribuciones

¿Encontraste un problema? [Abre un issue](https://github.com/FacturAPI/facturapi-node/issues/new) con la versión del SDK, tu runtime y un ejemplo mínimo reproducible. Omite llaves secretas y datos fiscales reales.

Para dudas de integración, consulta la [documentación](https://docs.facturapi.io) o escribe a [contacto@facturapi.io](mailto:contacto@facturapi.io).

Para contribuir, instala las dependencias con la versión de pnpm indicada en `package.json` y Node.js 24.11 o superior compatible con las herramientas de build:

```sh
pnpm install
pnpm test
pnpm run lint
```

### Explora los tipos y el autocompletado

Abre [`playground/index.mts`](playground/index.mts) en VSCode y pasa el cursor sobre los métodos y respuestas, o modifica las entradas para probar el autocompletado. El archivo importa el paquete desde el build local, con los mismos exports y declaraciones que se publican en npm. Sus funciones no se ejecutan automáticamente ni hacen llamadas al abrir el archivo.

```sh
pnpm playground:check
```

El comando actualiza el build y comprueba los ejemplos. Vuelve a ejecutarlo después de cambiar el SDK; las comprobaciones normales de tipos también incluyen el playground.

El proyecto se distribuye bajo la [licencia MIT](LICENSE).
