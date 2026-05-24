import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated, selectSessionChecked } from "../store/slices/authSlice";

/**
 * Wraps routes that require authentication.
 * Shows nothing while the session is being verified on first load,
 * then either renders children or redirects to /login.
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionChecked = useSelector(selectSessionChecked);
  const location = useLocation();

  // Still verifying — render nothing (App-level loader handles the UX)
  if (!sessionChecked) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;