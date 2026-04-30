import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../data/mockData'; // Bạn vẫn có thể dùng hàm format này

export default function AdminDashboard() {
  const { user, isCenterAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cinemas, setCinemas] = useState([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resStats, resCinemas] = await Promise.all([
          axiosClient.get('/admin/thong-ke/tong-quan'),
          axiosClient.get('/public/rap') // Nhớ đổi lại endpoint nếu Backend của bạn lấy rạp bằng đường dẫn khác (vd: /admin/raps)
        ]);
        const actualStats = resStats.data?.data || resStats.data;
        setStats(actualStats);

        const actualCinemas = resCinemas.data?.data || resCinemas.data;
        setCinemas(actualCinemas);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu thống kê...</div>;
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Lỗi tải dữ liệu.</div>;

  // Xử lý dữ liệu cho Biểu đồ
  // Map maCoSo sang tên rạp cho đẹp (Bạn có thể fetch từ API danh sách rạp nếu muốn)
  const tenChiNhanhMap = {};

  (cinemas || []).forEach(rap => {
    const maCN = rap.khuVuc;
    if (maCN) {
      tenChiNhanhMap[maCN] = rap.tenRap;
    }
  });
  const barData = stats.doanhThuChiNhanh.map(item => ({
    label: tenChiNhanhMap[item.maCoSo] || item.maCoSo,
    value: Number(item.doanhThu)
  }));
  const maxBar = Math.max(...barData.map(b => b.value), 1); // Tránh chia cho 0

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ margin: 0 }}>Tổng quan hệ thống</h1>
        <span style={{ backgroundColor: isCenterAdmin ? '#4CAF50' : '#2196F3', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
          {isCenterAdmin ? '🌍 Quản trị Toàn quốc' : `📍 Quản trị Chi nhánh (${user?.maCoSo})`}
        </span>
      </div>
      <p className="subtitle" style={{ marginBottom: '24px' }}>
        {isCenterAdmin
          ? "Bảng điều khiển số liệu của Trung tâm và 9 chi nhánh"
          : "Bảng điều khiển số liệu cục bộ tại chi nhánh của bạn"}
      </p>

      {/* ÉP LƯỚI 4 CỘT BẰNG GRID ĐỂ KHÔNG BỊ RỚT DÒNG */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>

        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="stat-label" style={{ color: '#aaa', marginBottom: '10px' }}>{isCenterAdmin ? 'Tổng doanh thu toàn quốc' : 'Doanh thu chi nhánh'}</div>
          <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107' }}>
            {formatCurrency(stats.doanhThu || 0)}
          </div>
          <div className="stat-icon" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '3rem', opacity: '0.2' }}>💰</div>
        </div>

        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="stat-label" style={{ color: '#aaa', marginBottom: '10px' }}>Vé đã bán</div>
          {/* Đổi màu chữ thành trắng (#fff) cho dễ nhìn */}
          <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
            {stats.veDaBan || 0}
          </div>
          <div className="stat-icon" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '3rem', opacity: '0.2' }}>🎟️</div>
        </div>

        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="stat-label" style={{ color: '#aaa', marginBottom: '10px' }}>Phim đang chiếu</div>
          <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
            {stats.soPhim || 0}
          </div>
          <div className="stat-icon" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '3rem', opacity: '0.2' }}>🎬</div>
        </div>

        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="stat-label" style={{ color: '#aaa', marginBottom: '10px' }}>Người dùng hệ thống</div>
          <div className="stat-value" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>
            {stats.soNguoiDung || 0}
          </div>
          <div className="stat-icon" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '3rem', opacity: '0.2' }}>👥</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isCenterAdmin ? '1.5fr 1fr' : '1fr', gap: '24px' }}>

        {/* BIỂU ĐỒ SO SÁNH */}
        {isCenterAdmin && (
          <div className="chart-card">
            <h3 style={{ color: '#fff' }}>Doanh thu theo chi nhánh</h3>
            {barData.length === 0 ? <p style={{ color: '#888' }}>Chưa có dữ liệu doanh thu.</p> : (
              <div className="chart-bars">
                {barData.map((b, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${(b.value / maxBar) * 100}%` }}>
                    <div className="bar-value">{(b.value / 1000000).toFixed(1)}M</div>
                    <div className="bar-label" style={{ color: '#aaa' }}>{b.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="chart-card">
          <h3 style={{ color: '#fff' }}>Giao dịch gần đây {isCenterAdmin ? '(Toàn quốc)' : '(Cục bộ)'}</h3>

          {(!stats.hoatDongGanDay || stats.hoatDongGanDay.length === 0) ? (
            <p style={{ color: '#888' }}>Chưa có giao dịch nào.</p>
          ) : (
            (stats.hoatDongGanDay || []).map(h => (
              <div key={h.idHoaDon} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>Hóa đơn #{h.idHoaDon}</span>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {new Date(h.ngayThanhToan).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {/* FIX LỖI NaN: Thêm || 0 để dự phòng */}
                  <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{formatCurrency(h.tongTien || 0)}</div>
                  <span className={`status ${h.trangThai === 'DATHANHTOAN' ? 'status-active' : 'status-inactive'}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                    {h.trangThai}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}