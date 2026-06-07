import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectSessionChecked,
  selectUser,
} from "../store/slices/authSlice";

/**
 * Guards routes by role. Unauthenticated users go to /login (preserving intent);
 * authenticated users without an allowed role are redirected (default: home).
 */
const RoleRoute = ({ children, roles, redirectTo = "/" }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionChecked = useSelector(selectSessionChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!sessionChecked) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default RoleRoute;
