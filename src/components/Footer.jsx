export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>🎬 CineMax</h3>
          <p>Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam với 9 chi nhánh trải dài khắp cả nước.</p>
          <p style={{marginTop: '12px'}}>📧 contact@cinemax.vn</p>
          <p>📞 1900 6868</p>
        </div>
        <div>
          <h3>Dịch vụ</h3>
          <a href="#" style={{display:'block'}}>Đặt vé online</a>
          <a href="#" style={{display:'block'}}>Lịch chiếu</a>
          <a href="#" style={{display:'block'}}>Khuyến mãi</a>
          <a href="#" style={{display:'block'}}>Thẻ thành viên</a>
        </div>
        <div>
          <h3>Hỗ trợ</h3>
          <a href="#" style={{display:'block'}}>Hướng dẫn đặt vé</a>
          <a href="#" style={{display:'block'}}>Chính sách hoàn vé</a>
          <a href="#" style={{display:'block'}}>FAQ</a>
          <a href="#" style={{display:'block'}}>Liên hệ</a>
        </div>
        <div>
          <h3>Kết nối</h3>
          <a href="#" style={{display:'block'}}>Facebook</a>
          <a href="#" style={{display:'block'}}>Instagram</a>
          <a href="#" style={{display:'block'}}>YouTube</a>
          <a href="#" style={{display:'block'}}>TikTok</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CineMax </p>
      </div>
    </footer>
  );
}
