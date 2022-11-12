import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  let res = http.get('http://localhost:3000/reviews?product_id=66642');
  check(res, {
    'Status is 200': r => r.status === 200
  })
  sleep(1);
}


