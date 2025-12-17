import React from "react";

export default function CryptoTable({ rows, favorites, onFav, onUnfav }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Preço</th>
            <th>Moeda</th>
            <th>Atualizado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isFav = favorites.includes(r.symbol);
            return (
              <tr key={r.symbol}>
                <td>
                  <span className="pill">{r.symbol}</span>
                </td>
                <td>{r.price ?? "-"}</td>
                <td className="muted">{r.currency ?? "-"}</td>
                <td className="muted">{r.fetched_at ? new Date(r.fetched_at).toLocaleString() : "-"}</td>
                <td>
                  {isFav ? (
                    <button onClick={() => onUnfav(r.symbol)}>Remover Favorito</button>
                  ) : (
                    <button onClick={() => onFav(r.symbol)}>Favoritar</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
