import { useState } from "react";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [ip, setIp] = useState("");
  const [ips, setIps] = useState([]);
  const [status, setStatus] = useState(null);
  const [shake, setShake] = useState(false);

  const correctPassword = "mysecret"; // 👉 change this to your password

  // Normalize IPs/domains
  const normalizeIP = (input) => {
    try {
      input = input.replace(/^(https?:\/\/)?(www\.)?/, "").trim();
      input = input.split(/[\/:]/)[0];

      if (input.startsWith("::ffff:")) {
        return input.replace("::ffff:", "");
      }

      if (input.endsWith(".in-addr.arpa")) {
        const parts = input.replace(".in-addr.arpa", "").split(".");
        return parts.reverse().join(".");
      }

      return input;
    } catch (e) {
      return input;
    }
  };

  // Add IP
  const handleAdd = () => {
    const normalized = normalizeIP(ip);
    if (!normalized) return;

    if (ips.includes(normalized)) {
      setStatus("duplicate");
      setShake(true);
      setTimeout(() => setShake(false), 500); // reset shake after 0.5s
    } else {
      setIps([normalized, ...ips].slice(0, 50));
      setStatus("unique");
      setIp(""); // clear input if unique
    }
  };

  // 🔒 Password screen
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="p-2 rounded text-black mb-2"
        />
        <button
          onClick={() => {
            if (password === correctPassword) setLoggedIn(true);
            else alert("❌ Wrong password!");
          }}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  // ✅ Main app after login
  return (
    <div className="app-container">
      <h1>Insert the link here</h1>

      <div className="input-area">
        <input
          type="text"
          value={ip}
          onChange={(e) => {
            setIp(e.target.value);
            setStatus(null);
          }}
          placeholder="Paste your link here"
          className={`ip-input ${
            status === "unique"
              ? "border-green"
              : status === "duplicate"
              ? "border-red"
              : ""
          } ${shake ? "animate-shake" : ""}`}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {status === "unique" && (
        <p className="status success">✅ Go ahead</p>
      )}
      {status === "duplicate" && (
        <p className="status error">
          ❌ Not working, close it. Use new one
        </p>
      )}

      <h2>Last 50 Successful Links:</h2>
      <ul className="ip-list">
        {ips.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
