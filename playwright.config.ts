import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { env } from './src/config/env';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/admin.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  workers: env.isCI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: env.isCI
    ? [
        ['blob'],
        ['json', { outputFile: 'results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['github'],
        ['list'],
      ]
    : [['html', { open: 'on-failure' }], ['list']],

  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    launchOptions: { slowMo: env.slowMo },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /tests\/api\//],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /tests\/api\//],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /tests\/api\//],
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://dummyjson.com',
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});
