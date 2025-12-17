import React, { useEffect, useMemo, useState } from "react";
import CryptoTable from "./components/CryptoTable.jsx";
import { deleteFavorite, getFavorites, getLatestPrices, putFavorite, refreshPrices } from "./api.js";

const DEFAULT_SYMBOLS = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "ADA-USD"];

export default function App() {
  const [symbolsText, setSymbolsText] = useState(DEFAULT_SYMBOLS.join(","));
  const symbols = useMemo(
    () =>
      symbolsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [symbolsText]
  );

  const [favorites, setFavorites] = useState([]);
  const [rows, setRows] = useState(DEFAULT_SYMBOLS.map((s) => ({ symbol: s })));
  const [status, setStatus] = useState("Pronto.");
  const [loading, setLoading] = useState(false);

  async function loadFavorites() {
    const data = await getFavorites(); // GET
    setFavorites(data.favorites);
  }

  async function loadLatest() {
    const data = await getLatestPrices(symbols); // GET
    setRows(data.prices.length ? data.prices : symbols.map((s) => ({ symbol: s })));
  }

  useEffect(() => {
    (async () => {
      try {
        setStatus("Carregando favoritos e últimos preços...");
        await loadFavorites();
        await loadLatest();
        setStatus("Pronto.");
      } catch (e) {
        setStatus(e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onRefresh() {
    try {
      setLoading(true);
      setStatus("Atualizando preços via Yahoo Finance...");
      const data = await refreshPrices(symbols); // POST (botão "Mostrar Preços")
      setRows(data.prices);
      setStatus("Atualizado!");
    } catch (e) {
      setStatus(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onFav(symbol) {
    try {
      setStatus(`Favoritando ${symbol}...`);
      await putFavorite(symbol); // PUT
      await loadFavorites();
      setStatus("Pronto.");
    } catch (e) {
      setStatus(e.message);
    }
  }

  async function onUnfav(symbol) {
    try {
      setStatus(`Removendo favorito ${symbol}...`);
      await deleteFavorite(symbol); // DELETE
      await loadFavorites();
      setStatus("Pronto.");
    } catch (e) {
      setStatus(e.message);
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginTop: 0 }}>CRIPTOID</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Dashboard simples de criptomoedas. Clique em <b>Mostrar Preços</b> para buscar cotações (API externa) e persistir no Postgres.
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="row">
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Símbolos (separados por vírgula)</div>
            <input
              value={symbolsText}
              onChange={(e) => setSymbolsText(e.target.value)}
              style={{ width: "100%" }}
              placeholder="BTC-USD,ETH-USD,SOL-USD"
            />
          </div>
          <button onClick={onRefresh} disabled={loading}>
            {loading ? "Buscando..." : "Mostrar Preços"}
          </button>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
            Swagger (API Principal)
          </a>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>{status}</div>
      </div>

      <CryptoTable rows={rows} favorites={favorites} onFav={onFav} onUnfav={onUnfav} />

      <p className="muted" style={{ marginTop: 14, fontSize: 12 }}>
        Requisito: a interface chama 4 rotas com métodos HTTP diferentes (GET/POST/PUT/DELETE).
      </p>
    </div>
  );
}
