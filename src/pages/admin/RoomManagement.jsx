import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [theaters, setTheaters] = useState([]); // State lưu danh sách rạp
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const [formData, setFormData] = useState({
        idPhongChieu: '',
        soHang: '',
        soCot: '',
        trangThai: '',
        idRap: ''
    });

    // 1. Lấy dữ liệu (Phòng chiếu và Rạp)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resRooms, resTheaters] = await Promise.all([
                axiosClient.get('/admin/phong-chieu'),
                axiosClient.get('/admin/raps') // API lấy danh sách rạp
            ]);
            console.log(resRooms.data);
            console.log(resTheaters.data);
            setRooms(resRooms.data?.data);
            setTheaters(resTheaters.data?.data);

        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 2. Mở form Thêm/Sửa
    const openModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                ...room,
                // Đảm bảo lấy đúng ID rạp tùy theo cấu trúc object trả về
                idRap: room.rap?.idRap || ''
            });
        } else {
            setEditingRoom(null);
            setFormData({
                idPhongChieu: '',
                soHang: '',
                soCot: '',
                trangThai: 'DANGHOATDONG',
                idRap: theaters.length > 0 ? theaters[0].id_Rap : ''
            });
        }
        setShowModal(true);
    };

    // 3. Xử lý lưu
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("1. THÔNG TIN PHÒNG ĐANG SỬA:", editingRoom);
        console.log("2. GÓI DỮ LIỆU CHUẨN BỊ GỬI:", formData);
        try {
            if (editingRoom) {
                // 👉 KIỂM TRA ID TRƯỚC KHI GỬI: 
                // Hãy thử lần lượt các tên biến: id, maPhong, idPhong tùy theo Backend của bạn
                const roomId = editingRoom.id || editingRoom.idPhongChieu || editingRoom.idPhong;

                if (!roomId) {
                    console.error("Lỗi: Không tìm thấy ID phòng trong đối tượng:", editingRoom);
                    alert("Không thể xác định ID phòng để cập nhật!");
                    return;
                }
                await axiosClient.put(`/admin/phong-chieu/${editingRoom.idPhongChieu}/trang-thai`, null, // Không gửi JSON Body
                    {
                        params: {
                            trangThai: formData.trangThai // Trạng thái lấy từ form React
                        }
                    });
                alert("Cập nhật thành công!");
            } else {
                const payload = { soHang: formData.soHang, soCot: formData.soCot, idRap: formData.idRap };
                console.log("Payload chuẩn bị bắn lên:", payload);
                await axiosClient.post('/admin/phong-chieu', payload);
                alert("Thêm mới thành công!");
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            alert("Lỗi khi lưu dữ liệu phòng chiếu!");
        }
    };

    return (
        <div className="admin-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>🚪 Quản lý Phòng chiếu</h2>
                <button className="btn btn-primary" onClick={() => openModal()}>+ Thêm phòng chiếu</button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thuộc Rạp</th>
                        <th>Sức chứa</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                    ) : rooms.map(r => (
                        <tr key={r.idPhongChieu}>
                            <td>{r.idPhongChieu}</td>

                            {/* Hiển thị tên rạp */}
                            <td><span className="badge-theater">{r.rap?.tenRap}</span></td>
                            <td>{r.sucChua}</td>
                            <td>
                                <span className={`status ${r.trangThai === 'DANGHOATDONG' ? 'status-active' : 'status-inactive'}`}>
                                    {r.trangThai}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-outline" onClick={() => openModal(r)} style={{ marginRight: '5px' }}>Sửa</button>
                                <button className="btn btn-sm btn-outline" onClick={() => handleDelete(r.id)} style={{ color: 'var(--red)' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '450px', color: 'black' }}>
                        <h3>{editingRoom ? "📝 Chỉnh sửa phòng" : "✨ Thêm phòng mới"}</h3>
                        <form onSubmit={handleSubmit}>

                            {/* Ô CHỌN RẠP MỚI THÊM */}
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Chọn Rạp</label>
                                <select
                                    className="form-control"
                                    value={formData.idRap}
                                    onChange={e => setFormData({ ...formData, idRap: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>-- Chọn rạp quản lý --</option>
                                    {theaters.map(t => (
                                        <option key={t.id_Rap} value={t.id_Rap}>{t.tenRap}</option>
                                    ))}
                                </select>
                            </div>



                            {/* KHỐI NHẬP HÀNG, CỘT VÀ TỰ TÍNH SỨC CHỨA */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>

                                <div className="form-group">
                                    <label>Số hàng ghế</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.soHang}
                                        onChange={e => setFormData({ ...formData, soHang: e.target.value })}
                                        disabled={!!editingRoom} // Không cho sửa khi cập nhật
                                        min="1" max="26" // Tối đa 26 hàng (A đến Z)
                                        required={!editingRoom}

                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số ghế mỗi hàng</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.soCot}
                                        onChange={e => setFormData({ ...formData, soCot: e.target.value })}
                                        disabled={!!editingRoom} // Không cho sửa khi cập nhật
                                        min="1"
                                        required={!editingRoom}

                                    />
                                </div>

                                {/* Ô này chỉ để hiển thị cho đẹp, không cho nhập */}
                                <div className="form-group">
                                    <label>Tổng sức chứa</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        // Tự động tính toán: Số hàng * Số cột. Nếu đang sửa thì lấy sức chứa cũ.
                                        value={editingRoom ? editingRoom.sucChua : (formData.soHang * formData.soCot) || 0}
                                        disabled

                                    />
                                </div>

                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select
                                    className="form-control"
                                    value={formData.trangThai}
                                    onChange={e => setFormData({ ...formData, trangThai: e.target.value })}
                                >
                                    <option value="DANGHOATDONG">DANGHOATDONG</option>
                                    <option value="BAOTRI">BAOTRI</option>
                                </select>
                            </div>


                            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Lưu thay đổi</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}