import React, { useEffect, useState } from "react";
import axios from "axios";

function ArtistDashboard() {
  const [form, setForm] = useState({
    title: "",
    image: null, // file input
    description: "",
    price: "",
    publishingstatus: "published",
  });
  const [artworks, setArtworks] = useState([]);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch artist's artworks on load
  useEffect(() => {
    fetchMyArtworks();
  }, []);

  const fetchMyArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/my-artworks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtworks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
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
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("publishingstatus", form.publishingstatus);
    if (form.image) formData.append("artwork", form.image);

    try {
      if (editId) {
        // Update existing artwork
        await axios.put(`http://localhost:5000/api/artworks/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMsg("Artwork updated successfully.");
        setEditId(null);
      } else {
        // Upload new artwork
        await axios.post("http://localhost:5000/api/artworks/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMsg("Artwork uploaded successfully.");
      }

      setForm({
        title: "",
        image: null,
        description: "",
        price: "",
        publishingstatus: "published",
      });
      fetchMyArtworks();
    } catch (err) {
      setMsg("Upload failed: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("Artwork deleted.");
      fetchMyArtworks();
    } catch (err) {
      setMsg("Delete failed: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleEdit = (artwork) => {
    setForm({
      title: artwork.title,
      image: null, // user must re-select image if changing it
      description: artwork.description,
      price: artwork.price,
      publishingstatus: artwork.publishingstatus,
    });
    setEditId(artwork._id);
    setMsg("Editing artwork...");
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
          name="image"
          type="file"
          className="form-control my-2"
          onChange={handleChange}
          accept="image/*"
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
        <button type="submit" className="btn btn-primary w-100">
          {editId ? "Update Artwork" : "Upload Artwork"}
        </button>
      </form>

      {msg && <p className="text-center mt-3 text-dusty-rose">{msg}</p>}

      <hr />

      <h4 className="mt-4">My Artworks</h4>
      <div className="row">
        {artworks.map((art) => (
          <div className="col-md-4 my-3" key={art._id}>
            <div className="card">
              <img
                src={`http://localhost:5000${art.imageUrl}`}
                alt={art.title}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{art.title}</h5>
                <p className="card-text">{art.description}</p>
                <p className="card-text">
                  <strong>Rs {art.price}</strong>
                </p>
                <button
                  className="btn btn-sm btn-warning me-2"
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
        ))}
      </div>
    </div>
  );
}

export default ArtistDashboard;
