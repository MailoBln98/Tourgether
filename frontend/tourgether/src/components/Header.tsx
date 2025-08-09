import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <header style={{ padding: "1rem", backgroundColor: "#333", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, cursor: "pointer" }} onClick={handleHomeClick}>
            Tourgether
          </h1>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Motorcycle Touring Social Network</p>
        </div>
        
        <nav>
          <button 
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button 
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
            onClick={handleUploadClick}
          >
            Upload Route
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;