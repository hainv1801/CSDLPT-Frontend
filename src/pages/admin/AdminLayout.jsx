import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// Lưu ý: Dùng AuthContext hoặc authStore tùy theo cách bạn đang đặt tên ở bước trước
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra quyền truy cập (Route Guard)
  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        alert('Cảnh báo: Bạn không có quyền truy cập khu vực quản trị!');
        navigate('/'); // Đá về trang khách
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Trong lúc chờ check quyền thì hiện loading để tránh bị chớp giao diện
  if (isLoading || !user || !isAdmin) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang kiểm tra quyền...</div>;

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>

      {/* CỘT SIDEBAR BÊN TRÁI */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ color: 'var(--gold, #facc15)', margin: 0, textAlign: 'center' }}>CineMax Admin</h2>
        </div>

        <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/admin" style={getNavStyle(location.pathname === '/admin')}>📊 Tổng quan</Link>
          <Link to="/admin/phim" style={getNavStyle(location.pathname.includes('/admin/phim'))}>🎬 Quản lý Phim</Link>
          <Link to="/admin/phong-chieu" style={getNavStyle(location.pathname.includes('/admin/phong-chieu'))}>🚪 Quản lý Phòng chiếu</Link>
          <Link to="/admin/suat-chieu" style={getNavStyle(location.pathname.includes('/admin/suat-chieu'))}>📅 Quản lý Suất chiếu</Link>
          <Link to="/admin/nguoi-dung" style={getNavStyle(location.pathname.includes('/admin/nguoi-dung'))}>👥 Quản lý Người dùng</Link>
          <Link to="/admin/hoa-don" style={getNavStyle(location.pathname.includes('/admin/hoa-don'))}>💳 Quản lý Hóa đơn</Link>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            ⬅ Về trang khách
          </button>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{ backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0, color: '#334155' }}>Hệ thống quản trị</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#64748b' }}>Xin chào, <strong style={{ color: '#0f172a' }}>{user.hoTen}</strong></span>
          </div>
        </header>

        {/* Vùng render các trang con (Outlet) */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minHeight: '500px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: 'black' }}>
            {/* Đây là nơi React Router sẽ nhét nội dung của trang Phim, Suất Chiếu... vào */}
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}

// Hàm hỗ trợ style cho nút trong Sidebar
const getNavStyle = (isActive) => ({
  padding: '12px 15px',
  color: isActive ? '#facc15' : '#cbd5e1',
  backgroundColor: isActive ? '#334155' : 'transparent',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'block',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: 'all 0.2s'
});