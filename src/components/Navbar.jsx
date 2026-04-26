
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
export default function Navbar() {
  const { user, logout, isAdmin, setShowLogin } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // Xóa token & xóa user
    navigate('/'); // Bay về trang chủ ngay lập tức
  };
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">🎬 Cine<span>Max</span></Link>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>Trang chủ</Link></li>
          <li><Link to="/movies" className={isActive('/movies')}>Phim</Link></li>
          {isAdmin && <li><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Quản trị</Link></li>}
        </ul>
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/profile" className="nav-user">👤 {user.hoTen}</Link>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={() => setShowLogin(true)}>Đăng nhập</button>
          )}
        </div>
      </div>
    </nav>
  );
}
