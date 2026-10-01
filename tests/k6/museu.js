import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { Rate } from 'k6/metrics';

const baseUrl = (__ENV.BASE_URL || 'http://host.docker.internal:5000/api/v1').replace(/\/+$/, '');
const profile = __ENV.PROFILE || 'smoke';
if (!['smoke', 'load'].includes(profile)) throw new Error('PROFILE deve ser smoke ou load');
const rateLimited = new Rate('rate_limited');
const routes = ['acervo', 'busca', 'detalhe', 'eventos'];
const thresholds = {
  http_req_failed: ['rate<0.01'],
  checks: ['rate==1'],
  rate_limited: ['rate==0'],
};
for (const route of routes) {
  thresholds[`http_req_duration{endpoint:${route}}`] = ['p(95)<500'];
  thresholds[`http_reqs{endpoint:${route}}`] = ['count>0'];
}
export const options = {
  scenarios: {
    visita: profile === 'smoke'
      ? { executor: 'shared-iterations', vus: 1, iterations: 1, maxDuration: '1m' }
      : {
          executor: 'ramping-vus', startVUs: 0,
          stages: [
            { duration: '30s', target: 5 },
            { duration: '1m', target: 10 },
            { duration: '2m', target: 10 },
            { duration: '30s', target: 0 },
          ],
          gracefulRampDown: '15s',
        },
  },
  thresholds,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

function get(path, endpoint, validate) {
  const response = http.get(`${baseUrl}${path}`, {
    tags: { endpoint, name: endpoint }, timeout: '10s', redirects: 0,
    headers: { Accept: 'application/json' },
  });
  rateLimited.add(response.status === 429);
  let body;
  try { body = response.json(); } catch (_) { body = null; }
  const valid = check(response, {
    [`${endpoint}: HTTP 200`]: (r) => r.status === 200,
    [`${endpoint}: contrato da resposta`]: () => Boolean(body && validate(body.dados)),
  });
  return { valid, data: body && body.dados, status: response.status };
}

export function setup() {
  const result = get('/works?page=1&pageSize=20', 'preflight',
    (data) => data && Array.isArray(data.content));
  if (!result.valid) exec.test.abort(`API indisponivel ou resposta invalida (HTTP ${result.status}). Confira BASE_URL e limite de requisicoes.`);
  const ids = result.data.content.map((work) => work.idArtwork)
    .filter((id) => Number.isInteger(id) && id > 0);
  if (!ids.length) exec.test.abort('Cadastre ao menos uma obra ficticia antes do teste.');
  return { ids };
}

export default function ({ ids }) {
  get('/works?page=1&pageSize=20', 'acervo',
    (data) => data && Array.isArray(data.content) && data.content.length <= 20);
  sleep(1);
  const term = encodeURIComponent(__ENV.SEARCH_TERM || 'Museu');
  // O backend aplica LIKE ao campo escolhido; title evita buscar no ID numerico.
  get(`/works?page=1&pageSize=20&field=title&order=ASC&search=${term}`, 'busca',
    (data) => data && Array.isArray(data.content));
  sleep(1);
  const id = ids[Math.floor(Math.random() * ids.length)];
  get(`/works/${id}`, 'detalhe', (data) => data && data.idArtwork === id);
  sleep(1);
  get('/events', 'eventos', (data) => Array.isArray(data));
  sleep(2);
}
