import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Add this import for custom styles

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('token');
  
  const handleAuthClick = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem('token');
      navigate('/');
      window.location.reload();
    } else {
      navigate('/login');
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#23272b" }}>
        <div className="container py-4 shadow-sm">
          <div className="d-flex flex-column">
            <Link
              className="navbar-brand fs-2 fw-bold d-flex align-items-center"
              to="/"
              style={{ fontFamily: "'Oswald', 'Segoe UI', Arial, sans-serif", letterSpacing: "1px" }}
            >
              <i className="fas fa-motorcycle fs-2 header-moto-animate me-3" aria-hidden="true"></i>
              Tourgether
            </Link>
            <span
              className="text-light fs-6 fst-italic ms-1"
              style={{
                marginTop: "-0.5rem",
                fontFamily: "'Oswald', 'Segoe UI', Arial, sans-serif",
                letterSpacing: "0.5px"
              }}
            >
              Motorcycle Touring Social Network
            </span>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto gap-2">
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="btn btn-light d-flex align-items-center gap-2 fs-5 py-2 px-4 header-btn-animate" to="/upload">
                    <i className="fas fa-plus fs-4" aria-hidden="true"></i>
                    Upload
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light d-flex align-items-center gap-2 fs-5 py-2 px-4 header-btn-animate" 
                  onClick={handleAuthClick}
                >
                  <i className="fas fa-user fs-4" aria-hidden="true"></i>
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;