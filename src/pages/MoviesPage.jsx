import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import axiosClient from '../api/axiosClient';

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState(0);

  // 1. Tạo state chứa dữ liệu từ API
  const [phim, setPhim] = useState([]);
  const [theLoai, setTheLoai] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Gọi API
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const [phimRes, theLoaiRes] = await Promise.all([
          axiosClient.get('/public/phim/dang-chieu'),
          axiosClient.get('/public/the-loai') // Lưu ý: Chỉnh lại endpoint thể loại nếu backend đặt khác
        ]);
        setPhim(phimRes.data);
        setTheLoai(theLoaiRes.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách phim và thể loại:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoviesData();
  }, []);

  // 3. Logic lọc phim (kiểm tra kiểu dữ liệu của theLoai trả về từ API)
  const filtered = phim.filter(m => {
    const matchSearch = m.ten?.toLowerCase().includes(search.toLowerCase());

    // Lưu ý: Nếu Spring Boot trả về danh sách đối tượng thể loại (vd: [{id: 1, ten: "Hành động"}]),
    // bạn cần dùng m.theLoai.some(tl => tl.id === filterGenre) thay vì m.theLoai.includes
    const matchGenre = filterGenre === 0 ||
      (m.theLoai && m.theLoai.some(tl => (tl.id || tl) === filterGenre));

    return matchSearch && matchGenre;
  });

  if (loading) return <div className="container section" style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải danh sách phim...</div>;

  return (
    <div className="container section">
      <h1 className="section-title">Danh sách phim</h1>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input placeholder="🔍 Tìm phim..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: '300px' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className={`step-btn ${filterGenre === 0 ? 'active' : ''}`} onClick={() => setFilterGenre(0)}>Tất cả</button>
          {theLoai.map(tl => (
            <button key={tl.id} className={`step-btn ${filterGenre === tl.id ? 'active' : ''}`} onClick={() => setFilterGenre(tl.id)}>
              {tl.noiDung}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text2)', textAlign: 'center', padding: '60px 0' }}>Không tìm thấy phim nào.</p>
      ) : (
        <div className="movies-grid">{filtered.map(m => <MovieCard key={m.id} movie={m} />)}</div>
      )}
    </div>
  );
}
