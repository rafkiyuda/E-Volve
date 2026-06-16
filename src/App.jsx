import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, Cpu, ShoppingCart, Activity, Zap, Search, UploadCloud, ShieldCheck, Tag, Filter, Plus, X, ImageIcon, CheckCircle, Loader, MessageCircle, User } from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Home', icon: <Leaf size={20} /> },
    { path: '/workspace', label: 'Scanner', icon: <Cpu size={20} /> },
    { path: '/mart', label: 'E-Mart', icon: <ShoppingCart size={20} /> },
    { path: '/tracker', label: 'Tracker', icon: <Activity size={20} /> },
  ];

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="logo">
          <Zap color="var(--accent-primary)" fill="var(--accent-primary)" size={28} />
          E-Volve
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <Link to="/workspace" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
          Mulai Scan
        </Link>
      </nav>
    </div>
  );
};

// --- Pages ---

const LandingPage = () => (
  <div className="app-container page-section animate-fade-in">
    <div className="hero grid-2">
      <div>
        <div className="badge mb-4">Masa Depan Circular Economy</div>
        <h1>
          Evolusi Limbah Elektronik Menjadi <span className="gradient-text">Nilai Nyata</span>
        </h1>
        <p>
          Jangan biarkan laptop atau gadget lama Anda menjadi tumpukan sampah beracun.
          Pindai, bongkar, dan jual komponen berharga dengan panduan AI E-Volve.
        </p>
        <div className="flex-mobile-col">
          <Link to="/workspace" className="btn btn-primary">
            Coba Scanner AI
          </Link>
          <Link to="/mart" className="btn btn-outline">
            Jelajahi E-Mart
          </Link>
        </div>
      </div>
      <div className="flex-center">
        <div className="glass-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', 
            background: 'var(--accent-primary)', padding: '16px', borderRadius: '50%',
            boxShadow: '0 10px 25px rgba(16,185,129,0.4)'
          }}>
            <Leaf color="white" size={32} />
          </div>
          <h3>Dampak Kita Hari Ini</h3>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Limbah Diselamatkan</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>14,520 Kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Komponen Terjual</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>8,432 Unit</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Jejak Karbon Berkurang</span>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>42.5 Ton</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UserWorkspace = () => {
  const [scanState, setScanState] = useState('idle');
  const [deviceData, setDeviceData] = useState(null);

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setDeviceData({
        name: 'MacBook Pro (Retina, 13-inch, 2015)',
        release: '2015',
        components: [
          { name: '8GB DDR3 RAM', value: 'Rp 250.000', icon: <Cpu /> },
          { name: '256GB PCIe SSD', value: 'Rp 450.000', icon: <UploadCloud /> },
          { name: 'Retina Display Panel', value: 'Rp 1.200.000', icon: <Zap /> },
        ],
        teardown: [
          'Matikan perangkat dan lepaskan 10 sekrup pentalobe di panel bawah.',
          'Angkat panel bawah perlahan dari arah engsel.',
          'Gunakan spudger plastik untuk melepaskan konektor baterai pada logic board.',
          'Buka sekrup Torx T5 dan tarik SSD sejajar dengan motherboard.'
        ]
      });
      setScanState('result');
    }, 3000);
  };

  return (
    <div className="app-container page-section animate-fade-in">
      <div className="text-center mb-4">
        <h2>User Workspace</h2>
        <p>Unggah foto perangkat atau nomor seri untuk dianalisis oleh Gemini AI.</p>
      </div>

      {scanState === 'idle' && (
        <div className="glass-card text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(40px, 8vw, 64px) clamp(20px, 4vw, 32px)' }}>
          <UploadCloud size={64} color="var(--accent-primary)" style={{ marginBottom: '24px' }} />
          <h3 style={{ marginBottom: '8px' }}>Scan Perangkat Anda</h3>
          <p>Format: JPG, PNG, WEBP. Maks 5MB.</p>
          <button className="btn btn-primary mt-4" onClick={handleScan}>
            <Search size={18} style={{ marginRight: '8px' }} /> Analisis dengan Gemini
          </button>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="text-center" style={{ padding: '100px 0' }}>
          <div className="badge mb-4">Gemini Vision Active</div>
          <h3 className="gradient-text">Memproses Gambar X-Ray...</h3>
          <p>Mengidentifikasi spesifikasi pabrik dan valuasi komponen.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <Cpu size={56} className="animate-fade-in" color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.6))' }} />
          </div>
        </div>
      )}

      {scanState === 'result' && deviceData && (
        <div className="animate-fade-in">
          <div className="glass-card mb-4 flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="badge mb-4">Teridentifikasi</div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>{deviceData.name}</h2>
              <p style={{ margin: 0 }}>Tahun Rilis: {deviceData.release}</p>
            </div>
            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Estimasi Valuasi Total</span>
              <h3 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginTop: '4px', margin: 0 }}>Rp 1.900.000</h3>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '24px' }}>Panduan Pembongkaran</h3>
              <div className="glass-card">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {deviceData.teardown.map((step, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-primary)', display: 'flex', 
                        justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0,
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        {idx + 1}
                      </div>
                      <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-dark)' }}>{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '24px' }}>Komponen Potensial Dijual</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {deviceData.components.map((comp, idx) => (
                  <div key={idx} className="glass-card flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                      <div style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '16px', flexShrink: 0 }}>
                        {comp.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-dark)' }}>{comp.name}</h4>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{comp.value}</span>
                      </div>
                    </div>
                    <Link to="/mart" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                      Jual di E-Mart
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Initial Mock Data for E-Mart ---
const mockProducts = [
  { id: 1, name: 'Samsung 16GB DDR4 3200MHz SODIMM', category: 'RAM', price: 'Rp 450.000', condition: '98% Normal', desc: 'Copotan laptop gaming Asus ROG. Pin mulus, lolos stress test AI.', aiVerified: true, sold: false, seller: 'TechnoJunkie_99' },
  { id: 2, name: 'WD Blue SN550 500GB NVMe SSD', category: 'Storage', price: 'Rp 550.000', condition: 'Health 95%', desc: 'Health status terbaca 95% via CrystalDiskInfo. Suhu normal.', aiVerified: true, sold: false, seller: 'EcoStore.id' },
  { id: 3, name: 'Panel Layar BOE 14.0" FHD IPS 60Hz', category: 'Display', price: 'Rp 850.000', condition: 'Tanpa Dead Pixel', desc: 'Layar mulus tanpa cacat fisik. Copotan Lenovo Thinkpad.', aiVerified: true, sold: false, seller: 'PartLestari' },
  { id: 4, name: 'Intel Dual Band Wireless-AC 8265', category: 'Network', price: 'Rp 120.000', condition: 'Normal', desc: 'Kartu WiFi copotan. Sinyal stabil, mendukung frekuensi 5GHz.', aiVerified: true, sold: false, seller: 'AlexRepair' },
];

const EMart = () => {
  const [products, setProducts] = useState(mockProducts);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  
  // Smart Listing Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingStep, setListingStep] = useState('idle');
  const [newListing, setNewListing] = useState(null);

  // Product Detail State
  const [viewingProduct, setViewingProduct] = useState(null);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState('idle'); // idle, processing, success
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Chat Overlay Toast
  const [showToast, setShowToast] = useState('');

  const categories = ['All', 'RAM', 'Storage', 'Display', 'Network'];

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSimulateAI = () => {
    setListingStep('analyzing');
    setTimeout(() => {
      setNewListing({
        id: Date.now(),
        name: 'Crucial 8GB DDR3L 1600MHz Mac Compatible',
        category: 'RAM',
        price: 'Rp 225.000',
        condition: 'Mulus, Pin Bersih',
        desc: 'Gemini Vision mendeteksi IC RAM utuh tanpa bekas gosong. Kompatibel untuk upgrade MacBook Pro lawas.',
        aiVerified: true,
        sold: false,
        seller: 'Anda'
      });
      setListingStep('result');
    }, 2500);
  };

  const publishListing = () => {
    setProducts([newListing, ...products]);
    setIsModalOpen(false);
    setListingStep('idle');
    setNewListing(null);
  };

  const handleBuy = (product) => {
    setSelectedProduct(product);
    setCheckoutStep('processing');
    setTimeout(() => {
      setProducts(products.map(p => p.id === product.id ? { ...p, sold: true } : p));
      setCheckoutStep('success');
    }, 2500);
  };

  const handleChat = () => {
    setShowToast('Membuka ruang obrolan dengan penjual...');
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="app-container page-section animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="animate-fade-in" style={{
          position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-dark)', color: 'white', padding: '12px 24px',
          borderRadius: '99px', zIndex: 9999, boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '0.9rem', fontWeight: '500'
        }}>
          <MessageCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
          {showToast}
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ textAlign: 'left', width: '100%' }}>
          <h2>E-Volve Mart</h2>
          <p style={{ margin: 0 }}>Temukan atau jual komponen copotan terverifikasi AI.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Smart Listing
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              className={`badge ${category === cat ? 'active-badge' : ''}`}
              style={{ 
                cursor: 'pointer', 
                background: category === cat ? 'var(--accent-primary)' : 'rgba(16, 185, 129, 0.05)',
                color: category === cat ? 'white' : 'var(--accent-primary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Cari komponen..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', padding: '12px 12px 12px 40px', 
              borderRadius: '99px', border: '1px solid var(--border-light)', 
              background: 'var(--bg-main)', fontFamily: 'inherit', color: 'var(--text-dark)', outline: 'none'
            }} 
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="glass-card animate-fade-in" style={{ padding: '0', display: 'flex', flexDirection: 'column', opacity: p.sold ? 0.5 : 1, filter: p.sold ? 'grayscale(100%)' : 'none' }}>
            <div style={{ height: '180px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
              {p.category === 'RAM' ? <Cpu size={80} color="var(--text-muted)" opacity={0.15} /> :
               p.category === 'Storage' ? <Activity size={80} color="var(--text-muted)" opacity={0.15} /> :
               <Zap size={80} color="var(--text-muted)" opacity={0.15} />}
               
               {p.sold && (
                 <div style={{ position: 'absolute', background: 'rgba(17,24,39,0.8)', color: 'white', padding: '8px 24px', borderRadius: '99px', fontWeight: 'bold', letterSpacing: '2px' }}>
                   TERJUAL
                 </div>
               )}
            </div>
            <div style={{ padding: 'clamp(16px, 4vw, 24px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                {p.aiVerified && (
                  <div className="badge" style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    AI Verified
                  </div>
                )}
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-dark)' }}>{p.name}</h4>
              <p style={{ fontSize: '0.9rem', margin: '0 0 16px 0', color: 'var(--text-muted)', flex: 1 }}>{p.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed var(--border-light)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '1.25rem' }}>{p.price}</span>
                <button 
                  className="btn btn-outline" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={() => p.sold ? null : setViewingProduct(p)}
                  disabled={p.sold}
                >
                  {p.sold ? 'Habis' : 'Detail'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Search size={48} opacity={0.3} style={{ marginBottom: '16px' }} />
            <p>Tidak ada komponen yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal Overlay */}
      {viewingProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(8px)', zIndex: 998,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px'
        }} onClick={() => setViewingProduct(null)}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '0', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'var(--bg-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', position: 'relative' }}>
              <button onClick={() => setViewingProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}><X size={20} /></button>
              {viewingProduct.category === 'RAM' ? <Cpu size={120} color="var(--text-muted)" opacity={0.15} /> :
               viewingProduct.category === 'Storage' ? <Activity size={120} color="var(--text-muted)" opacity={0.15} /> :
               <Zap size={120} color="var(--text-muted)" opacity={0.15} />}
            </div>
            <div style={{ padding: 'clamp(24px, 5vw, 32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {viewingProduct.aiVerified && (
                  <div className="badge" style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    AI Verified
                  </div>
                )}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kondisi: <strong>{viewingProduct.condition}</strong></span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: '8px' }}>{viewingProduct.name}</h2>
              <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', color: 'var(--accent-primary)', marginBottom: '24px' }}>{viewingProduct.price}</h3>
              
              <div style={{ marginBottom: '32px' }}>
                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>Spesifikasi / Deskripsi</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{viewingProduct.desc}</p>
              </div>

              {/* Seller Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <User color="white" size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-dark)' }}>{viewingProduct.seller}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aktif 2 jam lalu • Rating 4.9/5.0</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-mobile-col" style={{ gap: '16px' }}>
                <button className="btn btn-outline" style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={handleChat}>
                  <MessageCircle size={18} /> Tanya Penjual
                </button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => { setViewingProduct(null); handleBuy(viewingProduct); }}>
                  Beli Langsung
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {checkoutStep !== 'idle' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(8px)', zIndex: 999,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px'
        }}>
          <div className="glass-card animate-fade-in text-center" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
            {checkoutStep === 'processing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Loader size={48} color="var(--accent-primary)" className="animate-spin" style={{ marginBottom: '24px' }} />
                <h3>Memproses Pembayaran...</h3>
                <p>Menghubungkan ke Payment Gateway untuk <strong>{selectedProduct?.name}</strong></p>
              </div>
            )}
            {checkoutStep === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle size={64} color="var(--accent-primary)" style={{ marginBottom: '24px' }} />
                <h3>Pembayaran Berhasil!</h3>
                <p>Pesanan <strong>{selectedProduct?.name}</strong> akan segera dikirim oleh penjual.</p>
                
                <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '12px', margin: '24px 0', border: '1px solid rgba(16,185,129,0.2)', width: '100%' }}>
                  <Leaf size={24} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
                  <p style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '600' }}>Poin Eco-Tracker ditambahkan!</p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>Terima kasih telah berpartisipasi dalam Circular Economy.</span>
                </div>
                
                <button className="btn btn-primary" onClick={() => { setCheckoutStep('idle'); setSelectedProduct(null); }} style={{ width: '100%' }}>
                  Tutup & Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Smart Listing Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(8px)', zIndex: 999,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px'
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '0', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} color="var(--accent-primary)" /> One-Click Smart Listing
              </h3>
              <button onClick={() => { setIsModalOpen(false); setListingStep('idle'); setNewListing(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              {listingStep === 'idle' && (
                <div className="text-center">
                  <div style={{ width: '100%', height: '200px', border: '2px dashed var(--border-light)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', background: 'rgba(0,0,0,0.02)' }}>
                    <ImageIcon size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} opacity={0.5} />
                    <p style={{ margin: 0, fontWeight: '500' }}>Unggah Foto Komponen</p>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI akan membaca merk, seri, dan mengecek fisik</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSimulateAI} style={{ width: '100%' }}>
                    <UploadCloud size={18} style={{ marginRight: '8px' }} /> Analisis dengan Gemini Vision
                  </button>
                </div>
              )}

              {listingStep === 'analyzing' && (
                <div className="text-center" style={{ padding: '40px 0' }}>
                  <Cpu size={64} color="var(--accent-primary)" className="animate-fade-in" style={{ filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.5))', marginBottom: '24px' }} />
                  <h3 className="gradient-text">AI Copywriter Bekerja...</h3>
                  <p>Mengekstrak spesifikasi teknis dan menyarankan harga pasar yang kompetitif.</p>
                </div>
              )}

              {listingStep === 'result' && newListing && (
                <div className="animate-fade-in">
                  <div className="badge mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}><CheckCircle size={14} style={{ marginRight: '6px' }} /> AI Auto-Fill Berhasil</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Judul Produk</label>
                      <input type="text" value={newListing.name} readOnly style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontFamily: 'inherit', fontWeight: '500', color: 'var(--text-dark)' }} />
                    </div>
                    <div className="grid-2" style={{ gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Kategori</label>
                        <input type="text" value={newListing.category} readOnly style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontFamily: 'inherit', color: 'var(--text-dark)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Rekomendasi Harga</label>
                        <input type="text" value={newListing.price} readOnly style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.05)', fontFamily: 'inherit', fontWeight: '700', color: 'var(--accent-primary)' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Deskripsi Teknis (AI Generated)</label>
                      <textarea value={newListing.desc} readOnly rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontFamily: 'inherit', resize: 'none', color: 'var(--text-dark)' }} />
                    </div>
                  </div>

                  <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                    <button className="btn btn-outline" onClick={() => { setIsModalOpen(false); setListingStep('idle'); setNewListing(null); }} style={{ flex: 1 }}>Batal</button>
                    <button className="btn btn-primary" onClick={publishListing} style={{ flex: 2 }}>Publish ke E-Mart</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EcoTracker = () => (
  <div className="app-container page-section animate-fade-in">
    <div className="text-center mb-4">
      <h2>Eco-Impact Tracker</h2>
      <p>Jejak kontribusi lingkungan Anda.</p>
    </div>

    <div className="grid-2">
      <div className="glass-card text-center" style={{ padding: 'clamp(40px, 8vw, 64px) clamp(20px, 4vw, 32px)' }}>
        <Leaf size={80} color="var(--accent-primary)" style={{ marginBottom: '32px' }} />
        <h3 className="gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 4rem)', lineHeight: '1' }}>3.2 Kg</h3>
        <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', marginTop: '16px', color: 'var(--text-dark)', fontWeight: '500' }}>Limbah Elektronik Diselamatkan</p>
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '500' }}>
            Setara dengan menanam <span style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>4 pohon</span> 🌱
          </p>
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '24px' }}>Riwayat Kontribusi</h3>
        <div className="glass-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="flex-mobile-col" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>RAM 8GB DDR3 Terjual</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>2 hari yang lalu</span>
              </div>
              <div className="badge">+ 0.05 Kg</div>
            </div>
            <div className="flex-mobile-col" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>Layar Retina 13-inch Terjual</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>1 minggu yang lalu</span>
              </div>
              <div className="badge">+ 0.45 Kg</div>
            </div>
            <div className="flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>Baterai Lama Didaur Ulang</h4>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>1 bulan yang lalu</span>
              </div>
              <div className="badge">+ 0.30 Kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div style={{ padding: 0 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<UserWorkspace />} />
        <Route path="/mart" element={<EMart />} />
        <Route path="/tracker" element={<EcoTracker />} />
      </Routes>
    </div>
  );
}

export default App;
