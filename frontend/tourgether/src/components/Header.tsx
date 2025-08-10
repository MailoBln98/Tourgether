import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Add this import for custom styles

const Header: React.FC = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#23272b" }}>
      <div className="container py-4 shadow-sm">
        <div className="d-flex flex-column">
          <Link
            className="navbar-brand fs-2 fw-bold d-flex align-items-center gap-2"
            to="/"
          >
            <i className="fas fa-motorcycle fs-2" aria-hidden="true"></i>
            Tourgether
          </Link>
          <span className="text-light fs-6 fst-italic ms-1" style={{ marginTop: "-0.5rem" }}>
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
            <li className="nav-item">
              <Link className="btn btn-light d-flex align-items-center gap-2 fs-5 py-2 px-4 header-btn-animate" to="/upload">
                <i className="fas fa-plus fs-4" aria-hidden="true"></i>
                Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-outline-light d-flex align-items-center gap-2 fs-5 py-2 px-4 header-btn-animate" to="/login">
                <i className="fas fa-user fs-4" aria-hidden="true"></i>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
