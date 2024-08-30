import { useLocation, Navigate, Outlet, useSearchParams } from 'react-router-dom';

const GuestRoute = () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const redirect = searchParams.get('redirect')
        ? searchParams.get('redirect')
        : '/auth/login';

    return !token ? (
        <Outlet />
    ) : (
        <Navigate to={redirect} state={{ from: location }} replace />
    );
};

export default GuestRoute;
