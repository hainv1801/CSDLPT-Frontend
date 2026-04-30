import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Hàm hỗ trợ format mảng ngày giờ từ Spring Boot thành chuẩn yyyy-MM-ddThh:mm cho thẻ input
const formatDateTimeForInput = (dateTimeData) => {
    if (!dateTimeData) return '';
    if (Array.isArray(dateTimeData)) {
        const [year, month, day, hour, minute] = dateTimeData;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour || 0).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}`;
    }
    if (typeof dateTimeData === 'string') {
        return dateTimeData.substring(0, 16); // Lấy chuỗi đến phần phút
    }
    return '';
};

const formatDisplayDateTime = (dateTimeData) => {
    const formatted = formatDateTimeForInput(dateTimeData);
    if (!formatted) return 'Chưa cập nhật';
    const [datePart, timePart] = formatted.split('T');
    const [year, month, day] = datePart.split('-');
    return `${timePart} - ${day}/${month}/${year}`;
};

export default function ShowtimeManagement() {
    const navigate = useNavigate();
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theaters, setTheaters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);
    const { user, isCenterAdmin } = useAuth();
    // State form dữ liệu
    const [formData, setFormData] = useState({
        idPhim: '',
        idRap: '',
        idPhongChieu: '',
        thoiGianBatDau: '',
        giaMoiVe: ''
    });

    // 1. Lấy dữ liệu (Suất chiếu, Phim, Phòng chiếu)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resShowtimes, resMovies, resRooms, resTheaters] = await Promise.all([
                axiosClient.get('/admin/suat-chieu'),
                axiosClient.get('/admin/phim'),
                axiosClient.get('/admin/phong-chieu'),
                axiosClient.get('/admin/raps')
            ]);

            const showtimesData = resShowtimes.data?.data || resShowtimes.data || [];
            showtimesData.sort((a, b) => new Date(b.thoiGianBatDau) - new Date(a.thoiGianBatDau));
            setShowtimes(showtimesData); // Gán mảng đã sắp xếp vào State
            setMovies(resMovies.data?.data || resMovies.data || []);
            setRooms(resRooms.data?.data || resRooms.data || []);
            setTheaters(resTheaters.data?.data || resTheaters.data || []);
            console.log("Rạp", resTheaters.data);
            console.log("Suat chieu", resShowtimes.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu suất chiếu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    const allowedTheaters = isCenterAdmin
        ? theaters
        : theaters.filter(t => t.khuVuc === user?.maCoSo);
    // 2. Mở Modal
    const openModal = (showtime = null) => {
        if (showtime) {
            setEditingShowtime(showtime);
            const currentRapId = showtime.idRap || '';
            setFormData({
                // Tự động tìm ID Phim và ID Phòng chiếu từ Object trả về
                idPhim: showtime.phim?.id || showtime.idPhim || '',
                idRap: currentRapId,
                idPhongChieu: showtime.phongChieu?.idPhongChieu || showtime.idPhongChieu || '',
                thoiGianBatDau: formatDateTimeForInput(showtime.thoiGianBatDau),
                giaMoiVe: showtime.giaMoiVe || ''
            });
        } else {
            setEditingShowtime(null);
            const defaultRapId = allowedTheaters.length > 0 ? (allowedTheaters[0].id_Rap || allowedTheaters[0].id) : '';
            setFormData({
                idPhim: movies.length > 0 ? (movies[0].id || movies[0].idPhim) : '',
                idRap: defaultRapId,
                idPhongChieu: '',
                thoiGianBatDau: '',
                giaMoiVe: '50000' // Giá vé mặc định
            });
        }
        setShowModal(true);
    };
    const handleTheaterChange = (e) => {
        const selectedRapId = e.target.value;
        // Tìm xem rạp này có phòng nào không để auto-select phòng đầu tiên cho tiện
        const roomsOfThisTheater = rooms.filter(r => (r.rap?.id_Rap == selectedRapId));

        setFormData({
            ...formData,
            idRap: selectedRapId,
            // Reset phòng chiếu về phòng đầu tiên của rạp mới (nếu có), không thì để trống
            idPhongChieu: roomsOfThisTheater.length > 0 ? roomsOfThisTheater[0].idPhongChieu : ''
        });
    };
    // 3. Xử lý Lưu
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo payload đẩy lên Spring Boot
        const payload = {
            idPhim: formData.idPhim,
            idPhongChieu: formData.idPhongChieu,
            thoiGianBatDau: formData.thoiGianBatDau,
            giaMoiVe: formData.giaMoiVe
        };

        console.log("Dữ liệu suất chiếu bắn lên:", payload);

        try {
            if (editingShowtime) {
                // Đảm bảo lấy đúng ID của suất chiếu để update
                const idSuat = editingShowtime.id || editingShowtime.idSuatChieu;
                await axiosClient.put(`/admin/suat-chieu/${idSuat}`, payload);
                alert("Cập nhật thành công!");
            } else {
                await axiosClient.post('/admin/suat-chieu', payload);
                alert("Thêm suất chiếu mới thành công!");
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Lỗi lưu suất chiếu:", error.response?.data);
            alert("Lỗi khi lưu dữ liệu suất chiếu! Kiểm tra Console.");
        }
    };

    // 4. Xử lý Xóa
    const handleDelete = async (idSuat) => {
        if (window.confirm("Xóa suất chiếu này sẽ ảnh hưởng vé đã đặt. Tiếp tục?")) {
            try {
                await axiosClient.delete(`/admin/suat-chieu/${idSuat}`);
                fetchData();
            } catch (error) {
                alert("Lỗi: Không thể xóa suất chiếu đã có khách mua vé.");
            }
        }
    };

    return (
        <div className="admin-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📅 Quản lý Suất chiếu</h2>
                <button className="btn btn-primary" onClick={() => openModal()}>+ Thêm suất chiếu</button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Phim</th>
                        <th>Rạp</th>
                        <th>Phòng chiếu</th>
                        <th>Thời gian</th>
                        <th>Giá vé</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                    ) : showtimes.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Chưa có suất chiếu nào</td></tr>
                    ) : showtimes.map(s => {
                        const idSuat = s.id || s.idSuatChieu;
                        return (
                            <tr key={idSuat}>
                                <td>{idSuat}</td>
                                <td style={{ fontWeight: 'bold' }}>{s.phim?.ten || s.tenPhim || 'N/A'}</td>
                                <td>{s.tenRap}</td>
                                <td>{s.phongChieu?.ten || s.idPhongChieu || 'N/A'}</td>
                                <td style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
                                    {formatDisplayDateTime(s.thoiGianBatDau)}
                                </td>
                                <td>{Number(s.giaMoiVe).toLocaleString('vi-VN')} đ</td>
                                <td>
                                    {/* NÚT MỚI THÊM NÀY */}
                                    <button
                                        className="btn btn-sm"
                                        style={{ marginRight: '5px', backgroundColor: '#4CAF50', color: 'white' }}
                                        onClick={() => navigate(`/admin/dat-ve/${idSuat}`)}
                                    >
                                        🎫 Đặt vé
                                    </button>
                                    <button className="btn btn-sm btn-outline" onClick={() => openModal(s)} style={{ marginRight: '5px' }}>Sửa</button>
                                    <button className="btn btn-sm btn-outline" onClick={() => handleDelete(idSuat)} style={{ color: 'var(--red)' }}>Xóa</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '500px', color: 'black' }}>
                        <h3>{editingShowtime ? "📝 Sửa suất chiếu" : "✨ Thêm suất chiếu"}</h3>
                        <form onSubmit={handleSubmit}>

                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Chọn Phim</label>
                                <select
                                    className="form-control"
                                    value={formData.idPhim}
                                    onChange={e => setFormData({ ...formData, idPhim: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>-- Chọn phim --</option>
                                    {movies.map(m => (
                                        <option key={m.id || m.idPhim} value={m.id || m.idPhim}>{m.ten}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Chọn Rạp chiếu</label>
                                <select
                                    className="form-control"
                                    value={formData.idRap}
                                    onChange={handleTheaterChange}
                                    required
                                    disabled={!isCenterAdmin} // 👉 KHÓA CHỈ ĐỌC VỚI CHI NHÁNH
                                >
                                    <option value="" disabled>-- Chọn rạp --</option>
                                    {/* 👉 DÙNG MẢNG ĐÃ LỌC */}
                                    {allowedTheaters.map(t => (
                                        <option key={t.id_Rap || t.id} value={t.id_Rap || t.id}>{t.tenRap}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Chọn Phòng chiếu</label>
                                <select
                                    className="form-control"
                                    value={formData.idPhongChieu}
                                    onChange={e => setFormData({ ...formData, idPhongChieu: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>-- Chọn phòng chiếu --</option>
                                    {rooms
                                        .filter(r => Number(r.rap?.idRap) === Number(formData.idRap))
                                        .map(r => (
                                            <option key={r.idPhongChieu} value={r.idPhongChieu}>
                                                {r.tenPhong || r.tenPhongChieu || `Phòng ID ${r.idPhongChieu}`} - (Sức chứa: {r.sucChua})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                                <div className="form-group">
                                    <label>Thời gian bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formData.thoiGianBatDau}
                                        onChange={e => setFormData({ ...formData, thoiGianBatDau: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giá vé (VNĐ)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.giaMoiVe}
                                        onChange={e => setFormData({ ...formData, giaMoiVe: e.target.value })}
                                        min="0"
                                        required
                                    />
                                </div>
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