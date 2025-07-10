import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/Cart-Context';
import { AuthContext } from '../context/Auth-Context';
import { Link } from 'react-router-dom';

function Shop() {
  const [artworks, setArtworks] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  console.log("Current user from AuthContext:", user);
  const handleAddToWishlist = (artworkId) => {
    if (!user) {
      alert("Please login to add to wishlist.");
      return;
    }

    axios.post('http://localhost:5000/api/wishlist/add', {
      artworkId
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }

    })
      .then(() => {
        alert("Added to wishlist!");
      })
      .catch(err => {
        console.error("Error adding to wishlist:", err);
        alert("Failed to add to wishlist.");
      });
  };

  const handleAddToCart = (artwork) => {
    if (!user) {
      alert("Please login to add to cart.");
      return;
    }

    if (artwork.status === 'sold') {
      alert("This artwork is already sold.");
      return;
    }

    setAddingToCart(artwork._id);
    axios.post('http://localhost:5000/api/cart/add', {
      userId: user.id,
      artworkId: artwork._id
    })
      .then(() => {
        addToCart(artwork);
        alert("Added to cart!");
        setAddingToCart(null);
      })
      .catch(err => {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart.");
        setAddingToCart(null);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/artworks")
      .then(res => {
        setArtworks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching artworks", err);
        setLoading(false);
      });
  }, []);

  const filtered = artworks
    .filter(art => art.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-container">
          <div className="mystical-spinner"></div>
          <p className="text-orchid mt-3">Discovering masterpieces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h1 className="display-4 text-gradient mb-3">Gallery Collection</h1>
          <p className="lead text-dusty-rose">Discover extraordinary artworks from talented creators</p>
        </div>

        {/* Filter and Sort Controls */}
        <div className="filter-controls glass-card mb-5" data-aos="fade-up">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by artwork title..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  ⊞
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid/List */}
        {filtered.length > 0 ? (
          <div className={`row ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filtered.map((art, index) => (
              <div
                className={`${viewMode === 'grid' ? 'col-lg-4 col-md-6' : 'col-12'} mb-4`}
                key={art._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="artwork-card glass-card h-100">
                  <div className="artwork-image-container">
                    <img
                      src={`http://localhost:5000${art.imageUrl}`}
                      className="artwork-image"
                      alt={art.title}
                    />
                    <div className="artwork-overlay">
                      <div className="overlay-content">
                        <button className="btn btn-outline btn-sm mb-2">
                          👁️ View Details
                        </button>
                      </div>
                    </div>
                    <div className="status-badge">
                      <span className={`badge ${art.status === 'sold' ? 'badge-sold' : 'badge-available'}`}>
                        {art.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h5 className="artwork-title text-orchid mb-2">{art.title}</h5>
                    <p className="artist-name" style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'white' }}>
                      By: {art.artist?.name || 'Unknown Artist'}
                    </p>

                    <p className="artwork-description text-dusty-rose">{art.description}</p>

                    {/* Add to Cart Button - Always Visible */}
                    <div className="add-to-cart-section mb-3">
                      <button
                        className={`btn btn-glow w-100 ${art.status === 'sold' ? 'btn-disabled' : ''}`}
                        onClick={() => handleAddToCart(art)}
                        disabled={art.status === 'sold' || addingToCart === art._id}
                      >
                        {addingToCart === art._id ? (
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : art.status === 'sold' ? (
                          "🚫 Sold Out"
                        ) : (
                          "🛒 Add to Cart"
                        )}
                      </button>

                    </div>

                    <div className="artwork-footer">
                      <div className="price-section">
                        <span className="price-label">Price</span>
                        <span className="price-value">Rs {art.price.toLocaleString()}</span>
                      </div>
                      <div className="artwork-actions">
                        <button
                          className="action-btn"
                          title="Add to Favorites"
                          onClick={() => handleAddToWishlist(art._id)}
                        >
                          💜
                        </button>

                        <button className="action-btn" title="Share">
                          📤
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results" data-aos="fade-up">
            <div className="glass-card text-center py-5">
              <div className="mb-4">
                <span style={{ fontSize: '4rem' }}>🎨</span>
              </div>
              <h3 className="text-orchid mb-3">No Artworks Found</h3>
              <p className="text-dusty-rose">Try adjusting your search or browse our full collection.</p>
              <button
                className="btn btn-outline mt-3"
                onClick={() => setFilter('')}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-section text-center mt-5" data-aos="fade-up">
          <div className="glass-card">
            <h4 className="text-orchid mb-3">Don't see what you're looking for?</h4>
            <p className="text-dusty-rose mb-4">Commission a custom artwork tailored to your vision</p>
            <Link to="/contact" className="btn btn-glow">
              Request Custom Art
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shop-container {
          min-height: 100vh;
          position: relative;
        }

        .filter-controls {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(211, 145, 176, 0.3);
        }

        .search-container {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 50px;
          background: rgba(93, 60, 100, 0.2);
          border: 2px solid rgba(211, 145, 176, 0.3);
          border-radius: var(--border-radius);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-orchid);
          box-shadow: 0 0 20px rgba(211, 145, 176, 0.3);
        }

        .search-input::placeholder {
          color: var(--color-dusty-rose);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-orchid);
          font-size: 1.2rem;
        }

        .sort-select {
          width: 100%;
          padding: 12px 15px;
          background: rgba(93, 60, 100, 0.2);
          border: 2px solid rgba(211, 145, 176, 0.3);
          border-radius: var(--border-radius);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: var(--color-orchid);
          box-shadow: 0 0 20px rgba(211, 145, 176, 0.3);
        }

        .sort-select option {
          background: var(--color-dark);
          color: white;
        }

        .view-toggle {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .view-btn {
          padding: 10px 15px;
          background: rgba(93, 60, 100, 0.2);
          border: 2px solid rgba(211, 145, 176, 0.3);
          border-radius: var(--border-radius);
          color: var(--color-dusty-rose);
          font-size: 1.2rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .view-btn:hover,
        .view-btn.active {
          background: var(--color-orchid);
          color: var(--color-dark);
          border-color: var(--color-orchid);
        }

        .list-view .artwork-card {
          display: flex;
          flex-direction: row;
          max-height: 250px;
        }

        .list-view .artwork-image-container {
          width: 300px;
          height: 100%;
          margin-bottom: 0;
          margin-right: 1.5rem;
        }

        .list-view .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .artwork-card {
          transition: all 0.4s ease;
          overflow: hidden;
          position: relative;
        }

        .artwork-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-dramatic);
        }

        .artwork-image-container {
          position: relative;
          height: 300px;
          overflow: hidden;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
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

        .overlay-content {
          text-align: center;
        }

        .status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-available {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .badge-sold {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
        }

        .artist-name {
          color: white !important;
          font-weight: 500;
          opacity: 0.9;
        }

        .artwork-description {
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .add-to-cart-section {
          margin-top: auto;
          margin-bottom: 1rem;
        }

        .add-to-cart-section .btn {
          padding: 12px 20px;
          font-weight: 600;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
        }

        .artwork-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .price-section {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.8rem;
          color: var(--color-dusty-rose);
          margin-bottom: 0.25rem;
        }

        .price-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-orchid);
          font-family: var(--font-display);
        }

        .artwork-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          padding: 8px 12px;
          background: rgba(93, 60, 100, 0.3);
          border: 1px solid rgba(211, 145, 176, 0.3);
          border-radius: 50%;
          color: var(--color-orchid);
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-btn:hover {
          background: var(--color-orchid);
          color: var(--color-dark);
          transform: scale(1.1);
        }

        .btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .mystical-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(211, 145, 176, 0.3);
          border-top: 3px solid var(--color-orchid);
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-results {
          margin-top: 3rem;
        }

        .cta-section {
          margin-top: 4rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .filter-controls .row {
            gap: 1rem;
          }
          
          .list-view .artwork-card {
            flex-direction: column;
            max-height: none;
          }
          
          .list-view .artwork-image-container {
            width: 100%;
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .artwork-footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Shop;