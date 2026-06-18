import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Wallet, ShoppingBag, Package, Settings, LifeBuoy, AlertCircle, CheckCircle, Clock } from 'lucide-react';

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
      
      // Update local context user data
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

  if (!user) {
    return <div className="page-section flex-center"><h3>Silakan login terlebih dahulu.</h3></div>;
  }

  if (loading || !dashboardData) {
    return <div className="page-section flex-center"><h3>Loading data...</h3></div>;
  }

  return (
    <div className="app-container page-section animate-fade-in" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Halo, <span className="gradient-text">{user.full_name}</span></h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Selamat datang di Portal Pengguna E-Volve.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}>Pengaturan</button>
            <button onClick={() => setActiveTab('support')} className={`btn ${activeTab === 'support' ? 'btn-primary' : 'btn-outline'}`}>Bantuan</button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '50%' }}>
                    <Wallet color="#22c55e" size={32} />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Saldo</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.balance || 0).toLocaleString('id-ID')}</h3>
                  </div>
                </div>
                
                <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
                    <ShoppingBag color="#3b82f6" size={32} />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Penjualan ({dashboardData.sales.total_items_sold} item)</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.sales.total_sales || 0).toLocaleString('id-ID')}</h3>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '16px', borderRadius: '50%' }}>
                    <Package color="#a855f7" size={32} />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pembelian ({dashboardData.purchases.total_items_bought} item)</p>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Rp {parseFloat(dashboardData.purchases.total_purchases || 0).toLocaleString('id-ID')}</h3>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Riwayat Transaksi Terbaru</h3>
                {dashboardData.history.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Belum ada riwayat transaksi.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Tanggal</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Jenis</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Produk</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Nominal</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.history.map((tx) => {
                          const isBuyer = tx.buyer_id === user.id;
                          return (
                            <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                              <td style={{ padding: '12px 8px' }}>{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: isBuyer ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: isBuyer ? '#a855f7' : '#3b82f6' }}>
                                  {isBuyer ? 'Beli' : 'Jual'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 8px' }}>{tx.product_name}</td>
                              <td style={{ padding: '12px 8px' }}>Rp {parseFloat(tx.amount).toLocaleString('id-ID')}</td>
                              <td style={{ padding: '12px 8px', color: tx.status === 'success' ? '#22c55e' : '#f59e0b' }}>
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
            </>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="glass-card" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={24} /> Pengaturan Akun</h3>
              
              {profileMsg.text && (
                <div style={{ background: profileMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: profileMsg.type === 'error' ? '#ef4444' : '#22c55e', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  {profileMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nama Lengkap</label>
                  <input type="text" value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Alamat Pengiriman Lengkap</label>
                  <textarea value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kodepos"></textarea>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nama Bank</label>
                    <input type="text" value={profileForm.bank_name} onChange={e => setProfileForm({...profileForm, bank_name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit' }} placeholder="Contoh: BCA, Mandiri" />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nomor Rekening</label>
                    <input type="text" value={profileForm.bank_account} onChange={e => setProfileForm({...profileForm, bank_account: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit' }} placeholder="0123456789" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Simpan Perubahan</button>
              </form>
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'support' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><LifeBuoy size={24} /> Buat Tiket Bantuan</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Sampaikan keluhan Anda kepada Admin E-Volve, seperti masalah retur barang, sengketa transaksi, atau kendala lainnya.
                </p>

                {ticketMsg.text && (
                  <div style={{ background: ticketMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: ticketMsg.type === 'error' ? '#ef4444' : '#22c55e', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    {ticketMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {ticketMsg.text}
                  </div>
                )}

                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subjek Masalah</label>
                    <input type="text" value={ticketForm.subject} onChange={e => setTicketForm({...ticketForm, subject: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit' }} placeholder="Contoh: Retur Transaksi EVOLVE-123" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deskripsi Detail</label>
                    <textarea value={ticketForm.description} onChange={e => setTicketForm({...ticketForm, description: e.target.value})} required rows={5} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--text-dark)', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Jelaskan masalah Anda sedetail mungkin..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Kirim Laporan</button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{ marginTop: 0 }}>Riwayat Tiket</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tickets.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Anda belum membuat tiket bantuan apapun.</p>
                  ) : (
                    tickets.map(ticket => (
                      <div key={ticket.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0 }}>{ticket.subject}</h4>
                          <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', background: ticket.status === 'open' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: ticket.status === 'open' ? '#f59e0b' : '#22c55e' }}>
                            {ticket.status === 'open' ? 'DIPROSES' : 'SELESAI'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ticket.description}</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {new Date(ticket.created_at).toLocaleString('id-ID')}
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
    </div>
  );
};

export default UserPortal;
