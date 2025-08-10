import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload: React.FC = () => {
  const [routeName, setRouteName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [startPoint, setStartPoint] = useState<string>('');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGpxFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!routeName || !gpxFile || !startTime || !startPoint) {
      setMessage('Please fill all fields and select a GPX file');
      setMessageType('error');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage('Please login first');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('gpx_file', gpxFile);
      formData.append('name', routeName);
      formData.append('start_time', new Date(startTime).toISOString());
      formData.append('start_point', startPoint);

      const response = await fetch('/api/upload_gpx', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Route uploaded successfully! Route ID: ${result.route_id}`);
        setMessageType('success');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setMessage('Failed to upload route');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Network error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Upload New Route</h2>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="routeName" className="form-label">Route Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="routeName"
                    placeholder="e.g. Berlin to Munich"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="startTime" className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="startPoint" className="form-label">Start Point</label>
                  <input
                    type="text"
                    className="form-control"
                    id="startPoint"
                    placeholder="e.g. Munich, Germany"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    required
                  />
                  <div className="form-text">
                    Enter a descriptive location name
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="gpxFile" className="form-label">GPX File</label>
                  <input
                    type="file"
                    className="form-control"
                    id="gpxFile"
                    accept=".gpx"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="form-text">
                    Please select a .gpx file containing your route data.
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover flex-fill"
                    style={{ backgroundColor: "#8b1f1f", color: "#fff", border: "none" }}
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded btn-ride-hover flex-fill"
                    style={{ backgroundColor: "#14532d", color: "#fff", border: "none" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload" aria-hidden="true"></i>
                        Upload Route
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
