// Xóa import mockData đi
const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Nhận thêm props 'seats' (danh sách ghế) và 'bookedSeatIds' (ghế đã có người đặt)
export default function SeatMap({ seats = [], bookedSeatIds = [], selectedSeats, onSeatClick }) {

  // Nhóm ghế theo hàng
  const rows = {};
  seats.forEach(s => {
    if (!rows[s.hang]) rows[s.hang] = [];
    rows[s.hang].push(s);
  });

  return (
    <div className="seat-map-container">
      <div className="screen">
        <div className="screen-bar"></div>
        <div className="screen-label">MÀN HÌNH</div>
      </div>
      <div className="seat-grid">
        {Object.keys(rows).sort((a, b) => a - b).map(rowNum => (
          <div className="seat-row" key={rowNum}>
            <span className="seat-row-label">{ROW_LABELS[rowNum - 1] || rowNum}</span>

            {rows[rowNum].sort((a, b) => a.cot - b.cot).map(seat => {
              // Kiểm tra xem ghế đã bị đặt chưa dựa vào mảng bookedSeatIds
              const isBooked = bookedSeatIds.includes(seat.id) || bookedSeatIds.includes(seat.idGhe);
              const isSelected = selectedSeats.includes(seat.id || seat.idGhe);
              const isUnavailable = seat.trangThai !== 'Hoạt động';

              const seatId = seat.id || seat.idGhe; // Đề phòng backend dùng idGhe

              return (
                <div
                  key={seatId}
                  className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''} ${isUnavailable ? 'unavailable' : ''}`}
                  onClick={() => !isBooked && !isUnavailable && onSeatClick(seatId)}
                  title={`${ROW_LABELS[seat.hang - 1]}${seat.cot}`}
                >
                  {seat.cot}
                </div>
              );
            })}
            <span className="seat-row-label">{ROW_LABELS[rowNum - 1] || rowNum}</span>
          </div>
        ))}
      </div>
      <div className="seat-legend">
        <div className="legend-item"><div className="legend-box available"></div> Trống</div>
        <div className="legend-item"><div className="legend-box selected-l"></div> Đang chọn</div>
        <div className="legend-item"><div className="legend-box booked-l"></div> Đã đặt</div>
      </div>
    </div>
  );
}