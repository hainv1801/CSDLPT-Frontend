// Tạo một component nhỏ ngay trong file App.jsx hoặc tách ra file riêng
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireCenterAdmin({ children }) {
    const { isCenterAdmin, isLoading } = useAuth();

    if (isLoading) return <div>Đang tải...</div>;

    // Nếu không phải quản lý trung tâm, đá văng về trang thống kê
    if (!isCenterAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};