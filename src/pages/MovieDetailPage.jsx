import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ClientMovieDetails() {
  const { id } = useParams();
  const idPhim = id; // Lấy ID phim từ URL (VD: /phim/1)
  const navigate = useNavigate();

  const [phim, setPhim] = useState(null);
  const [lichChieu, setLichChieu] = useState([]);

  // Giả sử khách đang xem lịch chiếu của ngày hôm nay
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Gọi API lấy chi tiết phim
    // 2. Gọi API lấy lịch chiếu theo Phim và Ngày (Dùng hàm getLichTheoPhim ở backend của bạn)
    const fetchDetails = async () => {
      try {
        // Thay bằng đường dẫn API thật của bạn
        const resPhim = await axiosClient.get(`/public/phim/${idPhim}`);
        const resLich = await axiosClient.get(`/public/suat-chieu/phim/${idPhim}?ngay=${today}`);

        console.log(resPhim.data);
        console.log("Lịch chiếu", resLich.data.data);
        setPhim(resPhim.data?.data || resPhim.data);
        setLichChieu(resLich.data?.data || resLich.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết phim");
      }
    };
    fetchDetails();
  }, [idPhim, today]);

  return (
    <div className="client-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      {/* THÔNG TIN PHIM */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
        <img src={phim?.poster} alt={phim?.ten} style={{ width: '300px', borderRadius: '10px' }} />
        <div>
          <h1 style={{ color: '#ff9800' }}>{phim?.ten}</h1>
          <p><strong>Thời lượng:</strong> {phim?.thoiLuong} phút</p>
          <p><strong>Nội dung:</strong> {phim?.noiDung}</p>
          <p><strong>Ngôn ngữ chính:</strong> {phim?.ngonNguChinh}</p>

        </div>
      </div>

      {/* LỊCH CHIẾU */}
      <h2 style={{ borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>LỊCH CHIẾU HÔM NAY</h2>

      {lichChieu.length === 0 ? (
        <p>Hôm nay chưa có lịch chiếu cho phim này.</p>
      ) : (
        lichChieu.map((rap, index) => (
          <div key={index} style={{ backgroundColor: '#1e1e2d', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#4CAF50' }}>🏢 {rap.tenRap}</h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {/* Render danh sách các suất chiếu (nút bấm giờ) */}
              {rap.danhSachSuat.map((suat) => (
                <button
                  key={suat.idSuat}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    border: '1px solid #ff9800',
                    color: '#ff9800',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  // 👉 ĐIỂM QUAN TRỌNG NHẤT LÀ ĐÂY:
                  // Chuyển hướng sang trang Sơ đồ ghế và mang theo ID suất chiếu
                  onClick={() => navigate(`/dat-ve/${suat.idSuat} `)}
                >
                  {suat.batDau}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}