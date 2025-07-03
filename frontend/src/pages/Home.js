// Enhanced Home.js with dark artistic aesthetic
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const artCategories = [
    { name: "Digital Art", icon: "🎨", description: "Stunning digital masterpieces" },
    { name: "Photography", icon: "📸", description: "Captured moments in time" },
    { name: "Illustrations", icon: "✨", description: "Hand-crafted visual stories" },
    { name: "Abstract", icon: "🌌", description: "Beyond reality and form" }
  ];

  const featuredStats = [
    { number: "10K+", label: "Artists" },
    { number: "50K+", label: "Artworks" },
    { number: "25K+", label: "Collectors" },
    { number: "100+", label: "Countries" }
  ];

  return (
    <div className="home-container">
      {/* Dynamic Background Effect */}
      <div 
        className="dynamic-bg"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(211, 145, 176, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-fluid">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className={`hero-content ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <h1 className="logo-text mb-4" data-aos="fade-up">
                  Artora
                </h1>
                <h2 className="display-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                  Where <span className="text-gradient">Darkness</span> Meets <span className="text-gradient">Beauty</span>
                </h2>
                <p className="lead text-dusty-rose mb-5" data-aos="fade-up" data-aos-delay="400" style={{ fontSize: '1.3rem', lineHeight: '1.8' }}>
                  Step into the shadows of creativity. Discover extraordinary artworks that emerge from the depths of imagination, 
                  where each piece tells a story untold and every stroke captures the essence of the mysterious.
                </p>
                
                <div className="hero-actions" data-aos="fade-up" data-aos-delay="600">
                  <Link to="/shop" className="btn btn-glow me-3 mb-3">
                    Explore Gallery
                  </Link>
                  <Link to="/register" className="btn btn-outline mb-3">
                    Join the Dark Arts
                  </Link>
                </div>

                {/* Featured Stats */}
                <div className="stats-row mt-5" data-aos="fade-up" data-aos-delay="800">
                  <div className="row">
                    {featuredStats.map((stat, index) => (
                      <div key={index} className="col-3 text-center">
                        <div className="stat-item">
                          <h3 className="text-orchid mb-1" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                            {stat.number}
                          </h3>
                          <p className="text-muted small mb-0">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-visual" data-aos="fade-left" data-aos-delay="300">
                <div className="floating-elements">
                  <div className="floating-card glass-card animate-fadeInScale" style={{ animationDelay: '1s' }}>
                    <div className="card-glow"></div>
                    <h4 className="text-orchid mb-3">✨ Featured Collection</h4>
                    <p className="text-light mb-3">
                      "Midnight Visions" - A haunting series that explores the boundary between dreams and nightmares.
                    </p>
                    <div className="d-flex align-items-center">
                      <div className="artist-avatar me-3"></div>
                      <div>
                        <small className="text-mauve">By Alexandra Moon</small><br/>
                        <small className="text-muted">3.2K views • 24 hearts</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Art Categories Section */}
      <section className="categories-section py-5" style={{ marginTop: '4rem' }}>
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-5 text-gradient mb-3">Explore the Shadows</h2>
            <p className="lead text-dusty-rose">Dive deep into different realms of artistic expression</p>
          </div>
          
          <div className="row">
            {artCategories.map((category, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="category-card glass-card text-center h-100">
                  <div className="category-icon mb-3" style={{ fontSize: '3rem' }}>
                    {category.icon}
                  </div>
                  <h4 className="text-orchid mb-3">{category.name}</h4>
                  <p className="text-light mb-4">{category.description}</p>
                  <Link to="/shop" className="btn btn-outline btn-sm">
                    Discover →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5" style={{ marginTop: '6rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="glass-card" data-aos="fade-up">
                <h2 className="display-5 text-gradient mb-4">Ready to Enter the Darkness?</h2>
                <p className="lead text-dusty-rose mb-4">
                  Join thousands of artists and collectors who have discovered the beauty that lies within the shadows. 
                  Your journey into the mysterious world of art begins here.
                </p>
                <div className="cta-actions">
                  <Link to="/register" className="btn btn-glow me-3 mb-3">
                    Start Your Journey
                  </Link>
                  <Link to="/shop" className="btn btn-outline mb-3">
                    Browse Collections
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          position: relative;
          overflow: hidden;
        }

        .dynamic-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          transition: background 0.3s ease;
        }

        .hero-visual {
          position: relative;
          height: 500px;
        }

        .floating-elements {
          position: relative;
          height: 100%;
        }

        .floating-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          animation: float 6s ease-in-out infinite;
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, var(--color-orchid), var(--color-mauve));
          border-radius: var(--border-radius);
          z-index: -1;
          opacity: 0.3;
          filter: blur(8px);
        }

        .artist-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-orchid), var(--color-mauve));
          flex-shrink: 0;
        }

        .category-card {
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 50px var(--color-glow);
        }

        .category-icon {
          filter: drop-shadow(0 0 10px var(--color-glow));
        }

        .stats-row .stat-item {
          transition: all 0.3s ease;
        }

        .stats-row .stat-item:hover {
          transform: scale(1.1);
        }

        @keyframes float {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translate(-50%, -50%) translateY(-20px) rotate(1deg);
          }
        }

        @media (max-width: 768px) {
          .floating-card {
            width: 280px;
            position: static;
            transform: none;
            margin-top: 2rem;
          }
          
          .hero-visual {
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;