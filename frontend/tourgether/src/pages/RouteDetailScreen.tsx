import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GPXThumbnail from '../components/GPXThumbnail';
import type { Route } from '../types/Route';

const RouteDetailScreen: React.FC = () => {
    const { routeId } = useParams();
    const [route, setRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});


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
                // Fallback: use user IDs as names
                const fallback: { [key: string]: string } = {};
                userIds.forEach(id => fallback[id] = id);
                setUserNames(fallback);
            }
        } catch {
            // Fallback: use user IDs as names
            const fallback: { [key: string]: string } = {};
            userIds.forEach(id => fallback[id] = id);
            setUserNames(fallback);
        }
    };

    const formatRiders = () => {
        if (!route || route.registered_users.length === 0) {
            return '0 riders';
        }

        const maxLength = 50; // Maximum characters for names
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

    if (loading) return <div className="text-center mt-5"><h3>Loading route...</h3></div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;
    if (!route) return null;

    return (
        <div className="container mt-4">
            <h2>{route.name}</h2>
            <div className="mb-4">
                <GPXThumbnail gpx={route.gpx} height={320} />
            </div>
            <div className="mb-2">
                <strong>📍 Start Location:</strong> {route.start_point}
            </div>
            <div className="mb-2">
                <strong>🕒 Start Time:</strong> {formatDate(route.start_time)}
            </div>
            <div className="mb-2">
                <strong>👤 Creator:</strong> {route.owner_name || route.owner_uuid}
            </div>
            <div className="mb-2">
                <strong>🏍️ Registered Riders:</strong> {formatRiders()}
            </div>

            <hr className="my-4" />

            <h4>Comments</h4>
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
    );
};

export default RouteDetailScreen;