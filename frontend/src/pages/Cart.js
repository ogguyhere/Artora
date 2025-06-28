import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Auth-Context';

function Cart() {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if (!user) return;

        axios.get(`http://localhost:5000/api/cart/${user.id}`)
            .then(res => setCart(res.data))
            .catch(err => console.error("Failed to load cart", err));
    }, [user]);

    const handleRemove = (artworkId) => {
        axios.post(`http://localhost:5000/api/cart/remove`, {
            userId: user.id,
            artworkId
        })
        .then(res => setCart(res.data.cart))
        .catch(err => console.error("Remove failed", err));
    };

    if (!user) return <p className="text-center text-light">Please login to view your cart.</p>;
    if (!cart || cart.items.length === 0) return <p className="text-center text-light">Your cart is empty.</p>;

    const total = cart.items.reduce((acc, item) => acc + item.artwork.price * item.quantity, 0);

    return (
        <div className="container py-5 text-light">
            <h2 className="text-orchid mb-4 text-center">Your Cart</h2>

            <div className="row">
                {cart.items.map((item) => (
                    <div className="col-md-4 mb-4" key={item.artwork._id}>
                        <div className="card bg-dark text-white h-100 border border-secondary">
                            <img
                                src={`http://localhost:5000${item.artwork.imageUrl}`}
                                className="card-img-top"
                                alt={item.artwork.title}
                                style={{ height: '250px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title text-orchid">{item.artwork.title}</h5>
                                <p className="text-dusty-rose">Quantity: {item.quantity}</p>
                                <p>Rs {item.artwork.price}</p>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.artwork._id)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-end text-dusty-rose">Total: Rs {total}</h4>
        </div>
    );
}

export default Cart;
