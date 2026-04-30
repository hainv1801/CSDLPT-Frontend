import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; // Đảm bảo bạn đã có file này như hướng dẫn trước

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Trạng thái user và các modal
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Kiểm tra trạng thái đăng nhập khi vừa vào web (F5)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Gọi API lấy thông tin user từ token (bạn cần thay endpoint này cho khớp backend)
          const res = await axiosClient.get('/api/v1/users/me');
          setUser(res.data.data);
          console.log("User", res.data.data);
        } catch (error) {
          console.error("Token hết hạn hoặc không hợp lệ");
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);

  // 2. Hàm Đăng nhập
  const login = async (taiKhoan, matKhau) => {
    try {
      const res = await axiosClient.post('/api/v1/auth/login', { taiKhoan, matKhau });
      console.log("Login", res.data.data.user)
      // Giả sử backend trả về: { access_token: "...", user: {...} }
      localStorage.setItem('access_token', res.data.data.access_token);
      setUser(res.data.data.user); // Lưu thông tin user vào state
      setShowLogin(false);
      return { success: true };
    } catch (error) {
      // Bắt lỗi từ backend (vd: sai mật khẩu, tài khoản không tồn tại)
      const errorMsg = error.response?.data?.data?.message || 'Đăng nhập thất bại!';
      return { success: false, message: errorMsg };
    }
  };

  // 3. Hàm Đăng ký
  const register = async (userData) => {
    try {
      // userData gồm: taiKhoan, matKhau, hoTen, email, SDT...
      await axiosClient.post('/api/v1/auth/register', userData);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.data?.message || 'Đăng ký thất bại!';
      return { success: false, message: errorMsg };
    }
  };

  // 4. Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const isAdmin = user?.vaiTro === 'ROLE_QUANLY' || user?.vaiTro === 'QUANLY';
  const isCenterAdmin = isAdmin && user?.maCoSo === 'KV_00';
  return (
    <AuthContext.Provider value={{
      user, setUser, login, register, logout, isAdmin, isCenterAdmin,
      showLogin, setShowLogin, isLoading
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);