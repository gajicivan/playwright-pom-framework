import { test, expect } from '@playwright/test';
import { DummyJsonApi, LoginResponse } from '../../src/api/DummyJsonApi';

test.describe('DummyJSON auth API @api', () => {
  test('GET /users returns limited list with expected shape', async ({ request }) => {
    const api = new DummyJsonApi(request);
    const response = await api.listUsers(5);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.users).toHaveLength(5);

    for (const user of body.users) {
      expect(user).toMatchObject({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
      });
    }
  });

  test('GET /users/:id returns a single user', async ({ request }) => {
    const api = new DummyJsonApi(request);
    const response = await api.getUser(1);

    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user.id).toBe(1);
    expect(user.email).toContain('@');
  });

  test('POST /auth/login with valid credentials returns access token', async ({ request }) => {
    const api = new DummyJsonApi(request);
    const response = await api.login({ username: 'emilys', password: 'emilyspass' });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as LoginResponse;
    expect(body.username).toBe('emilys');
    expect(body.accessToken).toBeTruthy();
    expect(typeof body.accessToken).toBe('string');
  });

  test('POST /auth/login with invalid credentials returns 400', async ({ request }) => {
    const api = new DummyJsonApi(request);
    const response = await api.login({ username: 'emilys', password: 'wrong-password' });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.accessToken).toBeUndefined();
    expect(String(body.message).toLowerCase()).toContain('invalid');
  });

  test('login then GET /auth/me uses token to fetch the same user (chained)', async ({
    request,
  }) => {
    const api = new DummyJsonApi(request);

    const loginResponse = await api.login({ username: 'emilys', password: 'emilyspass' });
    expect(loginResponse.status()).toBe(200);
    const { accessToken } = (await loginResponse.json()) as LoginResponse;

    const meResponse = await api.getCurrentUser(accessToken);
    expect(meResponse.status()).toBe(200);

    const me = await meResponse.json();
    expect(me.username).toBe('emilys');
    expect(me.email).toContain('@');
  });
});
