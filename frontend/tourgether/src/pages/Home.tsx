import React, { useState, useEffect } from 'react';
import type { Route } from '../types/Route';
import { useNavigate } from 'react-router-dom';
import GPXThumbnail from '../components/GPXThumbnail';

// Add this for custom hover styles
import './Home.css';

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
  const [buttonAnimating, setButtonAnimating] = useState<{ [routeId: string]: boolean }>({});
  const [buttonState, setButtonState] = useState<{ [routeId: string]: 'join' | 'leave' }>({});
  const currentUserId = getCurrentUserId();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
        // Set initial button state for each route
        const state: { [routeId: string]: 'join' | 'leave' } = {};
        data.forEach((route: Route) => {
          state[route._id] = route.registered_users.includes(currentUserId) ? 'leave' : 'join';
        });
        setButtonState(state);
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
    setButtonAnimating((prev) => ({ ...prev, [routeId]: true }));
    try {
      const token = sessionStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/routes/${routeId}/ride`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        setTimeout(() => {
          setButtonState((prev) => ({ ...prev, [routeId]: 'leave' }));
          fetchRoutes();
          setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
        }, 350);
      } else {
        setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
        setError('Failed to join route');
      }
    } catch (err) {
      setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
      setError('Network error occurred');
    }
  };

  const leaveRoute = async (routeId: string) => {
    setButtonAnimating((prev) => ({ ...prev, [routeId]: true }));
    try {
      const token = sessionStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/routes/${routeId}/ride`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok || response.status === 204) {
        setTimeout(() => {
          setButtonState((prev) => ({ ...prev, [routeId]: 'join' }));
          fetchRoutes();
          setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
        }, 350);
      } else {
        setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
        setError('Failed to leave route');
      }
    } catch (err) {
      setButtonAnimating((prev) => ({ ...prev, [routeId]: false }));
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
      <h1 className="mb-4 home-heading">FIND YOUR RIDE</h1>
      {routes.length === 0 ? (
        <div className="alert alert-info">No routes available yet.</div>
      ) : (
        <div className="row">
          {routes.map((route) => {
            const isOwner = route.owner_uuid === currentUserId;
            const isRegistered = route.registered_users.includes(currentUserId);
            const animating = buttonAnimating[route._id];
            return (
              <div key={route._id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 shadow-sm route-card-hover"
                  style={{ border: "2px solid #dee2e6" }}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/route/${route._id}`)}
                  onKeyPress={e => { if (e.key === 'Enter') navigate(`/route/${route._id}`); }}
                >
                  <div className="card-body">
                    <GPXThumbnail gpx={route.gpx} height={120} zoomable={false} />
                    <h5 className="card-title route-detail-heading" style={{ fontFamily: "'Oswald', 'Segoe UI', Arial, sans-serif" }}>
                      {route.name}
                    </h5>
                    <hr className="my-3" />
                    <div className="mb-2">
                      <strong className="oswald-info">📍 Start Location:</strong>
                      <br />
                      <span>{route.start_point}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="oswald-info">🕒 Start Time:</strong>
                      <br />
                      <span>{formatDate(route.start_time)}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="oswald-info">👤 Creator:</strong>
                      <br />
                      <small className="text-muted">{route.owner_name}</small>
                    </div>
                    <div className="mb-2">
                      <strong className="oswald-info">🏍️ Registered Riders:</strong>
                      <br />
                      <span className="badge bg-secondary">{route.registered_users.length} riders</span>
                    </div>
                  </div>
                  <div className="card-footer d-flex flex-column gap-2" onClick={e => e.stopPropagation()}>
                    {isOwner ? (
                      <div className="text-center text-muted small py-2">You created this tour</div>
                    ) : (
                      <div className="ride-btn-transition-wrapper">
                        <div className={`ride-btn-transition-inner ${animating ? 'animating' : ''}`}>
                          {!animating && buttonState[route._id] === 'join' && (
                            <button
                              className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover"
                              style={{ backgroundColor: "#14532d", color: "#fff", border: "none" }}
                              onClick={(e) => { e.stopPropagation(); joinRoute(route._id); }}
                              disabled={animating}
                            >
                              <i className="fas fa-hand-paper" aria-hidden="true"></i>
                              Join Ride
                            </button>
                          )}
                          {!animating && buttonState[route._id] === 'leave' && (
                            <button
                              className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover"
                              style={{ backgroundColor: "#8b1f1f", color: "#fff", border: "none" }}
                              onClick={(e) => { e.stopPropagation(); leaveRoute(route._id); }}
                              disabled={animating}
                            >
                              <i className="fas fa-minus" aria-hidden="true"></i>
                              Leave Ride
                            </button>
                          )}
                        </div>
                      </div>
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