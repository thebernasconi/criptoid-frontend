# CRIPTOID — Frontend (Interface Web)

O **CRIPTOID** é uma aplicação web simples de criptomoedas. Ao clicar em **Mostrar Preços**, a interface:
1) chama a **API Principal** para buscar cotações,
2) a API Principal chama a **API Secundária (Quotes Service)**,
3) o Quotes Service consulta a **API Externa (Yahoo Finance)**,
4) a API Principal **persiste os dados no Postgres** e retorna os preços para a interface.

> Este repositório contém **apenas o Frontend** (SPA servida por Nginx). A API Principal e a API Secundária ficam em repositórios separados.

---

## Repositórios do projeto

Frontend (este): https://github.com/thebernasconi/criptoid-frontend

API Principal: https://github.com/thebernasconi/criptoid-api

API Secundária (Quotes Service): https://github.com/thebernasconi/criptoid-quotes-service

## Rotas (GET/POST/PUT/DELETE) chamadas pela Interface

A interface chama a API Principal via /api/... (proxy do Nginx):

POST /api/v1/prices/refresh
Busca cotações (via API secundária + Yahoo Finance) e persiste no Postgres.

GET /api/v1/prices/latest?symbols=BTC-USD,ETH-USD
Retorna as últimas cotações persistidas.

GET /api/v1/favorites
Lista favoritos.

PUT /api/v1/favorites/{symbol}
Adiciona favorito (ex.: BTC-USD).

DELETE /api/v1/favorites/{symbol}
Remove favorito (desfavoritar).

## Pré-requisitos

Docker Desktop instalado e funcionando

Git (para clonar os repositórios)

Portas livres no host:

8080 (frontend)

8000 (API principal)

9000 (API secundária)

5432 (Postgres)

Importante: as instruções abaixo rodam SEM docker compose (containers via docker run).

## Como rodar o projeto completo (passo a passo, para iniciantes)
## 0) Estrutura recomendada no seu computador

Crie uma pasta para o projeto e clone os 3 repositórios dentro dela:

CRIPTOID/
  criptoid-frontend/
  criptoid-api/
  criptoid-quotes-service/

## 1) Criar a network e o volume (apenas 1 vez)

Abra PowerShell e execute:

docker network create criptoid-net
docker volume create criptoid_pgdata

## 2) Subir o Postgres
docker run -d --name criptoid-db --network criptoid-net `
  --restart unless-stopped `
  -e POSTGRES_DB=criptoid `
  -e POSTGRES_USER=criptoid `
  -e POSTGRES_PASSWORD=criptoid `
  -v criptoid_pgdata:/var/lib/postgresql/data `
  -p 5432:5432 `
  postgres:16-alpine

Checar se está rodando:

docker ps

## 3) Build + Run da API Secundária (Quotes Service)

Entre na pasta do quotes service:

cd .\criptoid-quotes-service

Build:

docker build -t criptoid-quotes-service .


Run:

docker run -d --name criptoid-quotes --network criptoid-net `
  --restart unless-stopped `
  -p 9000:9000 `
  criptoid-quotes-service


Teste de saúde:

curl http://localhost:9000/health

## 4) Build + Run da API Principal

Entre na pasta da API principal:

cd ..\criptoid-api


Build:

docker build -t criptoid-api .


Run:

docker run -d --name criptoid-api --network criptoid-net `
  --restart unless-stopped `
  -e DATABASE_URL="postgresql+psycopg2://criptoid:criptoid@criptoid-db:5432/criptoid" `
  -e QUOTES_SERVICE_URL="http://criptoid-quotes:9000" `
  -p 8000:8000 `
  criptoid-api


Teste de saúde:

curl http://localhost:8000/health


Swagger (documentação da API principal):

http://localhost:8000/docs

## 5) Build + Run do Frontend (este repositório)

Entre na pasta do frontend:

cd ..\criptoid-frontend


Build:

docker build -t criptoid-frontend .


Run:

docker run -d --name criptoid-frontend --network criptoid-net `
  --restart unless-stopped `
  -p 8080:80 `
  criptoid-frontend


Abra no navegador:

http://localhost:8080

Como usar (teste rápido)

Abra http://localhost:8080

No campo de símbolos, use por exemplo:

BTC-USD,ETH-USD,SOL-USD,XRP-USD,ADA-USD

Clique Mostrar Preços

Clique Favoritar / Desfavoritar para validar PUT/DELETE

Recarregue a página (F5) para conferir persistência
