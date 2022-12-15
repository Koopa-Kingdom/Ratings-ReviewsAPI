import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {

  const url = 'http://localhost:3000/reviews';
  const endpoint = '?product_id=66642';

  let res = http.get(url + endpoint);
  check(res, {
    'status is 200': r => r.status === 200,
    'body contains relevant product id': r => r.body.includes(66642),
    'body is under 2.5 kilobytes': r => r.body.length < 2500
  });

  const payload = JSON.stringify({product_id: 82,
  rating: 1,
  summary: 'Terrible product!',
  body: 'Nothing else to say. The summary says it all.',
  recommend: true,
  name: 'Iridos',
  email: 'iridos@gmail.com'
  });

  const params = {
    headers: { 'Content-Type': 'application/json'}
  };

  res = http.post(url, payload, params);
  check(res, {
    'status is 201': r => r.status ===201,
    'responds with created': r => r.body.includes('Created')
  })
  //sleep(1);
}

// export const options = {
//   stages: [
//     { duration: '1m', target: 100 },
//     { duration: '1m', target: 100 },
//     { duration: '1m', target: 0 }
//   ],
//   thresholds: {
//     'http_req_duration': ['p99<1500']
//   }
// };