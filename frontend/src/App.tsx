import React from 'react';

// Sample data to make the app look "Full" and professional
const properties = [
  { id: 1, title: "Modern Glass Villa", price: "$2,400,000", location: "Malibu, CA", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Skyline Penthouse", price: "$1,850,000", location: "New York, NY", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Nordic Forest Retreat", price: "$950,000", location: "Oslo, Norway", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" }
];

function App() {
  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', width: '100%', margin: 0, padding: 0, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 60px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '2px' }}>LUXURY ESTATE</h1>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Buy</span>
          <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Rent</span>
          <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
            Agent Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '20px' }}>Find Your Next <span style={{ color: '#3b82f6' }}>Legacy</span> Home.</h2>
        <p style={{ color: '#94a3b8', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Enterprise-level property search for modern agencies. Powered by real-time market data.
        </p>
        
        {/* Search Container */}
        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '10px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center' }}>
          <input type="text" placeholder="Search by city, neighborhood..." style={{ background: 'transparent', color: 'white', padding: '15px 25px', border: 'none', outline: 'none', width: '400px', fontSize: '16px' }} />
          <button style={{ padding: '15px 40px', borderRadius: '18px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            Search
          </button>
        </div>
      </header>

      {/* Property Bento Grid (This makes it look expensive!) */}
      <section style={{ padding: '0 60px 100px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {properties.map(prop => (
          <div key={prop.id} style={{ backgroundColor: '#1e293b', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', transition: '0.3s', cursor: 'pointer' }}>
            <img src={prop.img} alt={prop.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '5px' }}>{prop.price}</p>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>{prop.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>{prop.location}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}

export default App;