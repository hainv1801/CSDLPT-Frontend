import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import ClientMovieDetails from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import MovieManagement from './pages/admin/AdminMovies';
import RoomManagement from './pages/admin/RoomManagement';
import ShowtimeManagement from './pages/admin/ShowtimeManagement';
import TicketBooking from './pages/admin/TicketBooking';
import ClientTicketBooking from './pages/ClientTicketBooking';
import ClientBookingHistory from './pages/ClientBookingHistory';
import ClientMovies from './pages/ClientMovies';
import AdminUsers from './pages/admin/AdminUsers';
import InvoiceManagement from './pages/admin/InvoiceManagement';
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <LoginModal />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<ClientMovies />} />
            <Route path="/movie/:id" element={<ClientMovieDetails />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dat-ve/:id" element={<ClientTicketBooking />} />
            <Route path="/lich-su-mua-ve" element={<ClientBookingHistory />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<h2>Thống kê tổng quan (Sắp ra mắt)</h2>} />
              {/* Các trang quản lý con sẽ được nhét vào thẻ <Outlet /> của AdminLayout */}
              <Route path="phim" element={<MovieManagement />} />
              <Route path="phong-chieu" element={<RoomManagement />} />
              <Route path="suat-chieu" element={<ShowtimeManagement />} />
              <Route path="nguoi-dung" element={<AdminUsers />} />
              <Route path="hoa-don" element={<InvoiceManagement />} />
              <Route path="dat-ve/:id" element={<TicketBooking />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
