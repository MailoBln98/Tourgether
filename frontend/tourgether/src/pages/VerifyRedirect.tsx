import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyRedirect: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('VerifyRedirect loaded with token:', token);
    if (token) {
      const decodedToken = decodeURIComponent(token);
      console.log('Redirecting to login with token:', decodedToken);
      navigate(`/login?token=${decodedToken}`);
    }
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Verifying your email...</p>
      </div>
    </div>
  );
};

export default VerifyRedirect;