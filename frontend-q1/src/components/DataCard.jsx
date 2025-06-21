import React from "react";

export default function DataCard({ data }) {
  if (!data) return null;

  if (data.error) {
    return <p style={{ color: "red" }}>{data.error}</p>;
  }

  return (
    <div style={{ background: "#eee", padding: 12 }}>
      <div>Prev: {JSON.stringify(data.windowPrevState)}</div>
      <div>Curr: {JSON.stringify(data.windowCurrState)}</div>
      <div>Fetched: {JSON.stringify(data.numbers)}</div>
      <div>Avg: {data.avg}</div>
    </div>
  );
}
