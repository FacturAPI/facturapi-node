import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test/browser',
  timeout: 30_000,
  workers: 1,
  fullyParallel: false,
  use: {
    browserName: 'chromium',
    headless: true,
  },
});
