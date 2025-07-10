import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/theme.css'; // Make sure to style the cards here

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setMsg("Failed to load profile"));
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const uploadProfilePic = (e) => {
    e.preventDefault();
    if (!profileImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profilePicture", profileImage);

    axios.put("http://localhost:5000/api/user/profile/picture", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res) => {
        setMsg(res.data.msg);
        setUser(res.data.user);
      })
      .catch(() => setMsg("Failed to upload profile picture"));
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    axios.put("http://localhost:5000/api/users/profile/password", passwordForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMsg(res.data.msg))
      .catch(() => setMsg("Password change failed"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put("http://localhost:5000/api/user/profile", user, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setMsg("Profile updated!");
        setEditing(false);
      })
      .catch(() => setMsg("Update failed"));
  };

  return (
    <div className="container py-5">
      <div className="profile-card shadow-lg p-4 glass-card">
        <div className="text-center mb-4">
          {user?.profilePicture && (
            <img
              src={`http://localhost:5000${user.profilePicture}`}
              alt="Profile"
              className="rounded-circle border border-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          )}
          <h2 className="mt-3 text-orchid">Welcome, {user.name}</h2>
          <p className="text-dusty-rose">Manage your personal details and settings</p>
        </div>

        {msg && <p className="alert alert-info text-center">{msg}</p>}

        <div className="row">
          <div className="col-md-6">
            <div className="glass-card p-3 mb-4">
              <h4 className="text-orchid">Profile Info</h4>
              {!editing ? (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" value={user.name} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={user.email} onChange={handleChange} />
                  </div>
                  <button className="btn btn-success btn-sm" type="submit">Save</button>
                  <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditing(false)}>Cancel</button>
                </form>
              )}
            </div>

            <div className="glass-card p-3">
              <h4 className="text-orchid">Profile Picture</h4>
              <form onSubmit={uploadProfilePic}>
                <input type="file" onChange={handleImageChange} accept="image/*" className="form-control mb-2" />
                <button type="submit" className="btn btn-primary btn-sm">Upload</button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="glass-card p-3">
              <h4 className="text-orchid">Change Password</h4>
              <form onSubmit={submitPasswordChange}>
                <div className="mb-2">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary btn-sm">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
