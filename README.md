# CRIPTOID — Frontend (Interface Web)

Dashboard simples de criptomoedas (CRIPTOID). O usuário informa símbolos (ex.: `BTC-USD`) e clica em **Mostrar Preços** para:
1) consultar cotações via API secundária (que por sua vez consulta Yahoo Finance),
2) persistir/consultar histórico no Postgres via API principal,
3) gerenciar favoritos.

> Este repositório contém apenas o Frontend. A API principal e a API secundária estão em repositórios separados.

---

## Arquitetura (fluxograma)

```mermaid
flowchart LR
  U[Usuário / Browser] -->|HTTP| FE[Frontend (Nginx + SPA)\n:8080]

  FE -->|/api/* (proxy)| API[API Principal (FastAPI)\n:8000]
  API -->|HTTP| QS[API Secundária Quotes Service (Node)\n:9000]
  QS -->|HTTP| YF[API Externa: Yahoo Finance]

  API -->|SQL| PG[(PostgreSQL\n:5432)]
