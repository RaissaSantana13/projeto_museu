# Testes k6 do Museu

Executar os comandos abaixo no PowerShell. Docker Desktop deve estar iniciado em modo de containers Linux. Nao e necessario manter um container k6 aberto: cada comando cria um container temporario e o remove ao terminar. O PostgreSQL e a API precisam estar funcionando; o frontend nao e necessario.

## 1. Iniciar a API local

Use um banco com dados ficticios e pelo menos uma obra. Preserve as configuracoes de banco ja utilizadas pelo backend.

```powershell
cd C:\Users\hugop\projeto_museu\nest_museu
$env:NODE_ENV = 'development'
$env:K6_LOAD_TEST = 'true'
npm run build
node dist/main.js
```

O backend limita normalmente cada rota a 10 requisicoes/minuto por IP. `K6_LOAD_TEST=true` aumenta esse limite para 100000 apenas com NODE_ENV=development ou test; outros ambientes recusam iniciar com a opcao. Isso mede capacidade sem esbarrar imediatamente no limite. Nao configure essa opcao na producao. Para testar a protecao contra excesso de requisicoes, use outro teste com o limite normal.

Ao terminar, encerre a API com Ctrl+C, execute `Remove-Item Env:K6_LOAD_TEST` no mesmo terminal e reinicie normalmente. A opcao nao desativa autenticacao.

## 2. Verificacao inicial

Em outro terminal:

```powershell
cd C:\Users\hugop\projeto_museu
docker run --rm -v "${PWD}/tests/k6:/scripts" -e BASE_URL=http://host.docker.internal:5000/api/v1 -e PROFILE=smoke grafana/k6 run /scripts/museu.js --summary-export=/scripts/results/smoke.json
```

Substitua 5000 pela PORT real da API. O codigo usa 5000 como fallback, mas sua configuracao pode definir outra porta. `host.docker.internal` permite ao container acessar a API no Windows; localhost dentro do container aponta para o proprio container. Se a API tambem estiver no Docker, publique sua porta no host ou use uma rede compartilhada e o nome do servico como BASE_URL.

O perfil smoke faz uma leitura inicial e uma visita: listagem de obras, busca por titulo, detalhe de uma obra existente e eventos. Valida HTTP 200 e a estrutura `dados` utilizada pela API. Um banco sem obras interrompe o teste, evitando um falso sucesso sem testar detalhes. Nao cadastra, altera ou exclui registros.

## 3. Carga gradual

Depois que o smoke passar:

```powershell
docker run --rm -v "${PWD}/tests/k6:/scripts" -e BASE_URL=http://host.docker.internal:5000/api/v1 -e PROFILE=load grafana/k6 run /scripts/museu.js --summary-export=/scripts/results/load.json
```

Durante quatro minutos, sobe para 5 e depois 10 usuarios virtuais, sustenta 10 e reduz para zero, com ate 30 segundos adicionais para finalizar iteracoes. Usuarios virtuais nao equivalem a requisicoes por segundo. Cada visita faz quatro chamadas com pausas. Essa e uma carga inicial, nao uma estimativa da capacidade de producao.

Para escolher um termo presente no seu acervo, acrescente `-e SEARCH_TERM=Birigui` antes de `grafana/k6`. A busca vazia tambem e uma resposta valida. O script amostra detalhes das primeiras 20 obras e a primeira pagina; amplie o conjunto para representar sua base real nas proximas rodadas.

## Resultados e diagnostico

- `checks`: todas as validacoes devem passar.
- `http_req_failed`: menos de 1% de falhas.
- `http_req_duration` por endpoint: p95 menor que 500 ms (meta inicial ajustavel no script).
- `rate_limited`: deve ser zero; erros 429 continuam sendo falhas.
- Cada endpoint precisa receber pelo menos uma chamada.

O resumo aparece no terminal e o JSON fica em `tests/k6/results`. Cada execucao sobrescreve o arquivo correspondente; renomeie-o para comparar antes/depois. O codigo de saida e diferente de zero quando um threshold falha. Um smoke com poucas amostras serve para verificar funcionamento, nao para inferir percentis confiaveis.

Se houver `connection refused`, confira API, PORT e Docker Desktop. Se houver 429, confira K6_LOAD_TEST no processo da API e reinicie; sem o modo de carga, espere a janela de um minuto antes de repetir. Erros 401/403 exigem revisar o acesso das rotas, sem remover suas protecoes. Se `docker` nao for reconhecido, reabra o terminal/app depois da instalacao e confira `docker version`.

Para comparar desempenho, mantenha banco, hardware, versao da aplicacao e perfil iguais. Acompanhe CPU, memoria, conexoes e consultas do PostgreSQL durante a execucao. Rodar gerador e API no mesmo computador disputa recursos. Estes testes HTTP nao medem renderizacao 3D, downloads de midia nem comprovam conformidade LGPD.

Referencias: https://grafana.com/docs/k6/latest/get-started/running-k6/ e https://grafana.com/docs/k6/latest/using-k6/thresholds/
