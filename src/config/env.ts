import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  testEnv: process.env.TEST_ENV ?? 'demo',
  baseUrl: required('BASE_URL', 'https://opensource-demo.orangehrmlive.com'),
  admin: {
    username: required('ADMIN_USERNAME', 'Admin'),
    password: required('ADMIN_PASSWORD', 'admin123'),
  },
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? 0),
  isCI: !!process.env.CI,
} as const;

export type AppEnv = typeof env;
