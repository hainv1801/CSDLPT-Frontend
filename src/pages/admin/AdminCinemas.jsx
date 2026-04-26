import { rap, phongChieu } from '../../data/mockData';

export default function AdminCinemas() {
  return (
    <>
      <h1>Quản lý Rạp & Phòng chiếu</h1>
      <p className="subtitle">Quản lý cơ sở vật chất tại {rap.length} chi nhánh</p>
      <div className="table-toolbar">
        <input placeholder="🔍 Tìm rạp..." style={{maxWidth:'300px'}} />
        <button className="btn btn-primary btn-sm">+ Thêm rạp</button>
      </div>
      <table className="data-table">
        <thead><tr><th>ID</th><th>Tên rạp</th><th>Địa chỉ</th><th>Khu vực</th><th>Số phòng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          {rap.map(r => {
            const rooms = phongChieu.filter(pc => pc.id_Rap === r.id);
            return (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td style={{fontWeight:600}}>{r.tenRap}</td>
                <td style={{color:'var(--text2)',fontSize:'0.85rem'}}>{r.diaChi}</td>
                <td>{r.khuVuc}</td>
                <td>{rooms.length} phòng</td>
                <td><span className="status status-active">Hoạt động</span></td>
                <td className="table-actions">
                  <button className="btn btn-sm btn-outline">Sửa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{marginTop:'40px',fontSize:'1.4rem'}}>Danh sách phòng chiếu</h2>
      <table className="data-table" style={{marginTop:'16px'}}>
        <thead><tr><th>ID</th><th>Phòng</th><th>Rạp</th><th>Sức chứa</th><th>Trạng thái</th></tr></thead>
        <tbody>
          {phongChieu.map(pc => {
            const r = rap.find(x => x.id === pc.id_Rap);
            return (
              <tr key={pc.id}>
                <td>{pc.id}</td>
                <td style={{fontWeight:600}}>{pc.ten}</td>
                <td>{r?.tenRap}</td>
                <td>{pc.sucChua} ghế</td>
                <td><span className={`status ${pc.trangThai === 'Hoạt động' ? 'status-active' : 'status-inactive'}`}>{pc.trangThai}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
