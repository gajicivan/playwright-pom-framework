import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test — pushes the system above expected capacity to find the breaking point.
// Ramps aggressively: 100 -> 300 -> 500 VUs.
// Goal: identify at what load the system starts degrading (latency spikes, errors rise).
// Run:  k6 run k6/stress.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },      // baseline
    { duration: '2m', target: 300 },      // beyond expected peak
    { duration: '2m', target: 500 },      // stress territory
    { duration: '2m', target: 0 },        // recovery
  ],
  thresholds: {
    // Looser thresholds — we expect some degradation, want to measure how much
    http_req_failed: ['rate<0.10'],       // tolerate up to 10% failures under stress
    http_req_duration: ['p(95)<3000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://dummyjson.com';

export default function () {
  const res = http.get(`${BASE_URL}/users?limit=5`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
