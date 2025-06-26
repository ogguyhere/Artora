import React, { useState } from 'react';
import axios from 'axios';

function ArtistDashboard() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artwork', file);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/artwork/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setMsg(res.data.msg);
            setTitle('');
            setFile(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-orchid">Welcome, Artist </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Artwork Title"
                    className="form-control my-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="file"
                    className="form-control my-2"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit" className="btn w-100">Upload Artwork</button>
            </form>
            {msg && <p className="text-center mt-3 text-dusty-rose">{msg}</p>}
        </div>
    );
}

export default ArtistDashboard;