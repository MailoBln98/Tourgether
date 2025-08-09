import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <header>
      <div>
        <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <h1>Tourgether</h1>
          <p>Motorcycle Touring Social Network</p>
        </div>

        <nav>
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={handleUploadClick}>Upload Route</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
