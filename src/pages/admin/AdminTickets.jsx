import { hoaDon, veXemPhim, nguoiDung, suatChieu, phim, phuongThucThanhToan, formatDateTime, formatCurrency } from '../../data/mockData';

export default function AdminTickets() {
  return (
    <>
      <h1>Quản lý Vé & Hóa đơn</h1>
      <p className="subtitle">Xem và cập nhật trạng thái - Không có quyền xóa (đảm bảo toàn vẹn tài chính)</p>

      <h2 style={{fontSize:'1.3rem',marginTop:'24px',marginBottom:'12px'}}>Hóa đơn</h2>
      <table className="data-table">
        <thead><tr><th>Mã HĐ</th><th>Khách hàng</th><th>Ngày TT</th><th>PT Thanh toán</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          {hoaDon.map(h => {
            const user = nguoiDung.find(u => u.id === h.id_NguoiDung);
            const pt = phuongThucThanhToan.find(p => p.id === h.id_PhuongThucThanhToan);
            return (
              <tr key={h.id}>
                <td>#{h.id.toString().padStart(5,'0')}</td>
                <td>{user?.hoTen}</td>
                <td>{formatDateTime(h.ngayThanhToan)}</td>
                <td>{pt?.noiDung}</td>
                <td><span className={`status ${h.trangThai === 'Đã thanh toán' ? 'status-active' : 'status-inactive'}`}>{h.trangThai}</span></td>
                <td><button className="btn btn-sm btn-outline">Chi tiết</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{fontSize:'1.3rem',marginTop:'40px',marginBottom:'12px'}}>Vé xem phim</h2>
      <table className="data-table">
        <thead><tr><th>Mã vé</th><th>Phim</th><th>Trạng thái</th><th>Mã HĐ</th></tr></thead>
        <tbody>
          {veXemPhim.map(v => {
            const sc = suatChieu.find(s => s.id === v.id_SuatChieu);
            const p = sc ? phim.find(x => x.id === sc.id_Phim) : null;
            return (
              <tr key={v.id}>
                <td>VE-{v.id.toString().padStart(5,'0')}</td>
                <td>{p?.ten || 'N/A'}</td>
                <td><span className={`status ${v.trangThai === 'Đã hủy' ? 'status-inactive' : v.trangThai === 'Đã sử dụng' ? 'status-active' : 'status-pending'}`}>{v.trangThai}</span></td>
                <td>#{v.id_HoaDon.toString().padStart(5,'0')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
