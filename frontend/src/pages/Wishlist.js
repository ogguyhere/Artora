// Wishlist.js (Fully Functional Wishlist Integration)
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Auth-Context';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/get/`,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }

    });
      setWishlistItems(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  const removeFromWishlist = async (artworkId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove`, {
        data: { userId: user.id, artworkId },
      });
      setWishlistItems(prev => prev.filter(item => item._id !== artworkId));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  return (
    <div className="wishlist-page container py-5">
      <h2 className="text-orchid mb-4">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="text-dusty-rose">Your wishlist is empty. Add some art!</p>
      ) : (
        <div className="row">
          {wishlistItems.map((item, index) => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="glass-card p-3">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.title}
                  className="img-fluid mb-2 rounded"
                />
                <h5 className="text-orchid">{item.title}</h5>
                <p className="text-dusty-rose">{item.description}</p>
                <p className="fw-bold">Rs {item.price}</p>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromWishlist(item._id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
