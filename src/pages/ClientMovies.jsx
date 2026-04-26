import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Thay đổi đường dẫn cho đúng

export default function ClientMovies() {
    const navigate = useNavigate();

    // 1. Các State quản lý dữ liệu
    const [movies, setMovies] = useState([]); // Chứa danh sách phim gốc từ API
    const [genres, setGenres] = useState([]); // Chứa danh sách thể loại từ API

    // 2. Các State quản lý bộ lọc
    const [searchTerm, setSearchTerm] = useState(''); // Chữ nhập vào ô tìm kiếm
    const [selectedGenre, setSelectedGenre] = useState('Tất cả'); // Thể loại đang chọn

    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu khi vào trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi 2 API song song (nhớ đổi URL cho khớp với Backend của bạn)
                const [resMovies, resGenres] = await Promise.all([
                    axiosClient.get('/public/phim/dang-chieu'),
                    axiosClient.get('/public/phim/the-loai') // Nếu không có API này, mình sẽ hướng dẫn cách trích xuất thể loại bên dưới
                ]);

                const dsPhim = resMovies.data?.data || resMovies.data || [];
                const dsTheLoai = resGenres.data?.data || resGenres.data || [];

                setMovies(dsPhim);
                setGenres(dsTheLoai);

            } catch (error) {
                console.error("Lỗi khi tải danh sách phim:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3. LOGIC LỌC PHIM (Vừa tìm kiếm chữ, vừa lọc thể loại)
    const filteredMovies = movies.filter((movie) => {
        // Lọc theo thể loại: Nếu đang chọn 'Tất cả' thì luôn đúng, nếu không thì so sánh tên thể loại
        const matchGenre = selectedGenre === 'Tất cả' ||
            (Array.isArray(movie.tenTheLoais) && movie.tenTheLoais.includes(selectedGenre));
        // Lọc theo tên phim (không phân biệt hoa thường)
        const matchSearch = movie.ten?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchGenre && matchSearch;
    });

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Đang tải danh sách phim...</div>;

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: 'white' }}>
            <h1 style={{ marginBottom: '30px', borderLeft: '5px solid #ffc107', paddingLeft: '15px' }}>Danh sách phim</h1>

            {/* THANH CÔNG CỤ: TÌM KIẾM & LỌC */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', alignItems: 'center', flexWrap: 'wrap' }}>

                {/* Ô Tìm Kiếm */}
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm phim..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            backgroundColor: '#1e1e1e',
                            border: '1px solid #333',
                            borderRadius: '20px',
                            padding: '10px 15px 10px 35px',
                            color: 'white',
                            outline: 'none',
                            width: '250px'
                        }}
                    />
                </div>

                {/* Danh sách nút Thể Loại */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                    <button
                        onClick={() => setSelectedGenre('Tất cả')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            backgroundColor: selectedGenre === 'Tất cả' ? '#ffc107' : '#2a2a2a',
                            color: selectedGenre === 'Tất cả' ? 'black' : 'white',
                            transition: 'all 0.3s'
                        }}
                    >
                        Tất cả
                    </button>

                    {genres.map((genre) => (
                        <button
                            key={genre.idTheLoai}
                            onClick={() => setSelectedGenre(genre.noiDung)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '20px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                backgroundColor: selectedGenre === genre.noiDung ? '#ffc107' : '#2a2a2a',
                                color: selectedGenre === genre.noiDung ? 'black' : 'white',
                                transition: 'all 0.3s'
                            }}
                        >
                            {genre.noiDung}
                        </button>
                    ))}
                </div>
            </div>

            {/* DANH SÁCH PHIM */}
            {filteredMovies.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px', fontSize: '18px' }}>
                    Không tìm thấy phim nào phù hợp.
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px'
                }}>
                    {filteredMovies.map((movie) => (
                        <div key={movie.id} style={{
                            backgroundColor: '#1e1e1e',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            {/* Ảnh Poster */}
                            <div style={{ width: '100%', height: '320px', backgroundColor: '#333' }}>
                                <img
                                    src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                    alt={movie.ten}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Thông tin phim */}
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {movie.ten}
                                </h3>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {Array.isArray(movie.tenTheLoais) && movie.tenTheLoais.length > 0 ? (
                                        movie.tenTheLoais.map((tl, index) => (
                                            <span key={index} style={{
                                                padding: '3px 8px',
                                                backgroundColor: 'rgba(255, 193, 7, 0.1)', // Nền vàng nhạt
                                                color: '#ffc107',
                                                border: '1px solid #555',
                                                borderRadius: '12px',
                                                fontSize: '11px', // Chữ nhỏ hơn ở trang chi tiết một chút
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {tl}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ color: '#aaa', fontSize: '13px' }}>🎭 Đang cập nhật</span>
                                    )}
                                </div>
                                <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '14px' }}>
                                    ⏱️ {movie.thoiLuong} phút
                                </p>

                                <button style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #ffc107',
                                    color: '#ffc107',
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                    Mua vé
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}