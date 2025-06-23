import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './css/theme.css';

function App() {
  return (
    <Router>
      <nav style={{ backgroundColor: 'var(--color-purple-plum)', padding: '10px' }}>
        <Link to="/" style={{ margin: '0 10px', color: 'white' }}>Home</Link>
        <Link to="/register" style={{ margin: '0 10px', color: 'white' }}>Register</Link>
        <Link to="/login" style={{ margin: '0 10px', color: 'white' }}>Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
