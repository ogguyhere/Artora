// src/pages/Shop.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Shop() {
    const [artworks, setArtworks] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get("http://localhost:5000/api/artworks")
            .then(res => setArtworks(res.data))
            .catch(err => console.error("Error fetching artworks", err));
    }, []);

    const filtered = artworks.filter(art =>
        art.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container py-5" style={{ backgroundColor: '#0C0420', minHeight: '100vh' }}>
            <h2 className="text-center text-orchid mb-4">Explore Artworks</h2>

            <input
                type="text"
                className="form-control mb-4"
                placeholder="Search by title..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            <div className="row">
                {filtered.length > 0 ? filtered.map(art => (
                    <div className="col-md-4 mb-4" key={art._id}>
                        <div className="card bg-dark text-white h-100 border border-secondary">
                            <img
                                src={`http://localhost:5000${art.imageUrl}`}
                                className="card-img-top"
                                alt={art.title}
                                style={{ height: '300px', objectFit: 'cover' }}
                            />

                            <div className="card-body">
                                <h5 className="card-title text-orchid">{art.title}</h5>
                                <p className="card-text text-muted">{art.description}</p>
                                <p className="text-dusty-rose fw-bold">Rs {art.price}</p>
                                <span className={`badge bg-${art.status === "sold" ? "danger" : "success"}`}>
                                    {art.status}
                                </span>
                                <br />
                                <button className="btn btn-outline-light btn-sm mt-3">View Details</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-dusty-rose">No artworks found.</div>
                )}
            </div>
        </div>
    );
}

export default Shop;
