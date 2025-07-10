import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/artist_dashboard.css';
import Profile from "./Profile";

function ArtistDashboard() {
  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
    price: "",
    publishingstatus: "published",
  });
  const [selectedTab, setSelectedTab] = useState("dashboard");
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

  const renderContent=() =>{
    switch(selectedTab){
      case "profile":
        return <Profile/>
      default:
        return <p>Choose an option from the sidebar.</p>;
    }
  };

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
        await axios.put(`http://localhost:5000/api/artworks/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
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
      setMsg("🗑️ Artwork successfully deleted!");
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
        <div className="dashboard-header mb-5">
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
              <br></br>
              <br></br>
              <button className = " btn btn-glow btn-lg" onClick={Profile}> Profile
                                
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section mb-5">
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
          <div className="alert-message glass-card mb-4">
            <span>{msg}</span>
            <button className="close-btn" onClick={() => setMsg("")}>×</button>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="upload-section mb-5">
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
        <div className="gallery-section">
          <div className="gallery-header mb-4">
            <h3 className="gallery-title">My Gallery</h3>
            <p className="gallery-subtitle">Manage your artwork collection</p>
          </div>
          {artworks.length > 0 ? (
            <div className="row g-4">
              {artworks.map((art) => (
                <div className="col-lg-4 col-md-6" key={art._id}>
                  <div className="artwork-card glass-card">
                    <div className="artwork-image-container">
                      <img
                        src={`http://localhost:5000${art.imageUrl}`}
                        alt={art.title}
                        className="artwork-image"
                      />
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
    </div>
  );
}

export default ArtistDashboard;