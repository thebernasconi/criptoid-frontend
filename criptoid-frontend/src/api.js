const API_BASE = "/api/v1";

export async function getFavorites() {
  const r = await fetch(`${API_BASE}/favorites`, { method: "GET" });
  if (!r.ok) throw new Error("Falha ao buscar favoritos");
  return r.json();
}

export async function putFavorite(symbol) {
  const r = await fetch(`${API_BASE}/favorites/${encodeURIComponent(symbol)}`, {
    method: "PUT",
  });
  if (!r.ok) throw new Error("Falha ao favoritar");
  return r.json();
}

export async function deleteFavorite(symbol) {
  const r = await fetch(`${API_BASE}/favorites/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Falha ao remover favorito");
  return r.json();
}

export async function refreshPrices(symbols) {
  const r = await fetch(`${API_BASE}/prices/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbols }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Falha ao atualizar preços: ${txt}`);
  }
  return r.json();
}

export async function getLatestPrices(symbols) {
  const qs = symbols?.length ? `?symbols=${encodeURIComponent(symbols.join(","))}` : "";
  const r = await fetch(`${API_BASE}/prices/latest${qs}`, { method: "GET" });
  if (!r.ok) throw new Error("Falha ao buscar preços");
  return r.json();
}
