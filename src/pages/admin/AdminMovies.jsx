import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { theLoai } from '../../data/mockData';

// Hàm hỗ trợ format ngày cho thẻ <input type="date">
const formatDateForInput = (dateData) => {
  if (!dateData) return '';
  if (Array.isArray(dateData)) {
    const [year, month, day] = dateData;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (typeof dateData === 'string') return dateData.split('T')[0];
  return '';
};

// Hàm hiển thị ngày ra bảng (DD/MM/YYYY)
const formatDisplayDate = (dateData) => {
  const formatted = formatDateForInput(dateData);
  if (!formatted) return 'Chưa cập nhật';
  const [year, month, day] = formatted.split('-');
  return `${day}/${month}/${year}`;
};
export default function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableGenres, setAvailableGenres] = useState([]); // Danh sách gốc từ DB
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);

  // State cho Modal (Thêm/Sửa)
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // null = Thêm mới, !null = Đang sửa
  const [formData, setFormData] = useState({
    ten: '', noiDung: '', thoiLuong: '', ngonNguChinh: '', poster: '', ngayPhatHanh: '', theLoaiIds: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  // 1. Lấy danh sách phim từ Backend
  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Endpoint admin để lấy toàn bộ phim (có thể bao gồm cả phim đã ẩn)
      const res = await axiosClient.get('/admin/phim');
      setMovies(res.data.data || res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Lỗi lấy danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Sử dụng API lấy thể loại mà bạn đã có
        const res = await axiosClient.get('/public/phim/the-loai');
        const data = res.data?.data || res.data || [];
        setAvailableGenres(data);
      } catch (error) {
        console.error("Lỗi tải danh sách thể loại:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => { fetchMovies(); }, []);

  // 2. Xử lý mở Modal
  const openModal = (movie = null) => {
    setImageFile(null); // Reset file
    if (movie) {
      setEditingMovie(movie);
      setFormData({ ...movie, ngayPhatHanh: formatDateForInput(movie.ngayPhatHanh) });
      setPreviewUrl(movie.poster); // Hiện ảnh cũ nếu đang sửa
    } else {
      setEditingMovie(null);
      setFormData({ ten: '', noiDung: '', thoiLuong: '', ngonNguChinh: '', poster: '', ngayPhatHanh: '', theLoaiIds: '' });
      setPreviewUrl(''); // Trống ảnh nếu thêm mới
    }
    setShowModal(true);
  };
  const handleGenreChange = (idTheLoai) => {
    const currentIds = selectedGenreIds || [];

    if (currentIds.includes(idTheLoai)) {
      setSelectedGenreIds(currentIds.filter(id => id !== idTheLoai));
    } else {
      setSelectedGenreIds([...currentIds, idTheLoai]);
    }
  };

  // 3. Xử lý lưu (Thêm hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGenreIds.length === 0) {
        alert("Vui lòng chọn ít nhất 1 thể loại cho phim!");
        return;
      }
      let finalPosterUrl = formData.poster;

      // NẾU NGƯỜI DÙNG CÓ CHỌN FILE ẢNH MỚI -> GỌI API UPLOAD TRƯỚC
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        // Gọi API chuyên xử lý upload ảnh của bạn (Ví dụ: /api/upload)
        const uploadRes = await axiosClient.post('/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Giả sử Backend trả về: { url: "https://..." }
        finalPosterUrl = uploadRes?.data?.data || uploadRes?.data || uploadRes;
      }
      if (!finalPosterUrl?.data || finalPosterUrl?.data?.trim() === '') {
        // Đây là link một bức ảnh xám có chữ "No Poster" rất lịch sự
        finalPosterUrl = 'https://via.placeholder.com/300x450?text=Chua+Cap+Nhat+Poster';
      }
      // Nạp URL mới vào cục dữ liệu chuẩn bị gửi đi
      const submitData = { ...formData, poster: finalPosterUrl.data, theLoaiIds: selectedGenreIds };
      if (editingMovie) {
        // GỌI API CẬP NHẬT (PUT)
        await axiosClient.put(`/admin/phim/${editingMovie.id}`, submitData);
        alert("Cập nhật phim thành công!");
      } else {
        // GỌI API THÊM MỚI (POST)
        await axiosClient.post('/admin/phim', submitData);
        alert("Thêm phim mới thành công!");
      }
      setShowModal(false);
      fetchMovies(); // Reload lại danh sách
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response || error);
      alert("Lỗi khi lưu: " + (error.response?.data?.message || error.response?.data || "Vui lòng xem console"));
    }
  };

  // 4. Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bộ phim này không?")) {
      try {
        await axiosClient.delete(`/admin/phim/${id}`);
        fetchMovies();
      } catch (error) {
        alert("Không thể xóa phim này (có thể do đã có suất chiếu liên quan)");
      }
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Tạo một URL tạm thời để hiển thị ảnh ngay lập tức trên form
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  return (
    <div className="admin-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>🎬 Quản lý danh sách phim</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Thêm phim mới</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>Tên phim</th>
            <th>Thời lượng</th>
            <th>Ngày phát hành</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
          ) : movies.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td><img src={m.poster} alt={m.ten} style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} /></td>
              <td style={{ fontWeight: 'bold' }}>{m.ten}</td>
              <td>{m.thoiLuong} phút</td>
              <td>{formatDisplayDate(m.ngayPhatHanh)}</td>
              <td>
                <button className="btn btn-sm btn-outline" onClick={() => openModal(m)} style={{ marginRight: '5px' }}>Sửa</button>
                <button className="btn btn-sm btn-outline" onClick={() => handleDelete(m.id)} style={{ color: 'var(--red)' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            width: '600px',
            maxWidth: '95%',
            padding: '30px',
            borderRadius: '10px',
            maxHeight: '90vh',
            overflowY: 'auto', color: 'black'
          }}>
            <h3 style={{ color: 'white' }}>{editingMovie ? "📝 Chỉnh sửa phim" : "✨ Thêm phim mới"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên phim</label>
                <input value={formData.ten} onChange={e => setFormData({ ...formData, ten: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div className="form-group">
                  <label>Thời lượng (phút)</label>
                  <input type="number" value={formData.thoiLuong || ''} onChange={e => setFormData({ ...formData, thoiLuong: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ngôn ngữ</label>
                  <input value={formData.ngonNguChinh || ''} onChange={e => setFormData({ ...formData, ngonNguChinh: e.target.value })} required />
                </div>
                {/* 👉 Ô MỚI THÊM VÀO: NGÀY PHÁT HÀNH */}
                <div className="form-group">
                  <label>Ngày phát hành</label>
                  <input type="date" value={formData.ngayPhatHanh || ''} onChange={e => setFormData({ ...formData, ngayPhatHanh: e.target.value })} required />
                </div>
              </div>
              {/* KHU VỰC UPLOAD ẢNH POSTER */}
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Poster phim</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  {/* Ô hiển thị ảnh xem trước */}
                  <div style={{ width: '100px', height: '140px', border: '2px dashed #ccc', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center' }}>Chưa có ảnh</span>
                    )}
                  </div>

                  {/* Nút chọn file */}
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control"
                      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                      Định dạng hỗ trợ: JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#ffc107' }}>
                  Thể loại phim:
                </label>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '15px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                  border: '1px solid #333'
                }}>
                  {availableGenres.map((genre) => (
                    <label
                      key={genre.idTheLoai}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: selectedGenreIds?.includes(genre.idTheLoai) ? '#333' : 'transparent',
                        transition: '0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        // Kiểm tra xem ID này có nằm trong danh sách đã chọn không
                        checked={selectedGenreIds?.includes(genre.idTheLoai) || false}
                        onChange={() => handleGenreChange(genre.idTheLoai)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#ffc107',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ color: selectedGenreIds?.includes(genre.idTheLoai) ? '#ffc107' : '#eee' }}>
                        {genre.noiDung}
                      </span>
                    </label>
                  ))}
                </div>
                <small style={{ color: '#888', marginTop: '8px', display: 'block' }}>
                  * Bạn có thể chọn nhiều thể loại cho một bộ phim.
                </small>
              </div>
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Mô tả nội dung</label>
                <textarea rows="4" value={formData.noiDung} onChange={e => setFormData({ ...formData, noiDung: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Lưu thay đổi</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )
      }
    </div >
  );
}