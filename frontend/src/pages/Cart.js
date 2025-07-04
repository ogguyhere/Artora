import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Auth-Context';
import { Link } from 'react-router-dom';

function Cart() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    axios.get(`http://localhost:5000/api/cart/${user.id}`)
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load cart", err);
        setLoading(false);
      });
  }, [user]);

  const handleRemove = (artworkId) => {
    setRemoving(artworkId);
    axios.post(`http://localhost:5000/api/cart/remove`, {
      userId: user.id,
      artworkId
    })
      .then(res => {
        setCart(res.data.cart);
        setRemoving(null);
      })
      .catch(err => {
        console.error("Remove failed", err);
        setRemoving(null);
      });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-container">
          <div className="mystical-spinner"></div>
          <p className="text-orchid mt-3">Loading your collection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '100vh' }}>
        <div className="glass-card mx-auto" style={{ maxWidth: '500px' }}>
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🎨</span>
          </div>
          <h3 className="text-orchid mb-3">Access Your Art Collection</h3>
          <p className="text-dusty-rose mb-4">Please login to view your cart and manage your artistic treasures.</p>
          <Link to="/login" className="btn btn-glow me-3">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline">
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '100vh' }}>
        <div className="glass-card mx-auto" style={{ maxWidth: '500px' }}>
          <div className="mb-4">
            <span style={{ fontSize: '4rem' }}>🛒</span>
          </div>
          <h3 className="text-orchid mb-3">Your Cart is Empty</h3>
          <p className="text-dusty-rose mb-4">Discover amazing artworks and start building your collection.</p>
          <Link to="/shop" className="btn btn-glow">
            Explore Gallery
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((acc, item) => acc + item.artwork.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h1 className="display-4 text-gradient mb-3">Your Collection</h1>
          <p className="lead text-dusty-rose">Curated pieces awaiting your decision</p>
        </div>

        {/* Cart Items */}
        <div className="row">
          {cart.items.map((item, index) => (
            <div 
              className="col-lg-4 col-md-6 mb-4" 
              key={item.artwork._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="artwork-card glass-card h-100">
                <div className="artwork-image-container">
                  <img
                    src={`http://localhost:5000${item.artwork.imageUrl}`}
                    className="artwork-image"
                    alt={item.artwork.title}
                  />
                  <div className="artwork-overlay">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleRemove(item.artwork._id)}
                      disabled={removing === item.artwork._id}
                    >
                      {removing === item.artwork._id ? (
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "🗑️"
                      )}
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="card-content">
                  <h5 className="artwork-title text-orchid mb-2">{item.artwork.title}</h5>
                  <div className="artwork-details">
                    <div className="quantity-info">
                      <span className="text-dusty-rose">Quantity: </span>
                      <span className="quantity-badge">{item.quantity}</span>
                    </div>
                    <div className="price-info">
                      <span className="price-label">Price: </span>
                      <span className="price-value">Rs {item.artwork.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary" data-aos="fade-up">
          <div className="glass-card">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h4 className="text-orchid mb-2">Cart Summary</h4>
                <p className="text-dusty-rose mb-0">
                  {cart.items.length} artwork{cart.items.length !== 1 ? 's' : ''} in your collection
                </p>
              </div>
              <div className="col-md-4 text-end">
                <div className="total-section">
                  <p className="total-label">Total Amount</p>
                  <h3 className="total-value text-gradient">Rs {total.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 text-center">
                <button className="btn btn-glow me-3" style={{ minWidth: '150px' }}>
                  Proceed to Checkout
                </button>
                <Link to="/shop" className="btn btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-container {
          min-height: 100vh;
          position: relative;
        }

        .artwork-card {
          transition: all 0.4s ease;
          overflow: hidden;
        }

        .artwork-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-dramatic);
        }

        .artwork-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
        }

        .artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .artwork-card:hover .artwork-image {
          transform: scale(1.05);
        }

        .artwork-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .artwork-card:hover .artwork-overlay {
          opacity: 1;
        }

        .artwork-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .artwork-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }

        .quantity-badge {
          background: linear-gradient(135deg, var(--color-orchid), var(--color-mauve));
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .price-value {
          color: var(--color-orchid);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .cart-summary {
          margin-top: 3rem;
        }

        .total-section {
          text-align: right;
        }

        .total-label {
          color: var(--color-dusty-rose);
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .total-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
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

        @media (max-width: 768px) {
          .artwork-details {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .total-section {
            text-align: center;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Cart;