import React, { useState } from 'react';
import axios from 'axios';

function ArtistDashboard() {
    const [form, setForm] = useState({
        title: '',
        imageUrl: '',
        description: '',
        price: '',
        publishingstatus: 'published',
    });

    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/artworks/upload", form, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setMsg(res.data.msg);
            setForm({
                title: '',
                imageUrl: '',
                description: '',
                price: '',
                publishingstatus: 'published',
            });
        } catch (err) {
            setMsg("Upload failed: " + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-orchid mb-4">Welcome, Artist</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    type="text"
                    placeholder="Artwork Title"
                    className="form-control my-2"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    name="imageUrl"
                    type="text"
                    placeholder="Artwork Image URL"
                    className="form-control my-2"
                    value={form.imageUrl}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    className="form-control my-2"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="form-control my-2"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <select
                    name="publishingstatus"
                    className="form-control my-2"
                    value={form.publishingstatus}
                    onChange={handleChange}
                >
                    <option value="published">Publish Now</option>
                    <option value="scheduled">Schedule</option>
                </select>
                <button type="submit" className="btn w-100">Upload Artwork</button>
            </form>
            {msg && <p className="text-center mt-3 text-dusty-rose">{msg}</p>}
        </div>
    );
}

export default ArtistDashboard;
