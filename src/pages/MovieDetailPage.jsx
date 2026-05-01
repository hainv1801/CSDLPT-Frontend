import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// Hàm phụ trợ tạo danh sách 7 ngày tới (YYYY-MM-DD)
const generateDates = (numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export default function ClientMovieDetails() {
  const { id } = useParams();
  const idPhim = id;
  const navigate = useNavigate();

  const [phim, setPhim] = useState(null);
  const [lichChieu, setLichChieu] = useState([]);

  // Lấy ra ngày hôm nay chuẩn định dạng
  const today = new Date().toISOString().split('T')[0];

  // State: Lưu ngày khách hàng đang chọn (Mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState(today);

  // State: Lưu danh sách 7 ngày tới để in ra UI
  const [availableDates] = useState(generateDates(7));

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resPhim = await axiosClient.get(`/public/phim/${idPhim}`);
        // Chuyền tham số selectedDate vào API thay vì fix cứng today
        const resLich = await axiosClient.get(`/public/suat-chieu/phim/${idPhim}?ngay=${selectedDate}`);

        setPhim(resPhim.data?.data || resPhim.data);
        setLichChieu(resLich.data?.data || resLich.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết phim");
      }
    };
    fetchDetails();
  }, [idPhim, selectedDate]); // Thêm selectedDate vào dependency array để API tự gọi lại khi đổi ngày

  return (
    <div className="client-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      {/* THÔNG TIN PHIM */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <img src={phim?.poster} alt={phim?.ten} style={{ width: '300px', borderRadius: '10px' }} />
        <div>
          <h1 style={{ color: '#ff9800' }}>{phim?.ten}</h1>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {Array.isArray(phim?.danhSachTheLoai) && phim.danhSachTheLoai.map((tl, index) => (
              <span key={index} style={{
                padding: '5px 12px',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid #ffc107',
                color: '#ffc107',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                {tl}
              </span>
            ))}
          </div>
          <p><strong>Thời lượng:</strong> {phim?.thoiLuong} phút</p>
          <p><strong>Nội dung:</strong> {phim?.noiDung}</p>
          <p><strong>Ngôn ngữ chính:</strong> {phim?.ngonNguChinh}</p>
        </div>
      </div>

      {/* KHU VỰC LỊCH CHIẾU */}
      <h2 style={{ borderBottom: '2px solid #ff9800', paddingBottom: '10px', marginBottom: '20px' }}>LỊCH CHIẾU</h2>

      {/* THANH CHỌN NGÀY */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '30px', paddingBottom: '10px' }}>
        {availableDates.map(date => {
          const d = new Date(date);
          const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={{
                padding: '10px 20px',
                backgroundColor: isSelected ? '#ff9800' : 'transparent',
                color: isSelected ? 'black' : '#ff9800',
                border: '1px solid #ff9800',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              {date === today ? "Hôm nay" : dateStr}
            </button>
          )
        })}
      </div>

      {/* HIỂN THỊ DANH SÁCH RẠP VÀ GIỜ CHIẾU */}
      {lichChieu.length === 0 ? (
        <p style={{ color: '#aaa', fontStyle: 'italic' }}>Không có lịch chiếu cho phim này trong ngày đã chọn.</p>
      ) : (
        lichChieu.map((rap, index) => (
          <div key={index} style={{ backgroundColor: '#1e1e2d', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#4CAF50' }}>🏢 {rap.tenRap}</h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
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
                  onClick={() => navigate(`/dat-ve/${suat.idSuat}`)}
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