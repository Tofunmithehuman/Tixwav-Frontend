import "./App.css";
import { useEffect } from "react";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getMe,
  exchangeOAuthCode,
  selectSessionChecked,
} from "./store/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Admin from "./Pages/Admin";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Discover from "./Pages/Discover";
import Pricing from "./Pages/Pricing";
import NotFound from "./Pages/NotFound";
import AuthCallback from "./Pages/AuthCallback";

function App() {
  const dispatch = useDispatch();
  const sessionChecked = useSelector(selectSessionChecked);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!sessionChecked) {
      dispatch(getMe());
    }
  }, [dispatch, sessionChecked]);

  // ── Minimal full-screen loader while checking session ────────────────────
  // Prevents a flash of the login page for already-authenticated users.
  if (!sessionChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <span className="QurovaDEMO text-[#ff7f11] text-3xl">Tixwav</span>
          <div className="w-6 h-6 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<ForgotPassword />} path="/forgot-password" />
        <Route element={<About />} path="/about" />
        <Route element={<Discover />} path="/discover" />
        <Route element={<Pricing />} path="/pricing" />

        {/* OAuth callback — exchanges one-time code from Google redirect */}
        <Route element={<AuthCallback />} path="/auth/callback" />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
          path="/admin"
        />

        <Route element={<NotFound />} path="*" />
      </Routes>
    </div>
  );
}

export default App;
