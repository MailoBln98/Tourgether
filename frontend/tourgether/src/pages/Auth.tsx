import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem("token"));

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loginMessage = sessionStorage.getItem('loginMessage');
    if (loginMessage) {
      setMessage(loginMessage);
      sessionStorage.removeItem('loginMessage');
    }
  }, []);

  const toggleForm = () => {
    setMessage(null);
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setMessage("Erfolgreich ausgeloggt.");
    navigate("/login");
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
            setIsLoggedIn(true);
            setMessage("Login erfolgreich!");
            navigate("/");
          } else {
            setMessage("Token vom Server nicht erhalten.");
          }
        } else {
          try {
            const errorData = await response.json();
            setMessage(errorData.message || errorData.error || "Login fehlgeschlagen.");
          } catch (jsonError) {
            const errorText = await response.text();
            if (response.status === 401) {
              setMessage("Ungültige Anmeldedaten.");
            } else if (response.status === 400) {
              setMessage("Bitte überprüfen Sie Ihre Eingaben.");
            } else {
              setMessage("Login fehlgeschlagen.");
            }
          }
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
        } else {
          try {
            const errorData = await response.json();
            setMessage(errorData.message || errorData.error || "Registrierung fehlgeschlagen.");
          } catch (jsonError) {
            if (response.status === 409) {
              setMessage("E-Mail-Adresse bereits registriert.");
            } else if (response.status === 400) {
              setMessage("Bitte überprüfen Sie Ihre Eingaben.");
            } else {
              setMessage("Registrierung fehlgeschlagen.");
            }
          }
        }
      }
    } catch (error) {
      setMessage("Netzwerkfehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card p-4">
              <h2 className="mb-3">Du bist bereits eingeloggt</h2>
              {message && (
                <div
                  className={`alert mb-3 ${message.includes("erfolgreich") ? "alert-success" :
                      message.includes("Log in") || message.includes("need to be") ? "alert-info" :
                        "alert-danger"
                    }`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-danger w-100"
              >
                Ausloggen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4">
            <h2 className="mb-3">{isLogin ? "Login" : "Registrieren"}</h2>

            {message && (
              <div
                className={`alert mb-3 ${message.includes("erfolgreich") ? "alert-success" :
                    message.includes("Log in") || message.includes("need to be") ? "alert-info" :
                      "alert-danger"
                  }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading
                  ? isLogin
                    ? "Anmelden..."
                    : "Registrieren..."
                  : isLogin
                    ? "Anmelden"
                    : "Registrieren"}
              </button>
            </form>

            <button
              onClick={toggleForm}
              className="btn btn-link mt-3 w-100"
              type="button"
            >
              {isLogin ? "Neuen Account erstellen" : "Zur Anmeldung"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;