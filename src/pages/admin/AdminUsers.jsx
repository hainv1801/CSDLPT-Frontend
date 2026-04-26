import { nguoiDung } from '../../data/mockData';

const roleBadge = { Admin: 'status-pending', QuanLy: 'status-active', NhanVien: 'status-active', KhachHang: '' };
const roleLabel = { Admin: 'Quản trị viên', QuanLy: 'Quản lý', NhanVien: 'Nhân viên', KhachHang: 'Khách hàng' };

export default function AdminUsers() {
  return (
    <>
      <h1>Quản lý Người dùng</h1>
      <p className="subtitle">Phân quyền: Admin, Quản lý chi nhánh, Nhân viên bán vé, Khách hàng</p>
      <div className="table-toolbar">
        <input placeholder="🔍 Tìm người dùng..." style={{maxWidth:'300px'}} />
        <button className="btn btn-primary btn-sm">+ Thêm người dùng</button>
      </div>
      <table className="data-table">
        <thead><tr><th>ID</th><th>Tài khoản</th><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Thao tác</th></tr></thead>
        <tbody>
          {nguoiDung.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td style={{fontWeight:600}}>{u.taiKhoan}</td>
              <td>{u.hoTen}</td>
              <td style={{color:'var(--text2)'}}>{u.email}</td>
              <td>{u.SDT}</td>
              <td><span className={`status ${roleBadge[u.vaiTro]}`}>{roleLabel[u.vaiTro]}</span></td>
              <td className="table-actions">
                <button className="btn btn-sm btn-outline">Sửa</button>
                {u.vaiTro === 'KhachHang' && <button className="btn btn-sm btn-danger">Xóa</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
