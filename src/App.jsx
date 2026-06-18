import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Cpu, ShoppingCart, Activity, Zap, Search, UploadCloud, ShieldCheck, Tag, Filter, Plus, X, ImageIcon, CheckCircle, Loader, MessageCircle, User, Camera, AlertTriangle, RefreshCw, Play, FileText, Layout, Eye, MapPin, Menu, LogOut, LogIn } from 'lucide-react';
import { LoginPage, RegisterPage } from './Auth';
import { useAuth } from './AuthContext';
import UserPortal from './UserPortal';

// --- Components ---

const ProfileMenu = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div ref={menuRef} style={{ position: 'relative' }} className="desktop-only-btn">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'var(--accent-primary)', 
          color: '#fff', 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          border: 'none', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        {initials}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '52px',
          right: '0',
          background: 'var(--bg-main)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '16px',
          minWidth: '220px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-dark)', wordBreak: 'break-word', lineHeight: '1.2' }}>{user.full_name}</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user.email}</p>
          </div>
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
          <Link to="/portal" style={{ textDecoration: 'none', color: 'var(--text-dark)', padding: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
            <User size={16} style={{ marginRight: '8px' }} /> Dashboard Akun
          </Link>
          <button onClick={logout} className="btn btn-outline" style={{ width: '100%', padding: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <LogOut size={16} style={{ marginRight: '8px' }} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Leaf size={20} /> },
    { path: '/workspace', label: 'Scanner', icon: <Cpu size={20} /> },
    { path: '/mart', label: 'E-Mart', icon: <ShoppingCart size={20} /> },
    { path: '/tracker', label: 'Tracker', icon: <Activity size={20} /> },
  ];

  const renderNavLinks = (isMobile) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? 'active' : ''}
          onClick={() => setIsOpen(false)}
        >
          {item.icon} <span>{item.label}</span>
        </Link>
      ))}
      {isMobile && (
        <Link to="/workspace" className="btn btn-primary mobile-only-btn" onClick={() => setIsOpen(false)}>
          Mulai Scan
        </Link>
      )}
    </>
  );

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
            <Zap color="var(--accent-primary)" fill="var(--accent-primary)" size={28} />
            E-Volve
          </Link>
          
          <div className="nav-links desktop-only-links">
            {renderNavLinks(false)}
          </div>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            {user ? (
              <ProfileMenu user={user} logout={logout} />
            ) : (
              <div className="desktop-only-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Masuk
                </Link>
              </div>
            )}
            
            <Link to="/workspace" className="btn btn-primary desktop-only-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Mulai Scan
            </Link>
            
            <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} color="var(--text-dark)"/> : <Menu size={24} color="var(--text-dark)"/>}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="mobile-overlay"
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
            background: 'rgba(0,0,0,0.4)', zIndex: 98, backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`nav-links mobile-drawer ${isOpen ? 'open' : ''}`} style={{ zIndex: 99 }}>
        {renderNavLinks(true)}
      </div>
    </>
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

    {/* Section: Cara Kerja E-Volve */}
    <div style={{ marginTop: '80px' }}>
      <div className="text-center mb-4">
        <h2>Cara Kerja <span className="gradient-text">E-Volve</span></h2>
        <p>Ubah perangkat mati Anda menjadi uang tunai dalam 3 langkah mudah.</p>
      </div>
      <div className="grid-3">
        <div className="glass-card text-center">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <Camera size={32} color="var(--accent-primary)" />
          </div>
          <h3>1. Pindai Perangkat</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Gunakan AI Scanner kami untuk memfoto perangkat elektronik bekas Anda. AI akan mengidentifikasi model dan menaksir harga komponen.</p>
        </div>
        <div className="glass-card text-center">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <Cpu size={32} color="var(--accent-primary)" />
          </div>
          <h3>2. Bongkar Aman</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ikuti panduan bongkar (teardown) langkah demi langkah yang aman. Kami memberi tahu Anda risiko keselamatan secara realtime.</p>
        </div>
        <div className="glass-card text-center">
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <ShoppingCart size={32} color="var(--accent-primary)" />
          </div>
          <h3>3. Jual Komponen</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Komponen yang berhasil dibongkar dan terverifikasi AI dapat langsung Anda jual ke E-Mart E-Volve ke komunitas teknisi.</p>
        </div>
      </div>
    </div>

    {/* Section: Keuntungan */}
    <div style={{ marginTop: '80px', marginBottom: '40px' }}>
      <div className="text-center mb-4">
        <h2>Keuntungan Menggunakan <span className="gradient-text">E-Volve</span></h2>
        <p>Solusi cerdas untuk lingkungan dan dompet Anda.</p>
      </div>
      <div className="grid-2">
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Nilai Ekonomis Maksimal</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Komponen hidup bernilai jauh lebih tinggi jika dijual satuan dibandingkan menjual perangkat mati sebagai rongsokan.</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Verifikasi AI Terpercaya</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Pembeli merasa aman karena kondisi komponen telah dipindai dan diverifikasi oleh sistem AI E-Volve.</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <Leaf size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Kurangi E-Waste</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Anda berkontribusi langsung menurunkan jumlah limbah beracun ke tempat pembuangan akhir mendukung sirkular ekonomi.</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <MapPin size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0' }}>Koneksi Hyper-lokal</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Temukan pembeli komponen di sekitar Anda. Mengurangi biaya pengiriman dan menekan jejak karbon operasional.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Gemini API Call Helper ---
const callGeminiAPI = async (base64Image) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key Gemini tidak ditemukan. Harap tambahkan VITE_GEMINI_API_KEY ke file .env");
  }

  const prompt = `Anda adalah AI E-Waste Teardown Expert dari E-Volve.
Misi Anda adalah menganalisis gambar perangkat elektronik mati ini dan memberikan panduan daur ulang sirkular secara mendetail.

Kembalikan respon hanya berupa JSON dengan format persis seperti ini:
{
  "name": "Nama lengkap dan model perangkat (contoh: Apple MacBook Pro 13\\\" 2015)",
  "releaseYear": "Tahun rilis perangkat",
  "safetyRiskLevel": "low" | "medium" | "high" | "critical" (Gunakan "critical" jika ada komponen rusak berat, baterai kembung/bocor, atau kapasitor tegangan tinggi yang berbahaya dibongkar sendiri),
  "hardBlockWarning": "Jika safetyRiskLevel 'critical', berikan penjelasan bahaya yang mendalam mengapa pengguna dilarang membongkar sendiri. Jika tidak critical, isi string kosong \\\"\\\"",
  "components": [
    {
      "name": "Nama komponen (contoh: Samsung 8GB DDR3 RAM, 256GB PCIe SSD, LCD Display Panel)",
      "category": "RAM" | "Storage" | "Display" | "Network" | "Other",
      "estimatedPriceIdr": "Estimasi harga pasar copotan dalam Rupiah (contoh: Rp 300.000)",
      "confidence": "Persentase keyakinan AI (contoh: 95%)"
    }
  ],
  "teardownGuide": {
    "textGuide": [
      "Langkah 1: Matikan daya sepenuhnya dan lepas semua kabel...",
      "Langkah 2: Gunakan obeng Pentalobe untuk melepas sekrup casing...",
      "Langkah 3: Lepaskan konektor baterai dari motherboard..."
    ],
    "diagramDescription": [
      "Motherboard terletak di bagian tengah bawah perangkat.",
      "Baterai menempati 60% area bawah terlindung pelat besi."
    ],
    "videoWalkthrough": "Panduan video: Cari di YouTube dengan keyword 'Panduan membongkar [Nama Perangkat]' dan pastikan memakai alat anti-statis. Fokus pada bagian konektor baterai terlebih dahulu."
  }
}

Aturan penting:
1. JANGAN membungkus output JSON dalam format markdown \`\`\`json. Output harus berupa raw string JSON yang valid agar langsung dapat di-parse dengan JSON.parse().
2. Deskripsi komponen dan instruksi harus jelas, profesional, dan dalam Bahasa Indonesia.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API error dengan status code ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("API Gemini mengembalikan respon kosong.");
  }

  let jsonString = text.trim();
  
  // Membersihkan format markdown seperti ```json ... ``` jika masih terbawa
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3);
  }
  
  // Memastikan kita hanya memparsing objek JSON yang valid (mulai { dan diakhiri })
  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    jsonString = jsonString.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonString.trim());
  } catch (error) {
    console.error("Gagal parse JSON dari Gemini:", jsonString);
    throw new Error("Format respons tidak valid dari AI. Coba pindai ulang.");
  }
};

const UserWorkspace = ({ addProduct }) => {
  const [scanState, setScanState] = useState('idle');
  const [deviceData, setDeviceData] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [errorMsg, setErrorMsg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    setErrorMsg('');
    setScanState('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      setScanState('idle');
      setErrorMsg("Kamera tidak dapat diakses atau diblokir. Harap gunakan fitur upload foto.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      
      stopCamera();
      
      const base64Data = dataUrl.split(',')[1];
      runAnalysis(base64Data);
    }
  };

  const handleFileUpload = (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setCapturedImage(dataUrl);
      const base64Data = dataUrl.split(',')[1];
      runAnalysis(base64Data);
    };
    reader.onerror = () => {
      setErrorMsg("Gagal membaca file.");
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Data) => {
    setScanState('scanning');
    try {
      const parsedData = await callGeminiAPI(base64Data);
      setDeviceData(parsedData);
      setScanState('result');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses gambar.");
      setScanState('error');
    }
  };

  const handleSellComponent = (comp) => {
    const newProduct = {
      name: comp.name,
      category: comp.category,
      price: comp.estimatedPriceIdr,
      condition: 'AI Scan Verified',
      desc: `Komponen copotan dari perangkat ${deviceData.name}. Lolos scan fisik dan terverifikasi oleh E-Volve AI.`,
      aiVerified: true,
      sold: false,
      seller: 'Saya (Penjual)',
      image_url: null,
      latitude: null,
      longitude: null
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          newProduct.latitude = pos.coords.latitude;
          newProduct.longitude = pos.coords.longitude;
          addProduct(newProduct);
          navigate('/mart');
        },
        (err) => {
          console.error("Geolocation error:", err);
          addProduct(newProduct);
          navigate('/mart');
        }
      );
    } else {
      addProduct(newProduct);
      navigate('/mart');
    }
  };

  const getSafetyBadgeStyle = (level) => {
    switch(level) {
      case 'low':
        return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'medium':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'high':
        return { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'critical':
        return { background: '#ef4444', color: 'white', border: '1px solid #ef4444' };
      default:
        return { background: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', border: '1px solid rgba(107, 114, 128, 0.3)' };
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  return (
    <div className="app-container page-section animate-fade-in">
      <div className="text-center mb-4">
        <h2>AI Camera Scanner & Teardown</h2>
        <p>Arahkan kamera ke perangkat elektronik Anda atau unggah foto untuk mendeteksi komponen berharga dan panduan pembongkaran aman secara realtime.</p>
      </div>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px 24px',
          borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', maxWidth: '600px',
          margin: '0 auto 32px auto', display: 'flex', gap: '12px', alignItems: 'center'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{errorMsg}</span>
        </div>
      )}

      {scanState === 'idle' && (
        <div className="glass-card text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div style={{ padding: '24px', background: 'rgba(16,185,129,0.05)', borderRadius: '24px', border: '1px dashed rgba(16,185,129,0.2)', flex: '1 1 200px' }}>
              <Camera size={64} color="var(--accent-primary)" style={{ marginBottom: '16px', margin: '0 auto 16px auto' }} />
              <h3>Gunakan Live Kamera</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '24px' }}>Pindai perangkat Anda secara langsung lewat kamera laptop/HP.</p>
              <button className="btn btn-primary" onClick={startCamera}>
                <Camera size={18} style={{ marginRight: '8px' }} /> Buka Kamera
              </button>
            </div>
            
            <div style={{ padding: '24px', background: 'rgba(16,185,129,0.05)', borderRadius: '24px', border: '1px dashed rgba(16,185,129,0.2)', flex: '1 1 200px' }}>
              <UploadCloud size={64} color="var(--accent-primary)" style={{ marginBottom: '16px', margin: '0 auto 16px auto' }} />
              <h3>Unggah Foto</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '24px' }}>Ambil file dari galeri penyimpanan perangkat Anda.</p>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={18} style={{ marginRight: '8px' }} /> Pilih File
              </button>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Format yang didukung: JPG, PNG, WEBP. Maks 5MB.</span>
        </div>
      )}

      {scanState === 'camera' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', background: '#000', borderRadius: '24px', border: '3px solid var(--accent-primary)' }}>
            <div className="scanner-line"></div>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 20 }}>
              <span className="badge" style={{ background: 'rgba(17,24,39,0.8)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
                <Loader size={12} className="animate-spin" style={{ marginRight: '6px' }} /> Live Scanner Ready
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-outline" onClick={() => { stopCamera(); setScanState('idle'); }}>
              Batal
            </button>
            <button className="btn btn-primary" onClick={capturePhoto}>
              <Camera size={18} style={{ marginRight: '8px' }} /> Ambil Gambar & Scan
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="text-center" style={{ padding: '80px 0' }}>
          {capturedImage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <img 
                src={capturedImage} 
                alt="Captured Device" 
                style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '16px', border: '3px solid var(--accent-primary)', boxShadow: 'var(--shadow-glow)' }} 
              />
            </div>
          )}
          <div className="badge mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <ShieldCheck size={14} style={{ marginRight: '6px' }} /> Gemini Vision API Active
          </div>
          <h3 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Menganalisis Perangkat...</h3>
          <p>Mengidentifikasi model, menaksir harga komponen, dan memverifikasi keselamatan.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <Loader size={48} className="animate-spin" color="var(--accent-primary)" />
          </div>
        </div>
      )}

      {scanState === 'error' && (
        <div className="glass-card text-center" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '24px', margin: '0 auto 24px auto' }} />
          <h3>Proses Pindaian Gagal</h3>
          <p style={{ fontSize: '0.95rem' }}>{errorMsg || "Terjadi kesalahan yang tidak diketahui saat memproses foto."}</p>
          <button className="btn btn-primary mt-4" onClick={() => setScanState('idle')}>
            <RefreshCw size={18} style={{ marginRight: '8px' }} /> Coba Pindai Ulang
          </button>
        </div>
      )}

      {scanState === 'result' && deviceData && (
        <div className="animate-fade-in">
          {/* Header Info */}
          <div className="glass-card mb-4 flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Scanned Device" 
                  style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-light)' }} 
                />
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>Teridentifikasi AI</span>
                  <span className="badge" style={getSafetyBadgeStyle(deviceData.safetyRiskLevel)}>
                    Safety: {deviceData.safetyRiskLevel.toUpperCase()}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '4px', margin: 0 }}>{deviceData.name}</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tahun Rilis: {deviceData.releaseYear}</span>
              </div>
            </div>
            {deviceData.safetyRiskLevel !== 'critical' && (
              <div style={{ textAlign: 'right', minWidth: '180px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimasi Total Nilai Jual</span>
                <h3 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.25rem)', margin: 0, fontWeight: '800' }}>
                  {deviceData.components?.length > 0 
                    ? `Rp ${deviceData.components.reduce((acc, curr) => {
                        const val = parseInt(curr.estimatedPriceIdr.replace(/[^0-9]/g, '')) || 0;
                        return acc + val;
                      }, 0).toLocaleString('id-ID')}`
                    : 'Rp 0'}
                </h3>
              </div>
            )}
          </div>

          {/* If Safety is CRITICAL -> HARD BLOCK warning */}
          {deviceData.safetyRiskLevel === 'critical' ? (
            <div className="glass-card text-center animate-fade-in" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.02)', padding: '48px 32px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto', boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)' }}>
                <AlertTriangle size={40} />
              </div>
              <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>KUNCI KEAMANAN: Pembongkaran Dilarang (Hard-Block)</h2>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <p style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '16px' }}>
                  Sistem mendeteksi komponen atau kondisi berisiko tinggi pada perangkat ini:
                </p>
                <div style={{ background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '32px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Detail Bahaya: </span>
                  <span style={{ color: 'var(--text-muted)' }}>{deviceData.hardBlockWarning || "Bahaya kegagalan baterai, kebocoran zat kimia berbahaya, atau kapasitor tegangan tinggi terdeteksi."}</span>
                </div>
                <p style={{ fontSize: '0.95rem' }}>
                  Untuk keselamatan Anda, langkah pembongkaran mandiri dinonaktifkan. Silakan serahkan perangkat ini secara utuh ke drop-point daur ulang elektronik terdekat atau hubungi profesional.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={() => setScanState('idle')}>
                  <RefreshCw size={16} style={{ marginRight: '8px' }} /> Scan Perangkat Lain
                </button>
                <a 
                  href="https://www.google.com/maps/search/electronic+waste+recycle+center" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25)' }}
                >
                  <MapPin size={16} style={{ marginRight: '8px' }} /> Cari Drop-point Terdekat
                </a>
              </div>
            </div>
          ) : (
            /* Standard Flow: Teardown & Components list */
            <div className="grid-2">
              {/* Left Column: Adaptive Learning Teardown Guide */}
              <div>
                <div className="flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.35rem', margin: 0, textAlign: 'left' }}>Panduan Pembongkaran</h3>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: '99px', border: '1px solid var(--border-light)' }}>
                    <button 
                      onClick={() => setActiveTab('text')}
                      className="btn" 
                      style={{ padding: '8px 16px', fontSize: '0.8rem', background: activeTab === 'text' ? 'white' : 'transparent', color: activeTab === 'text' ? 'var(--text-dark)' : 'var(--text-muted)', boxShadow: activeTab === 'text' ? 'var(--shadow-soft)' : 'none' }}
                    >
                      <FileText size={14} style={{ marginRight: '6px' }} /> Teks
                    </button>
                    <button 
                      onClick={() => setActiveTab('diagram')}
                      className="btn" 
                      style={{ padding: '8px 16px', fontSize: '0.8rem', background: activeTab === 'diagram' ? 'white' : 'transparent', color: activeTab === 'diagram' ? 'var(--text-dark)' : 'var(--text-muted)', boxShadow: activeTab === 'diagram' ? 'var(--shadow-soft)' : 'none' }}
                    >
                      <Layout size={14} style={{ marginRight: '6px' }} /> Skema
                    </button>
                    <button 
                      onClick={() => setActiveTab('video')}
                      className="btn" 
                      style={{ padding: '8px 16px', fontSize: '0.8rem', background: activeTab === 'video' ? 'white' : 'transparent', color: activeTab === 'video' ? 'var(--text-dark)' : 'var(--text-muted)', boxShadow: activeTab === 'video' ? 'var(--shadow-soft)' : 'none' }}
                    >
                      <Play size={14} style={{ marginRight: '6px' }} /> Video
                    </button>
                  </div>
                </div>

                <div className="glass-card" style={{ marginBottom: '24px' }}>
                  {activeTab === 'text' && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {deviceData.teardownGuide?.textGuide?.map((step, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
                          <div style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-primary)', display: 'flex', 
                            justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0,
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                          }}>
                            {idx + 1}
                          </div>
                          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-dark)', fontSize: '0.95rem', textAlign: 'left' }}>{step}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'diagram' && (
                    <div>
                      <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-muted)', textAlign: 'left' }}>Representasi visual letak komponen internal yang terdeteksi AI E-Volve:</p>
                      <div className="diagram-container" style={{
                        background: '#111827', color: '#10b981', padding: '24px', borderRadius: '16px',
                        fontFamily: 'monospace', border: '1px solid rgba(16, 185, 129, 0.3)', minHeight: '200px', textAlign: 'left'
                      }}>
                        <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.6, borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '8px', marginBottom: '16px' }}>
                          E-Volve Spatial Diagnostic Layout v1.0
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {deviceData.teardownGuide?.diagramDescription?.map((desc, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                              <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'video' && (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <Play size={48} color="var(--accent-primary)" style={{ marginBottom: '16px', margin: '0 auto 16px auto' }} />
                      <h4 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>Rekomendasi Video Tutorial</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                        {deviceData.teardownGuide?.videoWalkthrough || "Tonton panduan visual lengkap dari pembuat konten tepercaya di komunitas kami."}
                      </p>
                      <a 
                        href={`https://www.youtube.com/results?search_query=how+to+teardown+disassemble+${encodeURIComponent(deviceData.name)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline"
                      >
                        <Search size={16} style={{ marginRight: '8px' }} /> Cari di YouTube
                      </a>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
                  <button className="btn btn-outline" onClick={() => setScanState('idle')}>
                    <RefreshCw size={16} style={{ marginRight: '8px' }} /> Scan Ulang
                  </button>
                </div>
              </div>

              {/* Right Column: Component ID Engine & pricing */}
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '24px', textAlign: 'left' }}>Komponen Terdeteksi & Estimasi Harga</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {deviceData.components?.map((comp, idx) => (
                    <div key={idx} className="glass-card flex-mobile-col" style={{ padding: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', textAlign: 'left' }}>
                        <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '12px', flexShrink: 0, color: 'var(--accent-primary)' }}>
                          {comp.category === 'RAM' ? <Cpu size={24} /> :
                           comp.category === 'Storage' ? <UploadCloud size={24} /> :
                           comp.category === 'Display' ? <Eye size={24} /> :
                           <Activity size={24} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontWeight: 'bold' }}>{comp.category}</span>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{comp.confidence} Match</span>
                          </div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{comp.name}</h4>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.05rem' }}>{comp.estimatedPriceIdr}</span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        onClick={() => handleSellComponent(comp)}
                      >
                        Jual di E-Mart
                      </button>
                    </div>
                  ))}
                  {(!deviceData.components || deviceData.components.length === 0) && (
                    <div className="glass-card text-center" style={{ color: 'var(--text-muted)' }}>
                      Tidak ada komponen bernilai jual tinggi yang terdeteksi di luar kerangka dasar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Data ditarik dari API backend PostgreSQL

const EMart = ({ products, setProducts, fetchProducts }) => {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  // Smart Listing Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingStep, setListingStep] = useState('idle');
  const [newListing, setNewListing] = useState(null);

  // Hyper-Local Search State
  const [locationState, setLocationState] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (locationState.lat && locationState.lng) {
      fetchProducts(locationState.lat, locationState.lng, radius);
    } else {
      fetchProducts();
    }
  }, [locationState, radius]);

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

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setShowToast('Browser Anda tidak mendukung fitur lokasi.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationState({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        setShowToast('Lokasi berhasil ditemukan!');
        setTimeout(() => setShowToast(''), 3000);
      },
      (err) => {
        console.error(err);
        setShowToast('Gagal mendapatkan lokasi. Pastikan izin GPS diberikan.');
        setIsLocating(false);
        setTimeout(() => setShowToast(''), 3000);
      }
    );
  };

  const handleSimulateAI = () => {
    setListingStep('analyzing');
    setTimeout(() => {
      setNewListing({
        name: 'Crucial 8GB DDR3L 1600MHz Mac Compatible',
        category: 'RAM',
        price: 'Rp 225.000',
        condition: 'Mulus, Pin Bersih',
        desc: 'Gemini Vision mendeteksi IC RAM utuh tanpa bekas gosong. Kompatibel untuk upgrade MacBook Pro lawas.',
        aiVerified: true,
        sold: false,
        seller: 'Anda',
        image_url: '/assets/components/ram.png'
      });
      setListingStep('result');
    }, 2500);
  };

  const publishListing = async () => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newListing.name,
          category: newListing.category,
          price: newListing.price,
          condition: newListing.condition,
          description: newListing.desc,
          ai_verified: newListing.aiVerified,
          sold: false,
          seller: newListing.seller,
          image_url: newListing.image_url || null,
          latitude: locationState.lat || null,
          longitude: locationState.lng || null
        })
      });
      if (res.ok) {
        const savedListing = await res.json();
        setProducts([savedListing, ...products]);
        setIsModalOpen(false);
        setListingStep('idle');
        setNewListing(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async (product) => {
    setSelectedProduct(product);
    setCheckoutStep('processing');
    
    try {
      const res = await fetch('/api/payment/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price
        })
      });
      
      const { token } = await res.json();
      
      window.snap.pay(token, {
        onSuccess: async function(result) {
          try {
            await fetch(`/api/products/${product.id}/sold`, { 
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ buyer_id: user ? user.id : null })
            });
            setProducts(products.map(p => p.id === product.id ? { ...p, sold: true } : p));
            setCheckoutStep('success');
            setShowToast('Pembayaran Berhasil! Mengontak penjual...');
            setTimeout(() => setShowToast(''), 3000);
          } catch (e) {
            console.error(e);
            setCheckoutStep('error');
          }
        },
        onPending: function(result) {
          setShowToast('Menunggu pembayaran diselesaikan...');
          setCheckoutStep('idle');
          setTimeout(() => setShowToast(''), 3000);
        },
        onError: function(result) {
          setShowToast('Pembayaran gagal.');
          setCheckoutStep('idle');
          setTimeout(() => setShowToast(''), 3000);
        },
        onClose: function() {
          setShowToast('Pop-up pembayaran ditutup sebelum selesai.');
          setCheckoutStep('idle');
          setTimeout(() => setShowToast(''), 3000);
        }
      });
    } catch (e) {
      console.error(e);
      setCheckoutStep('error');
      setShowToast('Gagal memuat sistem pembayaran.');
      setTimeout(() => setShowToast(''), 3000);
    }
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

      {/* Hyper-Local Search Filter */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: locationState.lat ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)', border: locationState.lat ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-light)' }}>
        <div className="flex-mobile-col" style={{ justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--accent-primary)" /> Hyper-Local Search
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Cari komponen terdekat untuk hemat ongkos kirim.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
            {locationState.lat ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Radius: {radius} km</label>
                  <input 
                    type="range" 
                    min="5" max="50" step="5" 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--accent-primary)', width: '120px' }}
                  />
                </div>
                <button className="btn btn-outline" onClick={() => { setLocationState({lat: null, lng: null}); setShowToast('Pencarian area dimatikan.'); setTimeout(() => setShowToast(''), 3000); }} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <X size={16} style={{ marginRight: '6px' }} /> Matikan
                </button>
              </>
            ) : (
              <button className="btn btn-outline" onClick={handleGetLocation} disabled={isLocating} style={{ padding: '10px 20px', fontSize: '0.9rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                {isLocating ? <Loader size={16} className="animate-spin" style={{ marginRight: '8px' }} /> : <MapPin size={16} style={{ marginRight: '8px' }} />}
                {isLocating ? 'Mencari...' : 'Gunakan Lokasi Saat Ini'}
              </button>
            )}
          </div>
        </div>
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
            <div style={{ height: '180px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                p.category === 'RAM' ? <Cpu size={80} color="var(--text-muted)" opacity={0.15} /> :
                p.category === 'Storage' ? <UploadCloud size={80} color="var(--text-muted)" opacity={0.15} /> :
                p.category === 'Display' ? <Eye size={80} color="var(--text-muted)" opacity={0.15} /> :
                <Zap size={80} color="var(--text-muted)" opacity={0.15} />
              )}
               
               {p.sold && (
                 <div style={{ position: 'absolute', background: 'rgba(17,24,39,0.8)', color: 'white', padding: '8px 24px', borderRadius: '99px', fontWeight: 'bold', letterSpacing: '2px', zIndex: 10 }}>
                   TERJUAL
                 </div>
               )}
            </div>
            <div style={{ padding: 'clamp(16px, 4vw, 24px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(p.aiVerified || p.ai_verified) && (
                    <div className="badge" style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                      <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      AI Verified
                    </div>
                  )}
                  {p.distance != null && (
                    <div className="badge" style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      {parseFloat(p.distance).toFixed(1)} km
                    </div>
                  )}
                </div>
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-dark)' }}>{p.name}</h4>
              <p style={{ fontSize: '0.9rem', margin: '0 0 16px 0', color: 'var(--text-muted)', flex: 1 }}>{p.desc || p.description}</p>
              
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
        <Leaf size={80} color="var(--accent-primary)" style={{ marginBottom: '32px', margin: '0 auto 32px auto' }} />
        <h3 className="gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 4rem)', lineHeight: '1' }}>3.2 Kg</h3>
        <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', marginTop: '16px', color: 'var(--text-dark)', fontWeight: '500' }}>Limbah Elektronik Diselamatkan</p>
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '500' }}>
            Setara dengan menanam <span style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>4 pohon</span> 🌱
          </p>
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '24px', textAlign: 'left' }}>Riwayat Kontribusi</h3>
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

const Footer = () => (
  <footer style={{ background: '#111827', color: '#f3f4f6', padding: '48px 24px 24px 24px', marginTop: '64px' }}>
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '40px' }}>
      <div>
        <div className="logo" style={{ color: 'white', marginBottom: '16px' }}>
          <Zap color="var(--accent-primary)" fill="var(--accent-primary)" size={24} />
          E-Volve
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Platform sirkular ekonomi terdepan untuk mengurangi e-waste dan mengubah perangkat mati menjadi nilai nyata.
        </p>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.05rem' }}>Ekosistem</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><Link to="/workspace" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>AI Scanner</Link></li>
          <li><Link to="/mart" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>E-Mart</Link></li>
          <li><Link to="/tracker" style={{ color: '#9ca3af', transition: 'color 0.2s' }}>Eco Tracker</Link></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.05rem' }}>Hubungi Kami</h4>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '8px' }}>support@e-volve.com</p>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>+62 811 2345 6789</p>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #374151', paddingTop: '24px', textAlign: 'center' }}>
      <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
        &copy; {new Date().getFullYear()} E-Volve. Hak Cipta Dilindungi.
      </p>
    </div>
  </footer>
);

function App() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  const fetchProducts = (lat, lng, radius) => {
    let url = '/api/products';
    if (lat && lng && radius) {
      url += `?lat=${lat}&lng=${lng}&radius=${radius}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          condition: newProduct.condition,
          description: newProduct.desc || newProduct.description,
          ai_verified: newProduct.aiVerified || newProduct.ai_verified || false,
          sold: false,
          seller: newProduct.seller,
          seller_id: user ? user.id : null,
          image_url: newProduct.image_url || null,
          latitude: newProduct.latitude || null,
          longitude: newProduct.longitude || null
        })
      });
      if (res.ok) {
        const savedProduct = await res.json();
        setProducts(prev => [savedProduct, ...prev]);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/portal" element={<UserPortal />} />
        <Route path="/workspace" element={<UserWorkspace addProduct={addProduct} />} />
        <Route path="/mart" element={<EMart products={products} setProducts={setProducts} fetchProducts={fetchProducts} />} />
        <Route path="/tracker" element={<EcoTracker />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
