import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((res) => res.json())
      .then((data) => setMessage(JSON.stringify(data)))
      .catch(() => setMessage("Failed to connect to backend"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>ReleasePilot</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
