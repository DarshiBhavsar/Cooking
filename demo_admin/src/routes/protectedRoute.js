import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Retrieve token from local storage (or another method of tracking authentication)
    const token = localStorage.getItem('token');
    const location = useLocation();

    return token ? (
        <Outlet />
    ) : (
        <Navigate to={"/auth/login"} state={{ from: location }} replace />
    );
};

export default ProtectedRoute;
