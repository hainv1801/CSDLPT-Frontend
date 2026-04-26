// ==================== MOCK DATA - Hệ thống quản lý bán vé xem phim ====================

export const theLoai = [
  { id: 1, noiDung: 'Hành động' }, { id: 2, noiDung: 'Hài hước' },
  { id: 3, noiDung: 'Kinh dị' }, { id: 4, noiDung: 'Tâm lý' },
  { id: 5, noiDung: 'Hoạt hình' }, { id: 6, noiDung: 'Khoa học viễn tưởng' },
  { id: 7, noiDung: 'Tình cảm' }, { id: 8, noiDung: 'Phiêu lưu' },
];

export const phim = [
  { id: 1, ten: 'Lật Mặt 8: Vòng Tay Nắng', ngayPhatHanh: '2025-04-25', thoiLuong: 132, ngonNguChinh: 'Tiếng Việt', noiDung: 'Câu chuyện cảm động về tình cảm gia đình, sự hy sinh và lòng bao dung giữa các thế hệ trong một gia đình Việt Nam.', poster: 'https://picsum.photos/seed/movie1/400/600', theLoai: [4, 7] },
  { id: 2, ten: 'Avengers: Doomsday', ngayPhatHanh: '2025-05-01', thoiLuong: 165, ngonNguChinh: 'English', noiDung: 'Các siêu anh hùng tập hợp lần cuối để đối đầu mối đe dọa lớn nhất từ đa vũ trụ trong trận chiến quyết định số phận nhân loại.', poster: 'https://picsum.photos/seed/movie2/400/600', theLoai: [1, 6, 8] },
  { id: 3, ten: 'Quỷ Nhập Tràng', ngayPhatHanh: '2025-04-18', thoiLuong: 108, ngonNguChinh: 'Tiếng Việt', noiDung: 'Một nhóm bạn trẻ vô tình đánh thức linh hồn cổ đại trong chuyến du lịch tới ngôi làng bí ẩn ở miền Tây.', poster: 'https://picsum.photos/seed/movie3/400/600', theLoai: [3] },
  { id: 4, ten: 'Doraemon: Nobita và Cuộc Phiêu Lưu Vũ Trụ', ngayPhatHanh: '2025-05-10', thoiLuong: 104, ngonNguChinh: 'Tiếng Nhật', noiDung: 'Nobita cùng Doraemon khám phá hành tinh mới, kết bạn với người ngoài hành tinh và bảo vệ vũ trụ khỏi thế lực hắc ám.', poster: 'https://picsum.photos/seed/movie4/400/600', theLoai: [5, 8] },
  { id: 5, ten: 'Mai', ngayPhatHanh: '2025-03-15', thoiLuong: 125, ngonNguChinh: 'Tiếng Việt', noiDung: 'Câu chuyện tình yêu đầy cảm xúc giữa chàng trai Sài Gòn và cô gái bí ẩn mang tên Mai trong bối cảnh đô thị hiện đại.', poster: 'https://picsum.photos/seed/movie5/400/600', theLoai: [4, 7] },
  { id: 6, ten: 'Mission Impossible: The Final Reckoning', ngayPhatHanh: '2025-05-20', thoiLuong: 148, ngonNguChinh: 'English', noiDung: 'Ethan Hunt đối mặt nhiệm vụ nguy hiểm nhất khi AI siêu trí tuệ đe dọa kiểm soát toàn bộ hệ thống vũ khí hạt nhân thế giới.', poster: 'https://picsum.photos/seed/movie6/400/600', theLoai: [1, 8] },
  { id: 7, ten: 'Cười Xuyên Biên Giới', ngayPhatHanh: '2025-04-30', thoiLuong: 96, ngonNguChinh: 'Tiếng Việt', noiDung: 'Bộ phim hài hước kể về cuộc hành trình xuyên Việt đầy bất ngờ của nhóm bạn thân khi tham gia gameshow truyền hình.', poster: 'https://picsum.photos/seed/movie7/400/600', theLoai: [2] },
  { id: 8, ten: 'Interstellar 2', ngayPhatHanh: '2025-06-01', thoiLuong: 170, ngonNguChinh: 'English', noiDung: 'Hành trình xuyên không gian và thời gian để cứu nhân loại khi Trái Đất đứng trước nguy cơ diệt vong lần thứ hai.', poster: 'https://picsum.photos/seed/movie8/400/600', theLoai: [6, 4] },
];

export const rap = [
  { id: 1, tenRap: 'CineMax Vĩnh Phúc', diaChi: '123 Ngô Quyền, TP. Vĩnh Yên, Vĩnh Phúc', khuVuc: 'KV_01' },
  { id: 2, tenRap: 'CineMax Thái Nguyên', diaChi: '456 Lương Ngọc Quyến, TP. Thái Nguyên', khuVuc: 'KV_02' },
  { id: 3, tenRap: 'CineMax Bắc Giang', diaChi: '789 Xương Giang, TP. Bắc Giang', khuVuc: 'KV_03' },
  { id: 4, tenRap: 'CineMax Bắc Ninh', diaChi: '321 Lý Thái Tổ, TP. Bắc Ninh', khuVuc: 'KV_04' },
  { id: 5, tenRap: 'CineMax Hưng Yên', diaChi: '654 Quang Trung, TP. Hưng Yên', khuVuc: 'KV_05' },
  { id: 6, tenRap: 'CineMax Hà Nam', diaChi: '987 Trần Hưng Đạo, TP. Phủ Lý, Hà Nam', khuVuc: 'KV_06' },
  { id: 7, tenRap: 'CineMax Hòa Bình', diaChi: '147 Cù Chính Lan, TP. Hòa Bình', khuVuc: 'KV_07' },
  { id: 8, tenRap: 'CineMax Phú Thọ', diaChi: '258 Hùng Vương, TP. Việt Trì, Phú Thọ', khuVuc: 'KV_08' },
  { id: 9, tenRap: 'CineMax Thanh Hóa', diaChi: '369 Lê Lợi, TP. Thanh Hóa', khuVuc: 'KV_09' },
];

export const phongChieu = [
  { id: 1, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 1, ten: 'Phòng 1' },
  { id: 2, trangThai: 'Hoạt động', sucChua: 100, id_Rap: 1, ten: 'Phòng 2' },
  { id: 3, trangThai: 'Bảo trì', sucChua: 60, id_Rap: 1, ten: 'Phòng 3' },
  { id: 4, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 2, ten: 'Phòng 1' },
  { id: 5, trangThai: 'Hoạt động', sucChua: 100, id_Rap: 2, ten: 'Phòng 2' },
  { id: 6, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 3, ten: 'Phòng 1' },
  { id: 7, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 4, ten: 'Phòng 1' },
  { id: 8, trangThai: 'Hoạt động', sucChua: 100, id_Rap: 5, ten: 'Phòng 1' },
  { id: 9, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 6, ten: 'Phòng 1' },
  { id: 10, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 7, ten: 'Phòng 1' },
  { id: 11, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 8, ten: 'Phòng 1' },
  { id: 12, trangThai: 'Hoạt động', sucChua: 80, id_Rap: 9, ten: 'Phòng 1' },
];

// Generate ghế for each phòng chiếu: 8 hàng x 10 cột
export const ghe = [];
let gheId = 1;
phongChieu.forEach(pc => {
  for (let h = 1; h <= 8; h++) {
    for (let c = 1; c <= 10; c++) {
      ghe.push({ id: gheId++, hang: h, cot: c, trangThai: 'Hoạt động', id_PhongChieu: pc.id });
    }
  }
});

export const suatChieu = [
  { id: 1, giaMoiVe: 75000, thoiGianBatDau: '2025-04-25T09:00', id_PhongChieu: 1, id_Phim: 1 },
  { id: 2, giaMoiVe: 90000, thoiGianBatDau: '2025-04-25T14:00', id_PhongChieu: 1, id_Phim: 2 },
  { id: 3, giaMoiVe: 95000, thoiGianBatDau: '2025-04-25T19:30', id_PhongChieu: 2, id_Phim: 1 },
  { id: 4, giaMoiVe: 85000, thoiGianBatDau: '2025-04-25T10:00', id_PhongChieu: 4, id_Phim: 3 },
  { id: 5, giaMoiVe: 70000, thoiGianBatDau: '2025-04-25T13:30', id_PhongChieu: 4, id_Phim: 4 },
  { id: 6, giaMoiVe: 90000, thoiGianBatDau: '2025-04-26T09:00', id_PhongChieu: 1, id_Phim: 5 },
  { id: 7, giaMoiVe: 100000, thoiGianBatDau: '2025-04-26T15:00', id_PhongChieu: 2, id_Phim: 6 },
  { id: 8, giaMoiVe: 80000, thoiGianBatDau: '2025-04-26T20:00', id_PhongChieu: 6, id_Phim: 7 },
  { id: 9, giaMoiVe: 110000, thoiGianBatDau: '2025-04-27T19:00', id_PhongChieu: 7, id_Phim: 8 },
  { id: 10, giaMoiVe: 75000, thoiGianBatDau: '2025-04-27T10:00', id_PhongChieu: 8, id_Phim: 2 },
  { id: 11, giaMoiVe: 85000, thoiGianBatDau: '2025-04-25T16:00', id_PhongChieu: 1, id_Phim: 7 },
  { id: 12, giaMoiVe: 95000, thoiGianBatDau: '2025-04-25T21:00', id_PhongChieu: 2, id_Phim: 8 },
];

export const phuongThucThanhToan = [
  { id: 1, noiDung: 'Tiền mặt' },
  { id: 2, noiDung: 'VNPay' },
  { id: 3, noiDung: 'Momo' },
  { id: 4, noiDung: 'Thẻ ngân hàng' },
];

export const nguoiDung = [
  { id: 1, taiKhoan: 'admin', matKhau: 'admin123', hoTen: 'Admin', ngaySinh: '2003-05-15', SDT: '0901234567', email: 'admin@cinemax.vn', vaiTro: 'Admin' },
  { id: 2, taiKhoan: 'quanly01', matKhau: '123456', hoTen: 'QuanLy', ngaySinh: '1990-03-20', SDT: '0912345678', email: 'minh.tv@cinemax.vn', vaiTro: 'QuanLy' },
  { id: 3, taiKhoan: 'nhanvien01', matKhau: '123456', hoTen: 'NhanVien1', ngaySinh: '1995-07-10', SDT: '0923456789', email: 'hoa.lt@cinemax.vn', vaiTro: 'NhanVien' },
  { id: 4, taiKhoan: 'khachhang01', matKhau: '123456', hoTen: 'Client1', ngaySinh: '2000-11-25', SDT: '0934567890', email: 'anh.pd@gmail.com', vaiTro: 'KhachHang' },
  { id: 5, taiKhoan: 'khachhang02', matKhau: '123456', hoTen: 'Client2', ngaySinh: '1998-02-14', SDT: '0945678901', email: 'lan.nt@gmail.com', vaiTro: 'KhachHang' },
];

// Vé đã bán (mock) - một số ghế đã được đặt
export const veXemPhim = [
  { id: 1, trangThai: 'Đã sử dụng', id_SuatChieu: 1, id_HoaDon: 1, id_Ghe: 35 },
  { id: 2, trangThai: 'Đã sử dụng', id_SuatChieu: 1, id_HoaDon: 1, id_Ghe: 36 },
  { id: 3, trangThai: 'Đã thanh toán', id_SuatChieu: 2, id_HoaDon: 2, id_Ghe: 115 },
  { id: 4, trangThai: 'Đã thanh toán', id_SuatChieu: 3, id_HoaDon: 3, id_Ghe: 165 },
  { id: 5, trangThai: 'Đã hủy', id_SuatChieu: 1, id_HoaDon: 4, id_Ghe: 40 },
];

export const hoaDon = [
  { id: 1, ngayThanhToan: '2025-04-25T08:30', trangThai: 'Đã thanh toán', id_PhuongThucThanhToan: 2, id_NguoiDung: 4 },
  { id: 2, ngayThanhToan: '2025-04-25T13:15', trangThai: 'Đã thanh toán', id_PhuongThucThanhToan: 3, id_NguoiDung: 5 },
  { id: 3, ngayThanhToan: '2025-04-25T18:45', trangThai: 'Đã thanh toán', id_PhuongThucThanhToan: 1, id_NguoiDung: 4 },
  { id: 4, ngayThanhToan: '2025-04-25T07:00', trangThai: 'Đã hủy', id_PhuongThucThanhToan: 4, id_NguoiDung: 5 },
];

// Helper functions
export const getPhimTheLoai = (phimId) => {
  const p = phim.find(x => x.id === phimId);
  if (!p) return [];
  return p.theLoai.map(tid => theLoai.find(t => t.id === tid)).filter(Boolean);
};

export const getPhongChieuByRap = (rapId) => phongChieu.filter(pc => pc.id_Rap === rapId);

export const getSuatChieuByPhimAndRap = (phimId, rapId) => {
  const rooms = phongChieu.filter(pc => pc.id_Rap === rapId);
  const roomIds = rooms.map(r => r.id);
  return suatChieu.filter(sc => sc.id_Phim === phimId && roomIds.includes(sc.id_PhongChieu));
};

export const getBookedSeatIds = (suatChieuId) => {
  return veXemPhim.filter(v => v.id_SuatChieu === suatChieuId && v.trangThai !== 'Đã hủy').map(v => v.id_Ghe);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDateTime = (dt) => {
  return new Date(dt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const formatTime = (dt) => {
  return new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dt) => {
  return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
