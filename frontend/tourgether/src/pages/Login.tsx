import React, { useState } from "react";

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // true: Login, false: Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Login fehlgeschlagen");
        }

        const data = await res.json();
        console.log("Login erfolgreich, JWT:", data.token);
        // TODO: JWT speichern, z.B. in Context oder localStorage

      } else {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Registrierung fehlgeschlagen");
        }

        console.log("Registrierung erfolgreich");
        // Optional: nach Registrierung direkt zum Login wechseln
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px" }}>
      <h2>{isLogin ? "Login" : "Registrieren"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "1rem", padding: "0.5rem" }}
            required={!isLogin}
          />
        )}

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
          required
          minLength={6}
        />

        <button type="submit" disabled={loading} style={{ padding: "0.5rem" }}>
          {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Anmelden" : "Registrieren")}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "Noch keinen Account?" : "Schon registriert?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          style={{ color: "blue", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {isLogin ? "Registrieren" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default LoginRegister;
