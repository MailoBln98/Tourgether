import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | null>(null);

  useEffect(() => {
    const loginMessage = sessionStorage.getItem('loginMessage');
    if (loginMessage) {
      setMessage(loginMessage);
      sessionStorage.removeItem('loginMessage');
    }

    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setMessage('Email successfully verified! You can now log in.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify/${token}`, {
        method: 'POST',
      });

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('Email successfully verified! You can now log in.');
        setIsLogin(true);
      } else {
        const errorData = await response.json();
        setVerificationStatus('error');
        setMessage(errorData.message || 'Email verification failed.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error during email verification.');
    }
  };

  const getVerificationMessage = () => {
    if (verificationStatus === 'success') {
      return 'Email successfully verified! You can now log in.';
    }
    if (verificationStatus === 'error') {
      return 'Email verification failed. Please check if the link is valid or expired.';
    }
    if (verificationStatus === 'pending') {
      return 'Please check your email and click the verification link to activate your account.';
    }
    return message;
  };

  const toggleForm = () => {
    setMessage(null);
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setVerificationStatus(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setMessage("Successfully logged out.");
    navigate("/");
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
            if (response.status === 403 && (errorData.message.includes('not verified') || errorData.message.includes('Email not verified'))) {
              setMessage("Your email is not verified yet. Please check your email and click the verification link.");
              setVerificationStatus('pending');
            } else {
              setMessage(errorData.message || errorData.error || "Login fehlgeschlagen.");
            }
          } catch (jsonError) {
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
          setMessage("Registration successful! Please check your email to verify your account before logging in.");
          setVerificationStatus('pending');
          setName("");
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
              <h2 className="mb-3">You are logged in</h2>
              {(message || verificationStatus) && (
                <div
                  className={`alert mb-3 ${verificationStatus === 'success' || message?.includes("erfolgreich") || message?.includes("successful") ? "alert-success" :
                    verificationStatus === 'pending' || message?.includes("Log in") || message?.includes("need to be") || message?.includes("check your email") ? "alert-info" :
                      "alert-danger"
                    }`}
                  role="alert"
                >
                  {getVerificationMessage()}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-danger w-100"
              >
                Log out
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
            <h2 className="mb-3">{isLogin ? "Login" : "Register"}</h2>

            {(message || verificationStatus) && (
              <div
                className={`alert mb-3 ${verificationStatus === 'success' || message?.includes("erfolgreich") || message?.includes("successful") ? "alert-success" :
                  verificationStatus === 'pending' || message?.includes("Log in") || message?.includes("need to be") || message?.includes("check your email") ? "alert-info" :
                    "alert-danger"
                  }`}
                role="alert"
              >
                {getVerificationMessage()}
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
                  placeholder="Password"
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
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                    ? "Log in"
                    : "Register"}
              </button>
            </form>

            <button
              onClick={toggleForm}
              className="btn btn-link mt-3 w-100"
              type="button"
            >
              {isLogin ? "Create a new account" : "Go to login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;