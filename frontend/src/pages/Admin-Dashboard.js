import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    axios.delete(`http://localhost:5000/api/admin/users/${id}`)
      .then(() => fetchUsers())
      .catch(err => console.error("Delete error:", err));
  };

  const updateRole = (id, newRole) => {
    axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole })
      .then(() => fetchUsers())
      .catch(err => console.error("Update role error:", err));
  };

  return (
    <div className="container text-light py-5">
      <h2 className="text-orchid mb-4">Admin Dashboard</h2>

      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-danger btn-sm me-2" onClick={() => deleteUser(u._id)}>Delete</button>
                <button className="btn btn-warning btn-sm" onClick={() => updateRole(u._id, u.role === 'buyer' ? 'artist' : 'buyer')}>
                  Promote/Demote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
