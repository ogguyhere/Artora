// src/pages/Home.js
import React from 'react';
import '../css/theme.css';

function Home() {
  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
      <h1 style={{ color: 'var(--color-orchid)' }}>Welcome to Artora 🎨</h1>
      <p style={{ maxWidth: '600px', lineHeight: '1.6', color: 'var(--color-dusty-rose)' }}>
        Discover, collect, and showcase the best digital artworks from artists around the world.
        Artora is where passion meets creativity.
      </p>
      <div style={{ marginTop: '30px' }}>
        <button style={{ marginRight: '10px' }}>Explore Gallery</button>
        <button style={{ backgroundColor: 'var(--color-mauve-deep)' }}>Join Now</button>
      </div>
    </div>
  );
}

export default Home;
