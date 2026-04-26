import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ClientBookingHistory from './ClientBookingHistory';
// Hàm format thời gian thay thế cho mockData
const formatDateTime = (dt) => {
  if (!dt) return '';
  return new Date(dt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const roleLabel = { Admin: 'Quản trị viên', QuanLy: 'Quản lý chi nhánh', NhanVien: 'Nhân viên', KhachHang: 'Khách hàng' };
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Cắt lấy 10 ký tự đầu tiên (YYYY-MM-DD)
  return dateString.split('T')[0];
};
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const [tab, setTab] = useState('info');
  // State form chứa dữ liệu chỉnh sửa
  const [form, setForm] = useState(user ? {
    ...user,
    ngaySinh: formatDateForInput(user.ngaySinh)
  } : {});
  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        ngaySinh: formatDateForInput(user.ngaySinh)
      });
    }
  }, [user]);

  // State thông báo thành công/lỗi
  const [message, setMessage] = useState({ text: '', type: '' });

  // State chứa lịch sử đặt vé thật từ API
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Nếu chưa đăng nhập thì đá về trang chủ
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  // 1. Xử lý CẬP NHẬT THÔNG TIN
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Đang cập nhật...', type: 'info' });
    try {
      // Đảm bảo endpoint này khớp với Backend Spring Boot của bạn
      const res = await axiosClient.put('/api/v1/users/me', form);

      const updatedUser = res.data.data || res.data;
      console.log(updatedUser);
      // Cập nhật Context và LocalStorage để không bị mất khi F5
      setUser(updatedUser);
      localStorage.setItem('cinemax_user', JSON.stringify(updatedUser));

      setMessage({ text: 'Cập nhật thông tin thành công! 🎉', type: 'success' });

      // Tắt thông báo sau 3 giây
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.data?.message || 'Cập nhật thất bại!';
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  // // 2. Xử lý LẤY LỊCH SỬ ĐẶT VÉ (Chỉ gọi API khi bấm sang tab History)
  // useEffect(() => {
  //   if (tab === 'history' && history.length === 0) {
  //     const fetchHistory = async () => {
  //       setLoadingHistory(true);
  //       try {
  //         // Endpoint lấy lịch sử hóa đơn của user hiện tại
  //         const res = await axiosClient.get('/api/v1/hoa-don/me');
  //         setHistory(res.data.data || res.data || []);
  //       } catch (error) {
  //         console.error("Lỗi lấy lịch sử", error);
  //       } finally {
  //         setLoadingHistory(false);
  //       }
  //     };
  //     fetchHistory();
  //   }
  // }, [tab, history.length]);

  return (
    <div className="container profile-page">
      <div className="profile-header">
        {/* Đã thêm dấu ? để tránh lỗi màn hình đen */}
        <div className="profile-avatar">{user?.hoTen?.charAt(0) || 'U'}</div>
        <div>
          <h2>{user?.hoTen || 'Người dùng'}</h2>
          <p style={{ color: 'var(--text2)' }}>{roleLabel[user?.vaiTro] || 'Thành viên'} • {user?.email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <div className={`profile-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Thông tin cá nhân</div>
        <div className={`profile-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Lịch sử đặt vé</div>
      </div>

      {/* TAB 1: FORM CẬP NHẬT */}
      {tab === 'info' && (
        <form className="profile-form" onSubmit={handleUpdateInfo}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input value={form.hoTen || ''} onChange={e => setForm({ ...form, hoTen: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input value={form.sdt || form.SDT || ''} onChange={e => setForm({ ...form, sdt: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input type="date" value={form.ngaySinh ? form.ngaySinh.split('T')[0] : ''} onChange={e => setForm({ ...form, ngaySinh: e.target.value })} />
          </div>

          <div className="form-group full">
            {message.text && (
              <p style={{ color: message.type === 'success' ? '#4CAF50' : 'var(--red)', marginBottom: '12px', fontSize: '0.9rem' }}>
                {message.text}
              </p>
            )}
            <button type="submit" className="btn btn-primary">Cập nhật thông tin</button>
          </div>
        </form>
      )}

      {/* TAB 2: LỊCH SỬ ĐẶT VÉ */}
      {tab === 'history' && (
        // <table className="data-table">
        //   <thead>
        //     <tr>
        //       <th>Mã HĐ</th>
        //       <th>Ngày thanh toán</th>
        //       <th>Trạng thái</th>
        //       <th>Tổng tiền</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {loadingHistory ? (
        //       <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</td></tr>
        //     ) : history.length === 0 ? (
        //       <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>Chưa có lịch sử đặt vé nào.</td></tr>
        //     ) : (
        //       history.map((inv, index) => (
        //         <tr key={inv.id || index}>
        //           <td style={{ fontWeight: 'bold' }}>#{inv.id?.toString().padStart(5, '0') || 'N/A'}</td>
        //           <td>{formatDateTime(inv.ngayThanhToan)}</td>
        //           <td>
        //             <span className={`status ${inv.trangThai === 'Đã thanh toán' ? 'status-active' : 'status-inactive'}`}>
        //               {inv.trangThai || 'Chờ xử lý'}
        //             </span>
        //           </td>
        //           <td style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
        //             {/* Tùy vào việc backend có trả về tongTien hay không */}
        //             {inv.tongTien ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.tongTien) : '...'}
        //           </td>
        //         </tr>
        //       ))
        //     )}
        //   </tbody>
        // </table>
        <div className="form-lich-su">
          <ClientBookingHistory />
        </div>
      )}
    </div>
  );
}