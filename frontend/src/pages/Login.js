import React, { useState , useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth-Context';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user); // 👈 this is the missing piece!

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
      setMsg(`Logged in as ${user.name} (${user.role})`);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login failed");
    }
  };


  return (
    <div className="container py-5" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 className="text-center text-orchid mb-4">Login to Artora</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="form-control my-2"
          style={{ backgroundColor: '#2d1c3b', color: 'white', border: 'none' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="form-control my-2"
          style={{ backgroundColor: '#2d1c3b', color: 'white', border: 'none' }}
        />
        <button type="submit" className="w-100">Login</button>
      </form>
      {msg && <p className="mt-3 text-center text-dusty-rose">{msg}</p>}
    </div>
  );
}

export default Login;
