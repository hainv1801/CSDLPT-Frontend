import { useNavigate } from 'react-router-dom';
import { getPhimTheLoai } from '../data/mockData';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const genres = getPhimTheLoai(movie.id);

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="poster">
        <img src={movie.poster} alt={movie.ten} />
        <div className="poster-overlay">
          <button className="btn btn-primary btn-sm">Đặt vé ngay</button>
        </div>
      </div>
      <div className="card-info">
        <div className="card-title">{movie.ten}</div>
        <div className="card-meta">
          <span className="duration">🕐 {movie.thoiLuong} phút</span>
          <span>{movie.ngonNguChinh}</span>
        </div>
        <div className="card-genres">
          {genres.map(g => <span key={g.id} className="genre-tag">{g.noiDung}</span>)}
        </div>
      </div>
    </div>
  );
}
