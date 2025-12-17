# CRIPTOID — Frontend

Interface web do CRIPTOID (React + Vite buildado e servido via Nginx).

## Arquitetura (fluxograma)

```mermaid
flowchart LR
  U[Usuário] --> FE[Frontend]
  FE --> API[API Principal]
  API --> QS[Quotes Service]
  QS --> YF[Yahoo Finance]
  API --> PG[(Postgres)]
