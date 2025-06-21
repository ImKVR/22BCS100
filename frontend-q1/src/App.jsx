import React, { useState, useRef } from "react";
import axios from "axios";
import DataCard from "./components/DataCard"; // assumes this is your display component

const baseURL = "http://20.244.56.144/evaluation-service";

// Token provided in the test — valid till the end of today
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyZXRoaWsuMjJjc0BrY3QuYWMuaW4iLCJleHAiOjE3NTA0ODQxNDUsImlhdCI6MTc1MDQ4Mzg0NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjQ4OTZiYWJhLWY0NWQtNDU0OC04Y2RkLTUzNDBhY2EwMDU1NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJldGhpayIsInN1YiI6ImQ1ZWMwNjBjLWJiOGMtNGNlNi05YzI1LTQzOWQ4NDZmMjYyOCJ9LCJlbWFpbCI6InJldGhpay4yMmNzQGtjdC5hYy5pbiIsIm5hbWUiOiJyZXRoaWsiLCJyb2xsTm8iOiIyMmJjczEwMCIsImFjY2Vzc0NvZGUiOiJXY1RTS3YiLCJjbGllbnRJRCI6ImQ1ZWMwNjBjLWJiOGMtNGNlNi05YzI1LTQzOWQ4NDZmMjYyOCIsImNsaWVudFNlY3JldCI6IlpVUWdHdGp1eFVnYWZXcEUifQ.7wQJjq1T9KsDhqXIbcEDhMZFH6jrpKxigBtVsK5eSsk"


const endpoints = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const windowRef = useRef([]); // holds the window data (sliding list)

  const getData = async (id) => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/${endpoints[id]}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const numbers = res.data.numbers || [];
      const prev = [...windowRef.current];

      // Add new numbers (ignoring duplicates)
      numbers.forEach((n) => {
        if (!windowRef.current.includes(n)) {
          windowRef.current.push(n);
        }
      });

      // Trim to window size 10
      if (windowRef.current.length > 10) {
        windowRef.current = windowRef.current.slice(-10);
      }

      const average = windowRef.current.length
        ? windowRef.current.reduce((a, b) => a + b, 0) / windowRef.current.length
        : 0;

      setData({
        windowPrevState: prev,
        windowCurrState: [...windowRef.current],
        numbers,
        avg: Number(average.toFixed(2))
      });

    } catch (error) {
      setData({ error: "Could not fetch data from server." });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Average Calculator</h2>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => getData("p")}>Prime</button>
        <button onClick={() => getData("f")}>Fibonacci</button>
        <button onClick={() => getData("e")}>Even</button>
        <button onClick={() => getData("r")}>Random</button>
      </div>

      {loading && <p>Fetching numbers...</p>}
      {!loading && data && <DataCard data={data} />}
    </div>
  );
}

export default App;
