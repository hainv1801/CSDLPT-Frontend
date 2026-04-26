import { phim, rap, nguoiDung, veXemPhim, hoaDon, suatChieu, formatCurrency } from '../../data/mockData';

export default function AdminDashboard() {
  const totalRevenue = hoaDon.filter(h => h.trangThai === 'Đã thanh toán').length * 85000;
  const totalTickets = veXemPhim.filter(v => v.trangThai !== 'Đã hủy').length;
  const barData = rap.slice(0, 6).map((r, i) => ({ label: r.tenRap.replace('CineMax ', ''), value: [120, 95, 88, 76, 110, 65][i] || 50 }));
  const maxBar = Math.max(...barData.map(b => b.value));

  return (
    <>
      <h1>Tổng quan hệ thống</h1>
      <p className="subtitle">Bảng điều khiển quản trị CineMax</p>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-label">Doanh thu</div><div className="stat-value">{formatCurrency(totalRevenue)}</div><div className="stat-change">↑ 12% so với tuần trước</div></div>
        <div className="stat-card"><div className="stat-icon">🎟️</div><div className="stat-label">Vé đã bán</div><div className="stat-value">{totalTickets}</div><div className="stat-change">↑ 8% so với tuần trước</div></div>
        <div className="stat-card"><div className="stat-icon">🎬</div><div className="stat-label">Phim đang chiếu</div><div className="stat-value">{phim.length}</div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-label">Người dùng</div><div className="stat-value">{nguoiDung.length}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="chart-card">
          <h3>Doanh thu theo chi nhánh</h3>
          <div className="chart-bars">
            {barData.map((b, i) => (
              <div key={i} className="chart-bar" style={{ height: `${(b.value / maxBar) * 100}%` }}>
                <div className="bar-value">{b.value}tr</div>
                <div className="bar-label">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Hoạt động gần đây</h3>
          {hoaDon.slice(0, 4).map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
              <span>Hóa đơn #{h.id.toString().padStart(5, '0')}</span>
              <span className={`status ${h.trangThai === 'Đã thanh toán' ? 'status-active' : 'status-inactive'}`}>{h.trangThai}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: '24px' }}>
        <h3>Hệ thống chi nhánh ({rap.length} rạp)</h3>
        <table className="data-table">
          <thead><tr><th>Rạp</th><th>Địa chỉ</th><th>Khu vực</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {rap.map(r => (
              <tr key={r.id}><td style={{fontWeight:600}}>{r.tenRap}</td><td style={{color:'var(--text2)'}}>{r.diaChi}</td><td>{r.khuVuc}</td><td><span className="status status-active">Hoạt động</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
