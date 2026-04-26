import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal() {
  const { showLogin, setShowLogin, login, register } = useAuth();

  // State lật form: true = Đăng nhập, false = Đăng ký
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    taiKhoan: '', matKhau: '', hoTen: '', email: '', sdt: '', ngaySinh: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLogin) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLoginMode) {
      // Xử lý Đăng nhập
      const result = await login(formData.taiKhoan, formData.matKhau);
      if (!result.success) setError(result.message);
    } else {
      // Xử lý Đăng ký
      const result = await register({
        taiKhoan: formData.taiKhoan,
        matKhau: formData.matKhau,
        hoTen: formData.hoTen,
        email: formData.email,
        sdt: formData.sdt,
        ngaySinh: formData.ngaySinh
      });

      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsLoginMode(true); // Chuyển về tab đăng nhập
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={() => setShowLogin(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowLogin(false)}>×</button>
        <h2>{isLoginMode ? '🎬 Đăng nhập' : '✨ Đăng ký tài khoản'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tài khoản</label>
            <input name="taiKhoan" value={formData.taiKhoan} onChange={handleChange} required placeholder="Nhập tài khoản" />
          </div>

          {!isLoginMode && (
            <>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Họ và tên</label>
                <input name="hoTen" value={formData.hoTen} onChange={handleChange} required placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Số điện thoại</label>
                <input name="sdt" value={formData.sdt} onChange={handleChange} required placeholder="09xxxxxxxxx" />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Mật khẩu</label>
            <input type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} required placeholder="Nhập mật khẩu" />
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: '8px' }}>{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text2)', fontSize: '0.9rem' }}>
          {isLoginMode ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 'bold' }} onClick={toggleMode}>
            {isLoginMode ? "Đăng ký ngay" : "Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
}