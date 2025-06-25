// src/pages/Home.js
import React from 'react'; 

// function Home() {
//   return (
//     <div style={{ padding: '40px', backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
//       <h1 style={{ color: 'var(--color-orchid)' }}>Welcome to Artora </h1>
//       <p style={{ maxWidth: '600px', lineHeight: '1.6', color: 'var(--color-dusty-rose)' }}>
//         Discover, collect, and showcase the best digital artworks from artists around the world.
//         Artora is where passion meets creativity.
//       </p>
//       <div style={{ marginTop: '30px' }}>
//         <button style={{ marginRight: '10px' }}>Explore Gallery</button>
//         <button style={{ backgroundColor: 'var(--color-mauve-deep)' }}>Join Now</button>
//       </div>
//     </div>
//   );
// }


function Home() {
    return (
        <div className="container-fluid py-5 text-light" style={{ backgroundColor: '#0C0420', minHeight: '100vh' }}>
            <h1 className="text-center logo-text">Artora</h1>
            <p className="text-center lead">Where passion meets creativity.</p>

            <div className="text-center">
                <h1 className="display-4 text-orchid">Welcome to <span className="fw-bold">Artora</span></h1>
                <p className="lead text-dusty-rose">
                    Discover, collect, and showcase the best digital artworks from artists around the world.
                </p>
                <div className="mt-4">
                    <button className="btn btn-outline-light me-2">Explore Gallery</button>
                    <button className="btn btn-secondary">Join Now</button>
                </div>
            </div>

        </div>

    );
}

export default Home;
