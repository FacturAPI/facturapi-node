import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('browser smoke (real chromium)', () => {
  let server: ReturnType<typeof createServer>;
  let baseUrl = '';
  let latestUploadContentType: string | undefined;

  test.beforeAll(async () => {
    const distPath = join(process.cwd(), 'dist', 'index.es.js');
    const bundle = await readFile(distPath, 'utf8');

    server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = req.url || '/';

      if (url === '/index.html') {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.end(`<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script type="module">
      import Facturapi from '/dist/index.es.js';
      window.__createFacturapiClient = () => {
        const client = new Facturapi('sk_test_123');
        client.BASE_URL = window.location.origin + '/api/v2';
        return client;
      };
    </script>
  </body>
</html>`);
        return;
      }

      if (url === '/dist/index.es.js') {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/javascript; charset=utf-8');
        res.end(bundle);
        return;
      }

      if (url === '/api/v2/invoices/inv_123/zip' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/zip');
        res.end('zip-binary-content');
        return;
      }

      if (url === '/api/v2/invoices/inv_error' && req.method === 'GET') {
        res.statusCode = 404;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ message: 'invoice not found' }));
        return;
      }

      if (url === '/api/v2/organizations/org_123/logo' && req.method === 'PUT') {
        latestUploadContentType = req.headers['content-type'];
        req.on('data', () => undefined);
        req.on('end', () => {
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ id: 'org_123', object: 'organization' }));
        });
        return;
      }

      res.statusCode = 404;
      res.end('not found');
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to start local test server');
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  test.afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });

  test('downloadZip returns Blob in browser', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    const result = await page.evaluate(async () => {
      const client = (window as any).__createFacturapiClient();
      const zip = await client.invoices.downloadZip('inv_123');
      return {
        isBlob: zip instanceof Blob,
        text: await zip.text(),
      };
    });

    expect(result.isBlob).toBe(true);
    expect(result.text).toBe('zip-binary-content');
  });

  test('uploadLogo sends multipart body in browser', async ({ page }) => {
    latestUploadContentType = undefined;
    await page.goto(`${baseUrl}/index.html`);

    const organizationId = await page.evaluate(async () => {
      const client = (window as any).__createFacturapiClient();
      const organization = await client.organizations.uploadLogo(
        'org_123',
        new Uint8Array([1, 2, 3]),
      );
      return organization.id;
    });

    expect(organizationId).toBe('org_123');
    expect(latestUploadContentType).toContain('multipart/form-data');
    expect(latestUploadContentType).toContain('boundary=');
    expect(latestUploadContentType).not.toContain('application/json');
  });

  test('non-ok JSON errors surface message in browser runtime', async ({ page }) => {
    await page.goto(`${baseUrl}/index.html`);

    const message = await page.evaluate(async () => {
      try {
        const client = (window as any).__createFacturapiClient();
        await client.invoices.retrieve('inv_error');
        return 'no-error';
      } catch (error) {
        return (error as Error).message;
      }
    });

    expect(message).toBe('invoice not found');
  });
});
