// In pages/VerifyRedirect.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyRedirect: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(`/auth?token=${token}`);
    }
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <p>Redirecting for verification...</p>
      </div>
    </div>
  );
};

export default VerifyRedirect;