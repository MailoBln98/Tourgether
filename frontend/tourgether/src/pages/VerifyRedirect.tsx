import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000";

const VerifyRedirect: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      console.log('VerifyRedirect loaded with token:', token);
      
      try {
        const decodedToken = decodeURIComponent(token);
        console.log('Decoded token:', decodedToken);
        
        const url = `${API_URL}/api/auth/verify/${decodedToken}`;
        console.log('Making verification request to:', url);
        
        const response = await fetch(url, {
          method: 'POST',
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Success data:', data);
          setStatus('success');
          setMessage('Email successfully verified! Redirecting to login...');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 2000);
          
        } else {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          setStatus('error');
          setMessage(errorData.message || 'Email verification failed');
        }
      } catch (error) {
        console.log('Network error:', error);
        setStatus('error');
        setMessage('Network error during verification');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 text-center">
            <h2 className="mb-3">Email Verification</h2>
            
            {status === 'loading' && (
              <>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Verifying your email...</p>
              </>
            )}
            
            {status === 'success' && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle fa-2x mb-2"></i>
                <p className="mb-0">{message}</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="alert alert-danger">
                <i className="fas fa-times-circle fa-2x mb-2"></i>
                <p className="mb-2">{message}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRedirect;