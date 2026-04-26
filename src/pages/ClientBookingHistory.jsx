import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function ClientBookingHistory() {
    const [lichSu, setLichSu] = useState([]);
    const [loading, setLoading] = useState(true);


    const currentUser = JSON.parse(localStorage.getItem('cinemax_user'));

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Gọi API lấy lịch sử
                const response = await axiosClient.get(`/api/payments/lich-su/${currentUser.id}`);

                const data = response.data?.data || response.data || [];
                setLichSu(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi tải lịch sử đặt vé:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>Đang tải dữ liệu...</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h2 style={{ textAlign: 'center', color: '#ff9800', borderBottom: '2px dashed #555', paddingBottom: '15px' }}>
                🍿 LỊCH SỬ ĐẶT VÉ CỦA BẠN
            </h2>

            {lichSu.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#aaa' }}>
                    <p>Bạn chưa có giao dịch nào.</p>
                    <a href="/" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>🎬 Đặt vé ngay</a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
                    {lichSu.map((hd) => {
                        // Format lại ngày tháng cho đẹp
                        const ngayChieu = new Date(hd.thoiGianBatDau).toLocaleString('vi-VN');
                        const ngayMua = new Date(hd.ngayThanhToan).toLocaleString('vi-VN');

                        return (
                            <div key={hd.idHoaDon} style={{
                                backgroundColor: '#1e1e2d',
                                borderRadius: '10px',
                                borderLeft: '5px solid #4CAF50',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }}>
                                {/* Thông tin phim & rạp */}
                                <div style={{ flex: 2 }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{hd.tenPhim || 'Phim đang cập nhật'}</h3>
                                    <p style={{ margin: '5px 0', color: '#ccc', fontSize: '14px' }}>📍 Rạp: {hd.tenRap}</p>
                                    <p style={{ margin: '5px 0', color: '#ccc', fontSize: '14px' }}>⏰ Giờ chiếu: <strong style={{ color: '#ff9800' }}>{ngayChieu}</strong></p>
                                    <p style={{ margin: '5px 0', color: '#ccc', fontSize: '14px' }}>💺 Ghế: <strong style={{ color: '#4CAF50' }}>{hd.danhSachGhe}</strong></p>
                                </div>

                                {/* Thông tin thanh toán */}
                                <div style={{ flex: 1, textAlign: 'right', borderLeft: '1px dashed #555', paddingLeft: '20px' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '12px' }}>Mã HD: #{hd.idHoaDon}</p>
                                    <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '12px' }}>Ngày mua: {ngayMua}</p>
                                    <h4 style={{ margin: '10px 0 0 0', color: '#ff4d4f' }}>
                                        {hd.tongTien ? hd.tongTien.toLocaleString('vi-VN') : 0} VNĐ
                                    </h4>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '10px',
                                        padding: '4px 8px',
                                        backgroundColor: hd.trangThai === 'DA_THANH_TOAN' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                        color: hd.trangThai === 'DA_THANH_TOAN' ? '#4CAF50' : '#ff9800',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        {hd.trangThai === 'DA_THANH_TOAN' ? 'Đã Thanh Toán' : hd.trangThai}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}