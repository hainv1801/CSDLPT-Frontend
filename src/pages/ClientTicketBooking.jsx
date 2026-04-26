import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './admin/TicketBooking.css'; // Tái sử dụng lại file CSS sơ đồ ghế lúc nãy

export default function ClientTicketBooking() {
    const { id } = useParams();
    const navigate = useNavigate();


    // Trong thực tế: const user = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = JSON.parse(localStorage.getItem('cinemax_user'));

    const [suatChieu, setSuatChieu] = useState(null);
    const [danhSachGhe, setDanhSachGhe] = useState([]);
    const [gheDangChon, setGheDangChon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [danhSachPTTT, setDanhSachPTTT] = useState([]);
    // Thêm state để khách chọn phương thức thanh toán
    const [phuongThucTT, setPhuongThucTT] = useState(2); // Mặc định ID 2 là VNPay

    useEffect(() => {
        // Nếu chưa đăng nhập -> Đá văng ra trang Login
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đặt vé!");
            navigate('/login');
            return;
        }

        const fetchBookingData = async () => {
            try {
                // Gọi API lấy dữ liệu như cũ (nhớ đổi đường dẫn nếu API cho Client khác Admin)
                const [resSuat, resGhe, resPTTT] = await Promise.all([
                    axiosClient.get(`/public/suat-chieu/${id}`),
                    axiosClient.get(`/public/suat-chieu/${id}/ghe`),
                    axiosClient.get(`/api/v1/payment-methods`)
                ]);

                const thongTinSuat = resSuat.data?.data || resSuat.data;
                const danhSachGheThat = resGhe.data?.data || resGhe.data;

                setSuatChieu({
                    id: thongTinSuat.id || thongTinSuat.idSuatChieu,
                    tenPhim: thongTinSuat.phim?.ten || thongTinSuat.tenPhim,
                    giaVe: thongTinSuat.giaVe || thongTinSuat.giaMoiVe || 50000
                });
                setDanhSachGhe(danhSachGheThat);
                const listPTTT = resPTTT.data.data;
                setDanhSachPTTT(listPTTT);

                // Mặc định chọn phương thức đầu tiên trong danh sách
                if (listPTTT.length > 0) {
                    setPhuongThucTT(listPTTT[0].idPhuongThucThanhToan);
                }
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Không thể tải sơ đồ phòng chiếu!");
            } finally {
                setLoading(false);
            }
        };
        fetchBookingData();
    }, [id, navigate]);

    const handleChonGhe = (ghe) => {
        if (ghe.daDat) return; // Ghế đã bán thì cấm click

        // Khách hàng thường chỉ được chọn tối đa 6-8 vé 1 lần để chống đầu cơ
        // if (!gheDangChon.includes(ghe.idGhe) && gheDangChon.length >= 6) {
        //     alert("Bạn chỉ được đặt tối đa 6 ghế trong một lần giao dịch!");
        //     return;
        // }

        if (gheDangChon.includes(ghe.idGhe)) {
            setGheDangChon(gheDangChon.filter(idGhe => idGhe !== ghe.idGhe));
        } else {
            setGheDangChon([...gheDangChon, ghe.idGhe]);
        }
    };

    const tongTien = gheDangChon.length * (suatChieu?.giaVe || 0);

    // XỬ LÝ THANH TOÁN ONLINE
    const handleThanhToanOnline = async () => {
        if (gheDangChon.length === 0) {
            alert("Vui lòng chọn ít nhất 1 ghế để tiếp tục!");
            return;
        }

        const payload = {
            idSuatChieu: suatChieu.id,
            danhSachIdGhe: gheDangChon,
            idNguoiDung: currentUser.id, // 👉 Lấy ID khách hàng thực tế
            idPhuongThucThanhToan: phuongThucTT   // 👉 Lấy ID phương thức khách vừa chọn
        };

        try {
            // Tạm thời vẫn gọi thẳng API đặt vé như Admin để test luồng
            const response = await axiosClient.post('/public/suat-chieu/dat-ve', payload);
            const maHoaDon = response.data?.data?.idHoaDon || response.data;

            // Thay vì in bill, ta báo thành công và chuyển khách về trang Lịch Sử Đặt Vé
            alert(`🎉 Đặt vé thành công! Mã Hóa Đơn của bạn là: HD-${maHoaDon}`);
            navigate('/lich-su-mua-ve');

        } catch (error) {
            alert("Lỗi đặt vé: " + (error.response?.data || "Vui lòng thử lại sau."));
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải rạp chiếu phim...</div>;

    return (
        <div className="client-container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
            <h2 style={{ textAlign: 'center', color: '#ff9800' }}>🎬 ĐẶT VÉ: {suatChieu?.tenPhim?.toUpperCase()}</h2>

            {/* SƠ ĐỒ GHẾ (Dùng lại CSS cũ) */}
            <div className="screen" style={{ marginTop: '30px' }}>MÀN HÌNH</div>
            <div className="seat-map">
                {danhSachGhe.map((ghe) => (
                    <div
                        key={ghe.idGhe}
                        className={`seat ${ghe.daDat ? 'booked' : ''} ${gheDangChon.includes(ghe.idGhe) ? 'selected' : ''}`}
                        onClick={() => handleChonGhe(ghe)}
                    >
                        {ghe.tenGhe}
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item"><div className="seat empty"></div> Ghế trống</div>
                <div className="legend-item"><div className="seat selected"></div> Đang chọn</div>
                <div className="legend-item"><div className="seat booked"></div> Đã bán</div>
            </div>

            {/* BẢNG THANH TOÁN CHO KHÁCH HÀNG */}
            <div className="checkout-panel" style={{ backgroundColor: '#1e1e2d', border: '1px solid #333', color: 'white', marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #555', paddingBottom: '15px' }}>
                    <div>
                        <p style={{ margin: '5px 0' }}>Ghế đang chọn:</p>
                        <strong style={{ color: '#4CAF50', fontSize: '18px' }}>
                            {gheDangChon.length > 0
                                ? danhSachGhe.filter(g => gheDangChon.includes(g.idGhe)).map(g => g.tenGhe).join(', ')
                                : 'Chưa chọn'}
                        </strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '5px 0' }}>Tổng thanh toán:</p>
                        <strong style={{ color: '#ff4d4f', fontSize: '24px' }}>{tongTien.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                </div>

                {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Chọn phương thức thanh toán:</p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {danhSachPTTT.map((pt) => (
                            <label
                                key={pt.idPhuongThucThanhToan}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 15px',
                                    border: '1px solid #333',
                                    borderRadius: '5px',
                                    backgroundColor: phuongThucTT === pt.idPhuongThucThanhToan ? '#333' : 'transparent'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={pt.idPhuongThucThanhToan}
                                    checked={phuongThucTT === pt.idPhuongThucThanhToan}
                                    onChange={() => setPhuongThucTT(pt.idPhuongThucThanhToan)}
                                />
                                {/* Hiển thị tên từ DB (Ví dụ: VNPay, Thẻ nội địa, MoMo...) */}
                                <span>💳 {pt.noiDung}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className="btn-pay"
                    style={{ width: '100%', marginTop: '25px', padding: '15px', backgroundColor: '#ff9800', border: 'none', color: 'black', borderRadius: '8px' }}
                    onClick={handleThanhToanOnline}
                >
                    TIẾN HÀNH THANH TOÁN
                </button>
            </div>
        </div>
    );
}