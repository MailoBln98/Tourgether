import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // <--- hier

  const toggleForm = () => {
    setMessage(null);
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.access_token;
          if (token) {
            sessionStorage.setItem("token", token);
            setMessage("Login erfolgreich!");
            navigate("/"); 
          } else {
            setMessage("Token vom Server nicht erhalten.");
          }
        } else if (response.status === 401) {
          setMessage("Ungültige Anmeldedaten.");
        } else {
          setMessage("Login fehlgeschlagen.");
        }
      } else {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.status === 201) {
          setMessage("Registrierung erfolgreich! Bitte jetzt einloggen.");
          setIsLogin(true);
          setName("");
          setEmail("");
          setPassword("");
        } else if (response.status === 409) {
          setMessage("Email bereits registriert.");
        } else {
          setMessage("Registrierung fehlgeschlagen.");
        }
      }
    } catch (error) {
      setMessage("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isLogin ? "Login" : "Registrieren"}</h2>

      {message && (
        <div
          style={{
            marginBottom: "1rem",
            color: message.includes("erfolgreich") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "1rem", padding: "0.5rem" }}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
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
        />

        <button type="submit" style={{ padding: "0.5rem" }} disabled={loading}>
          {loading ? (isLogin ? "Anmelden..." : "Registrieren...") : isLogin ? "Anmelden" : "Registrieren"}
        </button>
      </form>

      <button
        onClick={toggleForm}
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          background: "none",
          border: "none",
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {isLogin ? "Neuen Account erstellen" : "Zur Anmeldung"}
      </button>
    </div>
  );
};

export default Auth;
