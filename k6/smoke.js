import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test — sanity check that the system responds under minimal load.
// Goal: validate the API is reachable and basic flows return 200 fast.
// Run:  k6 run k6/smoke.js
export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],       // < 1% failed requests
    http_req_duration: ['p(95)<800'],     // 95% under 800ms
    checks: ['rate>0.99'],                // > 99% of checks pass
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://dummyjson.com';

export default function () {
  const res = http.get(`${BASE_URL}/users?limit=5`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has 5 users': (r) => JSON.parse(r.body).users.length === 5,
  });

  sleep(1);
}
