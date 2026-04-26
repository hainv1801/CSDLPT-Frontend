
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import axiosClient from '../api/axiosClient'; // Import thư viện API

export default function HomePage() {
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);

  // 1. Tạo state để lưu dữ liệu trả về từ Backend
  const [phim, setPhim] = useState([]);
  const [rap, setRap] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái chờ load dữ liệu

  // 2. Dùng useEffect để gọi API ngay khi vào trang chủ
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Gọi song song 2 API lấy phim và rạp
        const [phimRes, rapRes] = await Promise.all([
          axiosClient.get('/public/phim/dang-chieu'),
          axiosClient.get('/public/rap') // Lưu ý: Chỉnh lại endpoint này nếu backend của bạn đặt tên khác
        ]);
        console.log("=== KIỂM TRA DỮ LIỆU PHIM ===", phimRes.data);
        console.log("=== KIỂM TRA DỮ LIỆU RẠP ===", rapRes.data);
        setPhim(phimRes.data.data);
        setRap(rapRes.data.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 3. Xử lý màn hình chờ trong lúc gọi API (tránh lỗi undefined)
  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (phim.length === 0) return <div className="container section" style={{ textAlign: 'center' }}>Chưa có phim nào chiếu.</div>;

  const featured = phim.slice(0, 4);
  const hero = featured[heroIdx] || featured[0]; // Lấy phim nổi bật an toàn
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🔥 Phim hot</span>
          <h1>{hero.ten}</h1>
          <p>{hero.noiDung.substring(0, 120)}...</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => navigate(`/movie/${hero.id}`)}>Đặt vé ngay</button>
            <button className="btn btn-outline" onClick={() => navigate('/movies')}>Xem tất cả</button>
          </div>
        </div>
        <div className="hero-poster">
          <img src={hero.poster} alt={hero.ten} />
        </div>
        <div className="hero-dots">
          {featured.map((_, i) => (
            <div key={i} className={`dot ${i === heroIdx ? 'active' : ''}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </section>

      {/* PHIM ĐANG CHIẾU */}
      <section className="section container">
        <h2 className="section-title">Phim đang chiếu</h2>
        <div className="movies-grid">
          {phim.map((m, index) => <MovieCard key={m.id || m.idPhim || index} movie={m} />)}
        </div>
      </section>

      {/* HỆ THỐNG RẠP */}
      <section className="section container">
        <h2 className="section-title">Hệ thống 9 chi nhánh</h2>
        <div className="cinema-grid">
          {rap.map((r, index) => (
            <div className="cinema-card" key={r.id || r.idRap || index}>
              <div className="cinema-icon">🏛️</div>
              <div>
                <h3>{r.tenRap}</h3>
                <p>{r.diaChi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
