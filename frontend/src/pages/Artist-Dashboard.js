import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/artist_dashboard.css';

function ArtistDashboard() {
  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
    price: "",
    publishingstatus: "published",
  });
  const [artworks, setArtworks] = useState([]);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    publishedArtworks: 0,
    totalRevenue: 0,
    avgPrice: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyArtworks();
  }, []);

  const fetchMyArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/my-artworks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtworks(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const calculateStats = (artworks) => {
    const totalArtworks = artworks.length;
    const publishedArtworks = artworks.filter(art => art.publishingstatus === 'published').length;
    const totalRevenue = artworks.reduce((sum, art) => sum + (art.price || 0), 0);
    const avgPrice = totalArtworks > 0 ? totalRevenue / totalArtworks : 0;

    setStats({
      totalArtworks,
      publishedArtworks,
      totalRevenue,
      avgPrice
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("publishingstatus", form.publishingstatus);
    if (form.image) formData.append("artwork", form.image);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/artworks/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMsg("✨ Artwork updated successfully!");
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/artworks/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMsg("🎨 Artwork uploaded successfully!");
      }

      setForm({
        title: "",
        image: null,
        description: "",
        price: "",
        publishingstatus: "published",
      });
      setShowUploadForm(false);
      fetchMyArtworks();
    } catch (err) {
      setMsg("❌ Upload failed: " + (err.response?.data?.msg || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("🗑️ Artwork deleted successfully!");
      fetchMyArtworks();
    } catch (err) {
      setMsg("❌ Delete failed: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleEdit = (artwork) => {
    setForm({
      title: artwork.title,
      image: null,
      description: artwork.description,
      price: artwork.price,
      publishingstatus: artwork.publishingstatus,
    });
    setEditId(artwork._id);
    setShowUploadForm(true);
    setMsg("✏️ Editing artwork...");
  };

  const cancelEdit = () => {
    setForm({
      title: "",
      image: null,
      description: "",
      price: "",
      publishingstatus: "published",
    });
    setEditId(null);
    setShowUploadForm(false);
    setMsg("");
  };
  return (
    <div className="artist-dashboard">
      <div className="container-fluid px-4 py-5">
        {/* Header Section */}
        <div className="dashboard-header mb-5" data-aos="fade-up">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="dashboard-title">
                <span className="gradient-text">Artist Studio</span>
              </h1>
              <p className="dashboard-subtitle">Create, manage, and showcase your masterpieces</p>
            </div>
            <div className="col-lg-6 text-lg-end">
              <button
                className="btn btn-glow btn-lg"
                onClick={() => setShowUploadForm(!showUploadForm)}
              >
                {showUploadForm ? "📋 View Gallery" : "🎨 Create New Artwork"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section mb-5" data-aos="fade-up">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="stat-card glass-card">
                <div className="stat-icon">🎨</div>
                <div className="stat-number">{stats.totalArtworks}</div>
                <div className="stat-label">Total Artworks</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card glass-card">
                <div className="stat-icon">📈</div>
                <div className="stat-number">{stats.publishedArtworks}</div>
                <div className="stat-label">Published</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card glass-card">
                <div className="stat-icon">💰</div>
                <div className="stat-number">Rs {stats.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Value</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card glass-card">
                <div className="stat-icon">📊</div>
                <div className="stat-number">Rs {Math.round(stats.avgPrice).toLocaleString()}</div>
                <div className="stat-label">Average Price</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {msg && (
          <div className="alert-message glass-card mb-4" data-aos="fade-up">
            <span>{msg}</span>
            <button className="close-btn" onClick={() => setMsg("")}>×</button>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="upload-section mb-5" data-aos="fade-up">
            <div className="upload-card glass-card">
              <div className="upload-header">
                <h3 className="upload-title">
                  {editId ? "Edit Artwork" : "Upload New Artwork"}
                </h3>
                <button className="close-form-btn" onClick={cancelEdit}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Artwork Title</label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter artwork title..."
                      className="form-input"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (Rs)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="Enter price..."
                      className="form-input"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Artwork Image</label>
                  <div className="file-upload-area">
                    <input
                      name="image"
                      type="file"
                      className="file-input"
                      onChange={handleChange}
                      accept="image/*"
                      id="artwork-image"
                    />
                    <label htmlFor="artwork-image" className="file-label">
                      <div className="file-icon">📁</div>
                      <div className="file-text">
                        {form.image ? form.image.name : "Choose image file"}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe your artwork..."
                    className="form-textarea"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publishing Status</label>
                  <select
                    name="publishingstatus"
                    className="form-select"
                    value={form.publishingstatus}
                    onChange={handleChange}
                  >
                    <option value="published">📢 Publish Now</option>
                    <option value="scheduled">⏰ Schedule for Later</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-glow" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Uploading...
                      </>
                    ) : editId ? (
                      "Update Artwork"
                    ) : (
                      "Upload Artwork"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Artworks Gallery */}
        <div className="gallery-section" data-aos="fade-up">
          <div className="gallery-header mb-4">
            <h3 className="gallery-title">My Gallery</h3>
            <p className="gallery-subtitle">Manage your artwork collection</p>
          </div>
          {artworks.length > 0 ? (
            <div className="row g-4">
              {artworks.map((art, index) => (
                <div className="row g-4 justify-content-center">
                  <div className="col-lg-4 col-md-6" key={art._id}>
                    <div className="artwork-card glass-card" data-aos="fade-up" data-aos-delay={index * 100}>
                      <div className="artwork-image-container">
                        <img
                          src={`http://localhost:5000${art.imageUrl}`}
                          alt={art.title}
                          className="artwork-image"
                        />
                        {/* <div className="artwork-overlay">
                        <div className="overlay-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(art)}
                            title="Edit Artwork"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(art._id)}
                            title="Delete Artwork"
                          >
                            🗑️
                          </button>
                        </div>
                      </div> */}
                        <div className="status-badge">
                          <span className={`badge ${art.publishingstatus === 'published' ? 'badge-published' : 'badge-scheduled'}`}>
                            {art.publishingstatus === 'published' ? 'LIVE' : 'SCHEDULED'}
                          </span>
                        </div>
                      </div>

                      <div className="artwork-info">
                        <h5 className="artwork-title">{art.title}</h5>
                        <p className="artwork-description">{art.description}</p>
                        <div className="artwork-footer">
                          <div className="price-tag">
                            <span className="price-label">Price</span>
                            <span className="price-value">Rs {art.price.toLocaleString()}</span>
                          </div>
                          <div className="artwork-actions">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleEdit(art)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(art._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-gallery glass-card">
              <div className="empty-icon">🎨</div>
              <h4 className="empty-title">No Artworks Yet</h4>
              <p className="empty-subtitle">Start creating your first masterpiece!</p>
              <button
                className="btn btn-glow"
                onClick={() => setShowUploadForm(true)}
              >
                Create Your First Artwork
              </button>
            </div>
          )}
        </div>

      </div>

      {/* <style jsx>{`
        .artist-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          position: relative;
          overflow-x: hidden;
        }

        .artist-dashboard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(211, 145, 176, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(93, 60, 100, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .dashboard-header {
          position: relative;
          z-index: 1;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #d391b0, #a8c8ec);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
          color: #d391b0;
          margin-bottom: 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-card {
          text-align: center;
          padding: 2rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(211, 145, 176, 0.3);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #d391b0;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #a8c8ec;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .alert-message {
          background: rgba(211, 145, 176, 0.1);
          border: 1px solid rgba(211, 145, 176, 0.3);
          color: #d391b0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: #d391b0;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .upload-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(211, 145, 176, 0.3);
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .upload-title {
          color: #d391b0;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .close-form-btn {
          background: none;
          border: none;
          color: #d391b0;
          font-size: 2rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .close-form-btn:hover {
          opacity: 1;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: #a8c8ec;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #d391b0;
          box-shadow: 0 0 0 3px rgba(211, 145, 176, 0.2);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-select option {
          background: #1a1a2e;
          color: white;
        }

        .file-upload-area {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-label:hover {
          border-color: #d391b0;
          background: rgba(211, 145, 176, 0.1);
        }

        .file-icon {
          font-size: 2rem;
          margin-right: 1rem;
        }

        .file-text {
          color: #a8c8ec;
          font-size: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-glow {
          background: linear-gradient(135deg, #d391b0, #a8c8ec);
          color: #1a1a2e;
        }

        .btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(211, 145, 176, 0.4);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #a8c8ec;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #d391b0;
        }

        .btn-danger {
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .gallery-header {
          text-align: center;
        }

        .gallery-title {
          color: #d391b0;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .gallery-subtitle {
          color: #a8c8ec;
          font-size: 1.1rem;
        }

        .artwork-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          height: 100%;
        }

        .artwork-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .artwork-card:hover .artwork-image {
          transform: scale(1.1);
        }

        .artwork-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .artwork-card:hover .artwork-overlay {
          opacity: 1;
        }

        .overlay-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn:hover {
          background: #d391b0;
          transform: scale(1.1);
        }

        .delete-btn:hover {
          background: #ff6b6b;
          transform: scale(1.1);
        }

        .status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-published {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .badge-scheduled {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .artwork-info {
          padding: 1.5rem;
        }

        .artwork-title {
          color: #d391b0;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .artwork-description {
          color: #a8c8ec;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .artwork-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .price-tag {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.8rem;
          color: #a8c8ec;
          margin-bottom: 0.25rem;
        }

        .price-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #d391b0;
        }

        .artwork-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .empty-gallery {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          color: #d391b0;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          color: #a8c8ec;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .spinner-border {
          width: 1rem;
          height: 1rem;
          border-width: 0.15rem;
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .artwork-footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style> */}
    </div>
  );
}

export default ArtistDashboard;