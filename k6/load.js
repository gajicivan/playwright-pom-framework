import http from 'k6/http';
import { check, sleep } from 'k6';

// Load test — simulates typical production traffic.
// Ramps up to 50 concurrent users, holds for 3 minutes, ramps down.
// Goal: validate the system handles expected daily load with acceptable latency.
// Run:  k6 run k6/load.js
export const options = {
  stages: [
    { duration: '1m', target: 50 },       // ramp-up
    { duration: '3m', target: 50 },       // steady load
    { duration: '1m', target: 0 },        // ramp-down
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],       // < 2% failures
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    checks: ['rate>0.98'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://dummyjson.com';

export default function () {
  // Read-heavy scenario — list and detail requests
  const listRes = http.get(`${BASE_URL}/users?limit=10`);
  check(listRes, {
    'list returns 200': (r) => r.status === 200,
    'list has users': (r) => JSON.parse(r.body).users.length > 0,
  });

  const userId = Math.floor(Math.random() * 30) + 1;
  const detailRes = http.get(`${BASE_URL}/users/${userId}`);
  check(detailRes, {
    'detail returns 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1);           // 1-3s think time
}
