import React, { useState, useEffect } from 'react';

interface Route {
  _id: string;
  gpx: string;
  owner_uuid: string;
  registered_users: string[];
}

const Home: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/routes/${routeId}/ride`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        fetchRoutes(); // Refresh routes
      } else {
        console.error('Failed to join route:', await response.text());
      }
    } catch (err) {
      console.error('Failed to join route:', err);
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
          {routes.map((route) => (
            <div key={route._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Route #{route._id.slice(-6)}</h5>
                  <p className="card-text">
                    <small className="text-muted">
                      Owner: {route.owner_uuid}
                    </small>
                  </p>
                  <p className="card-text">
                    <i className="fas fa-users"></i> {route.registered_users.length} riders registered
                  </p>
                </div>
                <div className="card-footer">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => joinRoute(route._id)}
                  >
                    Join Route
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;