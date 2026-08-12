import { expectAssignable, expectType, expectError } from 'tsd';
import Facturapi, {
  BinaryDownload,
  FacturapiError,
  InvoiceType,
  IssuingType,
  NodeLikeReadableStream,
  SearchResult,
  TaxFactor,
  ZipRequest,
} from '../dist';

const client = new Facturapi('sk_test_123');

const zipPromise = client.invoices.downloadZip('inv_123');
expectType<Promise<BinaryDownload>>(zipPromise);

expectType<Promise<ZipRequest>>(
  client.invoices.createZipRequest({
    year: 2025,
    month: 3,
    issuer_type: IssuingType.ISSUING,
    invoice_types: [InvoiceType.INGRESO, InvoiceType.EGRESO],
  }),
);
expectType<Promise<SearchResult<ZipRequest>>>(
  client.invoices.listZipRequests({
    year: 2025,
    month: 3,
    status: 'finished',
    limit: 20,
    page: 1,
  }),
);
expectType<Promise<ZipRequest>>(
  client.invoices.retrieveZipRequest('zip_request_123'),
);
expectType<Promise<BinaryDownload>>(
  client.invoices.downloadZipRequest('zip_request_123'),
);

declare const nodeLike: NodeLikeReadableStream;
nodeLike.on('data', (chunk) => {
  expectType<unknown>(chunk);
});

if (nodeLike.pipe) {
  const destination = { write: (_chunk: unknown) => undefined };
  expectType<typeof destination>(nodeLike.pipe(destination));
}

declare const binary: BinaryDownload;
expectError(binary.pipe({}));

if ('pipe' in binary && typeof binary.pipe === 'function') {
  const destination = { write: (_chunk: unknown) => undefined };
  expectType<typeof destination>(binary.pipe(destination));
}

expectAssignable<TaxFactor>(TaxFactor.EXENTO);

declare const apiError: FacturapiError;
expectType<number>(apiError.status);
expectType<string | undefined>(apiError.code);
expectType<string | undefined>(apiError.path);
expectType<string | undefined>(apiError.location);
expectType<string | undefined>(apiError.logId);
expectType<Record<string, string>>(apiError.headers);
