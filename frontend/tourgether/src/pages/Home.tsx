import React, { useState, useEffect } from 'react';
import type { Route } from '../types/Route';
import GPXThumbnail from '../components/GPXThumbnail';

function getCurrentUserId() {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.user_id || payload._id;
  } catch {
    return null;
  }
}

const Home: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      } else {
        setError('Failed to fetch routes');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const joinRoute = async (routeId: string) => {
    try {
      const token = sessionStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/routes/${routeId}/ride`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        fetchRoutes();
      } else {
        setError('Failed to join route');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const leaveRoute = async (routeId: string) => {
    try {
      const token = sessionStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/routes/${routeId}/ride`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok || response.status === 204) {
        fetchRoutes();
      } else {
        setError('Failed to leave route');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const formatDate = (dateString: string | { $date: string }) => {
    let dateValue: string;
    if (typeof dateString === 'object' && dateString.$date) {
      dateValue = dateString.$date;
    } else if (typeof dateString === 'string') {
      dateValue = dateString;
    } else {
      return 'No date provided';
    }
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  if (loading) return <div className="text-center mt-5"><h3>Loading routes...</h3></div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Motorcycle Routes</h1>
      {routes.length === 0 ? (
        <div className="alert alert-info">No routes available yet.</div>
      ) : (
        <div className="row">
          {routes.map((route) => {
            const isOwner = route.owner_uuid === currentUserId;
            const isRegistered = route.registered_users.includes(currentUserId);
            return (
              <div key={route._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <GPXThumbnail gpx={route.gpx} />
                    <h5 className="card-title">{route.name}</h5>
                    <div className="mb-2">
                      <strong>📍 Start Location:</strong>
                      <br />
                      <span>{route.start_point}</span>
                    </div>
                    <div className="mb-2">
                      <strong>🕒 Start Time:</strong>
                      <br />
                      <span>{formatDate(route.start_time)}</span>
                    </div>
                    <div className="mb-2">
                      <strong>👤 Creator:</strong>
                      <br />
                      <small className="text-muted">{route.owner_name}</small>
                    </div>
                    <div className="mb-2">
                      <strong>🏍️ Registered Riders:</strong>
                      <br />
                      <span className="badge bg-secondary">{route.registered_users.length} riders</span>
                    </div>
                  </div>
                  <div className="card-footer d-flex flex-column gap-2">
                    {isOwner ? (
                      <div className="text-center text-muted" style={{fontSize: '0.9rem', padding: '0.5rem 0'}}>You created this tour</div>
                    ) : (
                      <>
                        {!isRegistered && (
                          <button 
                            className="btn btn-primary w-100"
                            onClick={() => joinRoute(route._id)}
                          >
                            Join Route
                          </button>
                        )}
                        {isRegistered && (
                          <button
                            className="btn btn-warning w-100"
                            onClick={() => leaveRoute(route._id)}
                          >
                            Leave Route
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;