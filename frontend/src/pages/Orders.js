import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Order fetch error", err));
  }, []);
  

  if (orders.length === 0) {
    return (
      <div className="glass-card p-4">
        <h4>📦 Orders</h4>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h4 className="text-orchid mb-4">📦 Your Orders</h4>
      {orders.map((order, idx) => (
        <div key={order._id} className="order-entry mb-3 p-3 border-bottom">
          <p className="mb-2">🧾 <strong>Order #{idx + 1}</strong> - {new Date(order.createdAt).toLocaleString()}</p>
          {order.items.map((item, i) => (
            <div key={i} className="d-flex align-items-center gap-3 mb-2">
              <img src={`http://localhost:5000${item.image}`} alt={item.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <div>
                <p className="mb-0"><strong>{item.title}</strong></p>
                <p className="mb-0 text-dusty-rose">Rs {item.price} × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
