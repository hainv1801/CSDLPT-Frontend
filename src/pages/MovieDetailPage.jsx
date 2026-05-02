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
  const [lichChieuToanQuoc, setLichChieuToanQuoc] = useState([]); // Lưu toàn bộ lịch chiếu

  // Các State phục vụ bộ lọc
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [availableDates] = useState(generateDates(7));

  // State MỚI: Dùng để lọc Rạp theo khu vực
  const [selectedKhuVuc, setSelectedKhuVuc] = useState('Tất cả');
  const [danhSachKhuVuc, setDanhSachKhuVuc] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resPhim = await axiosClient.get(`/public/phim/${idPhim}`);
        const resLich = await axiosClient.get(`/public/suat-chieu/phim/${idPhim}?ngay=${selectedDate}`);

        setPhim(resPhim.data?.data || resPhim.data);

        const lichData = resLich.data?.data || resLich.data || [];
        setLichChieuToanQuoc(lichData);

        // Trích xuất danh sách các khu vực có rạp đang chiếu phim này để làm nút lọc
        if (lichData.length > 0) {
          // Lấy danh sách tên rạp (Trong API hiện tại của bạn, rạp trả về chưa có cột khuVuc, 
          // nên ta tạm dùng Tên Rạp để lọc. Nếu API trả về được Khu Vực thì tốt hơn).
          const dskv = [...new Set(lichData.map(rap => rap.tenRap))];
          setDanhSachKhuVuc(dskv);
        }

      } catch (error) {
        console.error("Lỗi tải chi tiết phim");
      }
    };
    fetchDetails();
  }, [idPhim, selectedDate]);

  // Lọc lịch chiếu theo khu vực khách chọn
  const lichChieuHienThi = selectedKhuVuc === 'Tất cả'
    ? lichChieuToanQuoc
    : lichChieuToanQuoc.filter(rap => rap.tenRap === selectedKhuVuc);

  return (
    <div className="client-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>

      {/* 1. THÔNG TIN PHIM */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <img src={phim?.poster} alt={phim?.ten} style={{ width: '300px', borderRadius: '10px', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#ff9800', fontSize: '2.5rem', marginBottom: '15px' }}>{phim?.ten}</h1>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {Array.isArray(phim?.danhSachTheLoai) && phim.danhSachTheLoai.map((tl, index) => (
              <span key={index} style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 193, 7, 0.15)',
                border: '1px solid rgba(255, 193, 7, 0.5)',
                color: '#ffc107',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                {tl}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}><strong>⏱️ Thời lượng:</strong> {phim?.thoiLuong} phút</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}><strong>🗣️ Ngôn ngữ:</strong> {phim?.ngonNguChinh}</p>
          <div style={{ marginTop: '20px', lineHeight: '1.8', color: '#ccc' }}>
            <strong style={{ color: 'white' }}>📖 Nội dung:</strong> <br />
            {phim?.noiDung}
          </div>
        </div>
      </div>

      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#ff9800' }}>📅 LỊCH CHIẾU</span>
      </h2>

      {/* 2. THANH CHỌN NGÀY */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '10px' }}>
        {availableDates.map(date => {
          const d = new Date(date);
          const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
          const isSelected = date === selectedDate;

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedKhuVuc('Tất cả'); // Đổi ngày thì reset lại rạp
              }}
              style={{
                padding: '10px 24px',
                backgroundColor: isSelected ? '#ff9800' : '#1e1e2d',
                color: isSelected ? 'black' : 'white',
                border: isSelected ? 'none' : '1px solid #333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {date === today ? "Hôm nay" : dateStr}
            </button>
          )
        })}
      </div>

      {/* 3. THANH LỌC THEO RẠP (MỚI) */}
      {lichChieuToanQuoc.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '30px', paddingBottom: '10px' }}>
          <button
            onClick={() => setSelectedKhuVuc('Tất cả')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedKhuVuc === 'Tất cả' ? '#4CAF50' : '#2a2a3e',
              color: selectedKhuVuc === 'Tất cả' ? 'white' : '#aaa',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            Tất cả các rạp
          </button>
          {danhSachKhuVuc.map((tenRap, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedKhuVuc(tenRap)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedKhuVuc === tenRap ? '#4CAF50' : '#2a2a3e',
                color: selectedKhuVuc === tenRap ? 'white' : '#aaa',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {tenRap}
            </button>
          ))}
        </div>
      )}

      {/* 4. HIỂN THỊ DANH SÁCH RẠP VÀ GIỜ CHIẾU ĐÃ LỌC */}
      {lichChieuToanQuoc.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1e1e2d', borderRadius: '10px' }}>
          <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Chưa có lịch chiếu cho phim này trong ngày đã chọn.</p>
        </div>
      ) : (
        lichChieuHienThi.map((rap, index) => (
          <div key={index} style={{ backgroundColor: '#1e1e2d', padding: '25px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #4CAF50' }}>
            <h3 style={{ marginTop: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🏢 {rap.tenRap}
            </h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
              {rap.danhSachSuat.map((suat) => (
                <button
                  key={suat.idSuat}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid #ff9800',
                    color: '#ff9800',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ff9800';
                    e.target.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                    e.target.style.color = '#ff9800';
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