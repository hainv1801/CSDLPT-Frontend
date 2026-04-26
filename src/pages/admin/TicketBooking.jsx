import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient'; // Tùy chỉnh lại đường dẫn
import './TicketBooking.css';

export default function TicketBooking({ idSuatChieu }) {
    // 1. Các State quản lý dữ liệu
    const [suatChieu, setSuatChieu] = useState(null); // Lưu thông tin phim, rạp, giá vé...
    const [danhSachGhe, setDanhSachGhe] = useState([]); // Mảng chứa toàn bộ ghế
    const [gheDangChon, setGheDangChon] = useState([]); // Mảng chứa ID các ghế mình đang click chọn
    const [loading, setLoading] = useState(true);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const { id } = useParams();
    idSuatChieu = id;
    // 2. Fetch dữ liệu khi vào trang
    useEffect(() => {
        const fetchBookingData = async () => {
            setLoading(true);
            try {
                // Gọi song song 2 API: Lấy thông tin Suất chiếu và Lấy danh sách Ghế
                const [resSuat, resGhe] = await Promise.all([
                    axiosClient.get(`/admin/suat-chieu/${idSuatChieu}`),
                    axiosClient.get(`/admin/suat-chieu/${idSuatChieu}/ghe`)
                ]);

                const thongTinSuat = resSuat.data?.data || resSuat.data;
                const danhSachGheThat = resGhe.data?.data || resGhe.data;

                // Nạp dữ liệu thật vào State
                setSuatChieu({
                    id: thongTinSuat.id || thongTinSuat.idSuatChieu,
                    tenPhim: thongTinSuat.phim?.ten || thongTinSuat.tenPhim,
                    giaMoiVe: thongTinSuat.giaMoiVe
                });

                // Set danh sách ghế thật lấy từ DB
                setDanhSachGhe(danhSachGheThat);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu ghế thật:", error);
                alert("Không thể tải sơ đồ phòng chiếu!");
            } finally {
                setLoading(false);
            }
        };

        if (idSuatChieu) {
            fetchBookingData();
        }
    }, [idSuatChieu]);
    // 3. Hàm xử lý khi Click vào 1 cái ghế
    const handleChonGhe = (ghe) => {
        // Nếu ghế đã bị người khác mua -> Không cho click
        if (ghe.daDat) return;

        // Nếu ghế đang nằm trong danh sách chọn -> Bỏ chọn (Xóa khỏi mảng)
        if (gheDangChon.includes(ghe.idGhe)) {
            setGheDangChon(gheDangChon.filter(id => id !== ghe.idGhe));
        }
        // Nếu ghế chưa chọn -> Thêm vào danh sách
        else {
            setGheDangChon([...gheDangChon, ghe.idGhe]);
        }
    };

    // 4. Tính tổng tiền
    const tongTien = gheDangChon.length * (suatChieu?.giaMoiVe || 0);

    // 5. Hàm gửi API thanh toán/đặt vé
    const handleThanhToan = async () => {
        if (gheDangChon.length === 0) {
            alert("Vui lòng chọn ít nhất 1 ghế!");
            return;
        }

        const payload = {
            idSuatChieu: suatChieu.id,
            danhSachIdGhe: gheDangChon, // Mảng ID ghế (VD: [1, 2, 3])
            idNguoiDung: 1,
            idPhuongThucThanhToan: 7
        };

        try {
            // Gửi API đặt vé
            const response = await axiosClient.post('/admin/suat-chieu/dat-ve', payload);
            // Bắt cả 2 trường hợp cấu trúc trả về của Axios
            const maHoaDon = response.data?.idHoaDon || response.data?.data?.idHoaDon || response.data;
            // Lấy tên các ghế đang chọn (VD: "A1, A2") để in lên hóa đơn
            const tenCacGhe = danhSachGhe
                .filter(g => gheDangChon.includes(g.idGhe))
                .map(g => g.tenGhe)
                .join(', ');

            // Nạp dữ liệu vào Hóa đơn
            setInvoiceData({
                maHoaDon: maHoaDon,
                phim: suatChieu.tenPhim,
                ghe: tenCacGhe,
                soLuong: gheDangChon.length,
                tongTien: tongTien,
                ngayDat: new Date().toLocaleString('vi-VN')
            });

            // Mở Modal Hóa đơn lên
            setShowInvoice(true);

        } catch (error) {
            alert("Lỗi đặt vé: " + (error.response?.data || "Vui lòng thử lại sau."));
        }
    };

    if (loading) return <div>Đang tải sơ đồ phòng chiếu...</div>;

    return (
        <div className="booking-container">
            <h2>Phim: {suatChieu?.tenPhim}</h2>
            <div className="screen">MÀN HÌNH</div>

            {/* SƠ ĐỒ GHẾ */}
            <div className="seat-map">
                {danhSachGhe.map((ghe) => {
                    const isSelected = gheDangChon.includes(ghe.idGhe);
                    const isBooked = ghe.daDat;

                    return (
                        <div
                            key={ghe.idGhe}
                            className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleChonGhe(ghe)}
                        >
                            {ghe.tenGhe}
                        </div>
                    );
                })}
            </div>

            {/* CHÚ THÍCH */}
            <div className="legend">
                <div className="legend-item"><div className="seat empty"></div> Ghế trống</div>
                <div className="legend-item"><div className="seat selected"></div> Đang chọn</div>
                <div className="legend-item"><div className="seat booked"></div> Đã bán</div>
            </div>

            {/* THÔNG TIN THANH TOÁN */}
            <div className="checkout-panel">
                <p>Số ghế đã chọn: <strong>{gheDangChon.length}</strong></p>
                <p>Tổng tiền: <strong style={{ color: 'red', fontSize: '20px' }}>{tongTien.toLocaleString('vi-VN')} VNĐ</strong></p>
                <button className="btn-pay" onClick={handleThanhToan}>Thanh toán & In vé</button>
            </div>
            {/* MODAL HÓA ĐƠN */}
            {showInvoice && (
                <div className="modal-overlay">

                    <div className="modal" style={{ maxWidth: '400px', textAlign: 'left', color: '#f8f9fa', backgroundColor: '#1e1e2d', padding: '25px', borderRadius: '10px' }}>

                        <div style={{ borderBottom: '2px dashed #555', paddingBottom: '15px', marginBottom: '15px', textAlign: 'center' }}>
                            <h2 style={{ margin: 0, color: '#ff9800' }}>🎟️ HÓA ĐƠN BÁN VÉ</h2>
                            <small style={{ color: '#aaa' }}>Rạp chiếu phim PTIT Cinema</small>
                        </div>

                        <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                            <p style={{ margin: '5px 0' }}>
                                <strong style={{ color: '#ccc' }}>Mã HD:</strong> {invoiceData?.maHoaDon || "Đang cập nhật..."}
                            </p>
                            <p style={{ margin: '5px 0' }}>
                                <strong style={{ color: '#ccc' }}>Phim:</strong> {invoiceData?.phim}
                            </p>
                            <p style={{ margin: '5px 0' }}>
                                <strong style={{ color: '#ccc' }}>Ngày in:</strong> {invoiceData?.ngayDat}
                            </p>
                            <p style={{ margin: '5px 0' }}>
                                <strong style={{ color: '#ccc' }}>Ghế:</strong> <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{invoiceData?.ghe}</span> ({invoiceData?.soLuong} vé)
                            </p>
                        </div>

                        <div style={{ borderTop: '2px dashed #555', paddingTop: '15px', marginTop: '15px' }}>
                            <h3 style={{ margin: 0, textAlign: 'right', color: '#ff4d4f', fontSize: '22px' }}>
                                Tổng: {invoiceData?.tongTien?.toLocaleString('vi-VN')} VNĐ
                            </h3>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, backgroundColor: '#ff9800', color: 'black', fontWeight: 'bold', border: 'none' }}
                                onClick={() => { window.print(); }}
                            >🖨️ In Hóa Đơn</button>
                            <button
                                className="btn btn-outline"
                                style={{ flex: 1, borderColor: '#555', color: '#ccc' }}
                                onClick={() => {
                                    setShowInvoice(false);
                                    window.location.reload();
                                }}
                            >Đóng & Hoàn tất</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}