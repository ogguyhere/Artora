import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const res = await axios.post('http://localhost:5000/api/auth/register', form);

  //     // Success notification
  //     const notification = document.createElement('div');
  //     notification.className = 'success-notification';
  //     notification.innerHTML = `
  //       <div class="notification-content">
  //         <span class="notification-icon">✨</span>
  //         <span>Welcome to Artora! ${res.data.msg}</span>
  //       </div>
  //     `;
  //     document.body.appendChild(notification);

  //     setTimeout(() => {
  //       notification.remove();
  //       navigate('/login');
  //     }, 2000);

  //   } catch (err) {
  //     const errorMsg = err.response?.data?.msg || "Registration failed";
  //     setErrors({ general: errorMsg });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (profileImage) {
        formData.append("profilePicture", profileImage);
      }

      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Notification as before
      const notification = document.createElement('div');
      notification.className = 'success-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">✨</span>
          <span>Welcome to Artora! ${res.data.msg}</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed";
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions = {
    buyer: {
      icon: '🎨',
      title: 'Art Collector',
      description: 'Discover and collect stunning artworks from talented artists'
    },
    artist: {
      icon: '🖌️',
      title: 'Creative Artist',
      description: 'Showcase your art and connect with collectors worldwide'
    }
  };

  return (
    <div className="register-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="register-card glass-card" data-aos="fade-up">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="display-5 text-gradient mb-3">Join the Darkness</h1>
                <p className="text-dusty-rose">
                  Step into the shadows of creativity and become part of our mysterious art community
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="register-form">
                {errors.general && (
                  <div className="error-alert glass-card mb-4">
                    <span className="error-icon">⚠️</span>
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Name Field */}
                <div className="form-group mb-4">
                  <label className="form-label text-orchid">Full Name</label>
                  <div className="input-container">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      name="name"
                      className={`form-control mystical-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>

                {/* Email Field */}
                <div className="form-group mb-4">
                  <label className="form-label text-orchid">Email Address</label>
                  <div className="input-container">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control mystical-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                {/* Password Field */}
                <div className="form-group mb-4">
                  <label className="form-label text-orchid">Password</label>
                  <div className="input-container">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      name="password"
                      className={`form-control mystical-input ${errors.password ? 'error' : ''}`}
                      placeholder="Create a secure password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && <div className="error-text">{errors.password}</div>}
                </div>

                {/* Role Selection */}
                <div className="form-group mb-4">
                  <label className="form-label text-orchid mb-3">Choose Your Path</label>
                  <div className="role-selection">
                    {Object.entries(roleDescriptions).map(([roleKey, role]) => (
                      <div key={roleKey} className="role-option">
                        <input
                          type="radio"
                          id={roleKey}
                          name="role"
                          value={roleKey}
                          checked={form.role === roleKey}
                          onChange={handleChange}
                          className="role-radio"
                        />
                        <label htmlFor={roleKey} className="role-label">
                          <div className="role-card">
                            <span className="role-icon">{role.icon}</span>
                            <h5 className="role-title text-orchid">{role.title}</h5>
                            <p className="role-description text-dusty-rose">{role.description}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label text-orchid">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                  />
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-glow w-100 mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Joining the Darkness...
                    </>
                  ) : (
                    'Enter the Shadows'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-dusty-rose">
                    Already part of our community?{' '}
                    <Link to="/login" className="text-orchid hover-glow">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
        }

        .register-card {
          max-width: 500px;
          margin: 0 auto;
          padding: 3rem;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .input-container {
          position: relative;
          margin-bottom: 0.5rem;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          font-size: 1.1rem;
        }

        .mystical-input {
          background: rgba(93, 60, 100, 0.2);
          border: 2px solid rgba(211, 145, 176, 0.3);
          border-radius: var(--border-radius);
          color: white;
          padding: 12px 15px 12px 45px;
          font-size: 1rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .mystical-input:focus {
          outline: none;
          border-color: var(--color-orchid);
          box-shadow: 0 0 20px var(--color-glow);
          background: rgba(93, 60, 100, 0.3);
        }

        .mystical-input.error {
          border-color: #dc3545;
        }

        .mystical-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .error-text {
          color: #dc3545;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #dc3545;
          padding: 1rem;
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .role-option {
          position: relative;
        }

        .role-radio {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .role-label {
          cursor: pointer;
          display: block;
        }

        .role-card {
          background: rgba(93, 60, 100, 0.2);
          border: 2px solid rgba(211, 145, 176, 0.3);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .role-radio:checked + .role-label .role-card {
          border-color: var(--color-orchid);
          background: rgba(211, 145, 176, 0.2);
          box-shadow: 0 0 20px var(--color-glow);
        }

        .role-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-orchid);
        }

        .role-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .role-title {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .role-description {
          font-size: 0.85rem;
          line-height: 1.4;
          margin: 0;
        }

        .hover-glow {
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .hover-glow:hover {
          text-shadow: 0 0 10px var(--color-glow);
          color: var(--color-orchid);
        }

        .success-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, var(--color-orchid), var(--color-mauve));
          color: white;
          padding: 1rem 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-dramatic);
          z-index: 1000;
          animation: slideIn 0.5s ease forwards;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .notification-icon {
          font-size: 1.2rem;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .register-card {
            padding: 2rem;
          }
          
          .role-selection {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;