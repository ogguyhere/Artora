import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './css/theme.css';
import AdminDashboard from './pages/Admin-Dashboard';
import UserDashboard from './pages/User-Dashboard';
import ArtistDashboard from './pages/Artist-Dashboard';
import PrivateRoute from './components/Private-Route';
import { useContext } from 'react';
import { AuthContext } from './context/Auth-Context';
import './index.css'; // Make sure this is BELOW bootstrap if both are used
import AOS from 'aos';
import 'aos/dist/aos.css';
import Shop from './pages/Shop';
import Cart from './pages/Cart';

function App() {
  // const [user, setUser] = useState(null);
  const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  // useEffect(() => {
  //   const stored = localStorage.getItem("user");
  //   if (stored) setUser(JSON.parse(stored));
  // }, []);
  const handleLogout = () => {
    logout();                     // logout from context
    window.location.href = "/login";  // optional: redirect
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-artora">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">Artora</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li> */}
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Hi, {user.name}</span>
                  </li>

                  <li className="nav-item">
                    {user.role === 'admin' && (
                      <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
                    )}
                    {user.role === 'artist' && (
                      <Link className="nav-link" to="/artist-dashboard">Dashboard</Link>
                    )}
                    {user.role === 'buyer' && (
                      <Link className="nav-link" to="/user-dashboard">Dashboard</Link>
                    )}
                  </li>

                  <li className="nav-item">
                    <button className="nav-link btn btn-link text-white" onClick={logout} style={{ textDecoration: 'none' }}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>


              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                  Dropdown
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#">Action</Link></li>
                  <li><Link className="dropdown-item" to="#">Another action</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <span className="nav-link" aria-disabled="true">Disabled</span>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      {/* Optional custom second navbar
      <nav style={{ backgroundColor: 'var(--color-purple-plum)', padding: '10px' }}>
        <Link to="/" style={{ margin: '0 10px', color: 'white' }}>Home</Link>
        <Link to="/register" style={{ margin: '0 10px', color: 'white' }}>Register</Link>
        <Link to="/login" style={{ margin: '0 10px', color: 'white' }}>Login</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        {/* Protected Routes */}
        <Route path="/admin-dashboard" element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/user-dashboard" element={
          <PrivateRoute role="buyer">
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path='/artist-dashboard' element={
          <PrivateRoute role='artist'>
            <ArtistDashboard />
          </PrivateRoute>
        } />
      </Routes>


    </Router>
  );
}

export default App;
