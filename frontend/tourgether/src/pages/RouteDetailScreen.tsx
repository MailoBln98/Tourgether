import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GPXThumbnail from '../components/GPXThumbnail';
import type { Route } from '../types/Route';
import './Home.css';

const RouteDetailScreen: React.FC = () => {
    const { routeId } = useParams();
    const [route, setRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [isRegistered, setIsRegistered] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [buttonAnimating, setButtonAnimating] = useState(false);
    const [buttonState, setButtonState] = useState<'join' | 'leave'>('join');
    const navigate = useNavigate();

    // Helper to get current user ID
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
    const currentUserId = getCurrentUserId();

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const response = await fetch(`/api/routes`);
                if (response.ok) {
                    const data: Route[] = await response.json();
                    const found = data.find(r => r._id === routeId);
                    if (found) {
                        setRoute(found);
                        fetchUserNames(found.registered_users);
                        setIsOwner(found.owner_uuid === currentUserId);
                        setIsRegistered(found.registered_users.includes(currentUserId));
                        setButtonState(found.registered_users.includes(currentUserId) ? 'leave' : 'join');
                    } else {
                        setError('Route not found');
                    }
                } else {
                    setError('Failed to fetch route');
                }
            } catch {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };
        fetchRoute();
        // eslint-disable-next-line
    }, [routeId]);

    const fetchUserNames = async (userIds: string[]) => {
        if (userIds.length === 0) return;

        try {
            const response = await fetch('/api/users/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_ids: userIds })
            });

            if (response.ok) {
                const userDict = await response.json();
                setUserNames(userDict);
            } else {
                const fallback: { [key: string]: string } = {};
                userIds.forEach(id => fallback[id] = id);
                setUserNames(fallback);
            }
        } catch {
            const fallback: { [key: string]: string } = {};
            userIds.forEach(id => fallback[id] = id);
            setUserNames(fallback);
        }
    };

    const formatRiders = () => {
        if (!route || route.registered_users.length === 0) {
            return '0 riders';
        }

        const maxLength = 50;
        const names = route.registered_users.map(userId => userNames[userId] || userId);
        const totalCount = names.length;

        let displayText = '';
        let characterCount = 0;
        let displayedNames = 0;

        for (const name of names) {
            const nameToAdd = displayedNames === 0 ? name : `, ${name}`;
            if (characterCount + nameToAdd.length > maxLength) {
                break;
            }
            displayText += nameToAdd;
            characterCount += nameToAdd.length;
            displayedNames++;
        }

        if (displayedNames < totalCount) {
            displayText += `, and ${totalCount - displayedNames} more`;
        }

        return `${displayText} (${totalCount})`;
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
        } catch {
            return 'Invalid Date';
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        setComments([...comments, newComment.trim()]);
        setNewComment('');
    };

    const joinRoute = async (routeId: string) => {
      setButtonAnimating(true);
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
            setIsRegistered(true);
            setButtonState('leave');
            setButtonAnimating(false);
          }, 350);
        } else {
          setButtonAnimating(false);
          setError('Failed to join route');
        }
      } catch (err) {
        setButtonAnimating(false);
        setError('Network error occurred');
      }
    };

    const leaveRoute = async (routeId: string) => {
      setButtonAnimating(true);
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
            setIsRegistered(false);
            setButtonState('join');
            setButtonAnimating(false);
          }, 350);
        } else {
          setButtonAnimating(false);
          setError('Failed to leave route');
        }
      } catch (err) {
        setButtonAnimating(false);
        setError('Network error occurred');
      }
    };

    if (loading)
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
          <div className="spinner-border text-primary me-2" role="status" />
          <span>Loading route...</span>
        </div>
      );
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;
    if (!route) return null;

    return (
      <div className="container mt-4 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title mb-3 route-detail-heading">{route.name}</h2>
                <div className="mb-4 text-center">
                  <GPXThumbnail gpx={route.gpx} height={320} zoomable />
                </div>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item">
                    <strong className="oswald-info">📍 Start Location:</strong> {route.start_point}
                  </li>
                  <li className="list-group-item">
                    <strong className="oswald-info">🕒 Start Time:</strong> {formatDate(route.start_time)}
                  </li>
                  <li className="list-group-item">
                    <strong className="oswald-info">👤 Creator:</strong> {route.owner_name || route.owner_uuid}
                  </li>
                  <li className="list-group-item">
                    <strong className="oswald-info">🏍️ Registered Riders:</strong> {formatRiders()}
                  </li>
                </ul>
                {/* Join/Leave Buttons with animation */}
                <div className="d-flex flex-column gap-2 mb-4 ride-btn-transition-wrapper">
                  {isOwner ? (
                    <div className="text-center text-muted small py-2">You created this tour</div>
                  ) : (
                    <div className={`ride-btn-transition-inner${buttonAnimating ? ' animating' : ''}`}>
                      {!buttonAnimating && buttonState === 'join' && (
                        <button
                          className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover"
                          style={{ backgroundColor: "#14532d", color: "#fff", border: "none" }}
                          onClick={() => joinRoute(route._id)}
                          disabled={buttonAnimating}
                        >
                          <i className="fas fa-hand-paper" aria-hidden="true"></i>
                          Join Ride
                        </button>
                      )}
                      {!buttonAnimating && buttonState === 'leave' && (
                        <button
                          className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover"
                          style={{ backgroundColor: "#8b1f1f", color: "#fff", border: "none" }}
                          onClick={() => leaveRoute(route._id)}
                          disabled={buttonAnimating}
                        >
                          <i className="fas fa-minus" aria-hidden="true"></i>
                          Leave Ride
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <hr className="my-4" />
                <h4 className="mb-3">Comments</h4>
                <form onSubmit={handleCommentSubmit} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">Post</button>
                  </div>
                </form>
                <ul className="list-group">
                  {comments.length === 0 && (
                    <li className="list-group-item text-muted">No comments yet.</li>
                  )}
                  {comments.map((comment, idx) => (
                    <li key={idx} className="list-group-item">{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default RouteDetailScreen;