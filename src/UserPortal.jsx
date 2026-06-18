import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { Wallet, ShoppingBag, Package, Settings, LifeBuoy, AlertCircle, CheckCircle, Clock, Layout, Home, LogOut } from 'lucide-react';

const UserPortal = () => {
  const { user, token, login } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [profileForm, setProfileForm] = useState({ full_name: '', address: '', bank_name: '', bank_account: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Ticket State
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });
  const [ticketMsg, setTicketMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user && token) {
      fetchDashboard();
      if (activeTab === 'support') fetchTickets();
    }
  }, [user, token, activeTab]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/user/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
        setProfileForm({
          full_name: user.full_name || '',
          address: data.address || '',
          bank_name: data.bank_name || '',
          bank_account: data.bank_account || ''
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfileMsg({ type: 'success', text: 'Profil berhasil diperbarui.' });
      
      const updatedUser = { ...user, full_name: profileForm.full_name };
      login(updatedUser, token);
      fetchDashboard();
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Terjadi kesalahan.' });
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(ticketForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTicketMsg({ type: 'success', text: 'Tiket bantuan berhasil dibuat.' });
      setTicketForm({ subject: '', description: '' });
      fetchTickets();
    } catch (err) {
      setTicketMsg({ type: 'error', text: err.message || 'Terjadi kesalahan.' });
    }
  };

  if (!user) return <div className="page-section flex-center"><h3>Silakan login terlebih dahulu.</h3></div>;
  if (loading || !dashboardData) return <div className="page-section flex-center"><h3>Loading data...</h3></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      
      {/* Sidebar (ERP Style - Full Height Edge) */}
      <div style={{ width: '280px', flexShrink: 0, padding: '32px 24px', background: 'var(--bg-card)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
          }}>
            {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.3' }} className="gradient-text">{user.full_name}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user.email}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', 
              background: activeTab === 'dashboard' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', 
              color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-dark)', 
              fontWeight: activeTab === 'dashboard' ? '600' : '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' 
            }}
          >
            <Layout size={20} /> Dashboard Utama
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', 
              background: activeTab === 'settings' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', 
              color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-dark)', 
              fontWeight: activeTab === 'settings' ? '600' : '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' 
            }}
          >
            <Settings size={20} /> Pengaturan Akun
          </button>
          <button 
            onClick={() => setActiveTab('support')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', 
              background: activeTab === 'support' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', 
              color: activeTab === 'support' ? 'var(--accent-primary)' : 'var(--text-dark)', 
              fontWeight: activeTab === 'support' ? '600' : '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' 
            }}
          >
            <LifeBuoy size={20} /> Bantuan & Laporan
          </button>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Home size={20} /> Kembali ke Beranda
          </Link>
          <button onClick={() => { /* Wait, I don't have logout here. Use auth context? We can use the context login(null) but useAuth provides logout maybe? No, logout is in Navbar. Let's just use home link */ }} style={{ display: 'none' }}></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px 48px', overflowY: 'auto' }}>
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ marginBottom: '8px' }}>
              <h2 style={{ margin: 0 }}>Ringkasan Akun</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Pantau saldo, pendapatan, dan riwayat aktivitas Anda.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Wallet color="#22c55e" size={32} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Saldo Dompet</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.balance || 0).toLocaleString('id-ID')}</h3>
                </div>
              </div>
              
              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <ShoppingBag color="#3b82f6" size={32} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Penjualan ({dashboardData.sales.total_items_sold})</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.sales.total_sales || 0).toLocaleString('id-ID')}</h3>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Package color="#a855f7" size={32} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pembelian ({dashboardData.purchases.total_items_bought})</p>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.purchases.total_purchases || 0).toLocaleString('id-ID')}</h3>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>Riwayat Transaksi Terbaru</h3>
              {dashboardData.history.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
                  <Package size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Belum ada riwayat transaksi yang tercatat.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Tanggal</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Jenis</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Produk</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Nominal</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.history.map((tx) => {
                        const isBuyer = tx.buyer_id === user.id;
                        return (
                          <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '16px' }}>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', background: isBuyer ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: isBuyer ? '#a855f7' : '#3b82f6' }}>
                                {isBuyer ? 'Beli' : 'Jual'}
                              </span>
                            </td>
                            <td style={{ padding: '16px', fontWeight: '500' }}>{tx.product_name}</td>
                            <td style={{ padding: '16px', fontWeight: '600' }}>Rp {parseFloat(tx.amount).toLocaleString('id-ID')}</td>
                            <td style={{ padding: '16px', color: tx.status === 'success' ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>
                              {tx.status === 'success' ? 'Selesai' : 'Diproses'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in glass-card" style={{ padding: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={28} className="gradient-text" /> Pengaturan Akun
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Perbarui informasi pribadi, alamat pengiriman, dan rincian bank Anda.</p>
            
            {profileMsg.text && (
              <div style={{ background: profileMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: profileMsg.type === 'error' ? '#ef4444' : '#22c55e', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
                {profileMsg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />} {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Nama Lengkap</label>
                  <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', fontSize: '1rem' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Alamat Pengiriman Lengkap</label>
                  <textarea value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} rows={4} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', resize: 'vertical', fontSize: '1rem' }} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kodepos"></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Nama Bank</label>
                  <input type="text" value={profileForm.bank_name} onChange={e => setProfileForm({...profileForm, bank_name: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', fontSize: '1rem' }} placeholder="Contoh: BCA, Mandiri" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Nomor Rekening</label>
                  <input type="text" value={profileForm.bank_account} onChange={e => setProfileForm({...profileForm, bank_account: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', fontSize: '1rem' }} placeholder="0123456789" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1rem', marginTop: '8px', width: 'fit-content', minWidth: '200px' }}>Simpan Perubahan</button>
            </form>
          </div>
        )}

        {/* TAB: SUPPORT */}
        {activeTab === 'support' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LifeBuoy size={28} className="gradient-text" /> Bantuan & Laporan
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                Buat tiket untuk menyampaikan keluhan kepada Admin E-Volve (misal: retur barang, sengketa transaksi).
              </p>

              {ticketMsg.text && (
                <div style={{ background: ticketMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: ticketMsg.type === 'error' ? '#ef4444' : '#22c55e', padding: '16px', borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
                  {ticketMsg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />} {ticketMsg.text}
                </div>
              )}

              <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Subjek Laporan</label>
                  <input type="text" value={ticketForm.subject} onChange={e => setTicketForm({...ticketForm, subject: e.target.value})} required style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', fontSize: '1rem' }} placeholder="Contoh: Pengajuan Retur Transaksi EVOLVE-123" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>Deskripsi Detail</label>
                  <textarea value={ticketForm.description} onChange={e => setTicketForm({...ticketForm, description: e.target.value})} required rows={6} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', resize: 'vertical', fontSize: '1rem' }} placeholder="Jelaskan kronologi dan detail masalah Anda..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1rem', width: 'fit-content', minWidth: '200px' }}>Kirim Laporan</button>
              </form>
            </div>

            <div className="glass-card" style={{ padding: '40px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '1.2rem' }}>Riwayat Tiket Laporan Anda</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tickets.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Anda belum membuat tiket bantuan apapun.</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} style={{ padding: '24px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{ticket.subject}</h4>
                        <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', background: ticket.status === 'open' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: ticket.status === 'open' ? '#f59e0b' : '#22c55e' }}>
                          {ticket.status === 'open' ? 'DIPROSES ADMIN' : 'SELESAI'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{ticket.description}</p>
                      <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> Dilaporkan pada: {new Date(ticket.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserPortal;
