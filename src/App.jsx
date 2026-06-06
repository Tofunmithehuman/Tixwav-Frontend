import "./App.css";
import { useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getMe, selectSessionChecked } from "./store/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Code-split every route so the initial bundle stays small and heavy deps
// (e.g. the QR scanner on /organizer/scan) only load when needed.
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./Pages/VerifyEmail"));
const Admin = lazy(() => import("./Pages/Admin"));
const Profile = lazy(() => import("./Pages/Profile"));
const About = lazy(() => import("./Pages/About"));
const Discover = lazy(() => import("./Pages/Discover"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const AuthCallback = lazy(() => import("./Pages/AuthCallback"));
const EventDetail = lazy(() => import("./Pages/EventDetail"));
const PaymentVerify = lazy(() => import("./Pages/PaymentVerify"));
const OrderConfirmation = lazy(() => import("./Pages/OrderConfirmation"));
const Search = lazy(() => import("./Pages/Search"));
const BecomeOrganizer = lazy(() => import("./Pages/BecomeOrganizer"));
const OrganizerDashboard = lazy(() => import("./Pages/OrganizerDashboard"));
const PayoutSetup = lazy(() => import("./Pages/PayoutSetup"));
const EventForm = lazy(() => import("./Pages/EventForm"));
const EventTickets = lazy(() => import("./Pages/EventTickets"));
const ScanTicket = lazy(() => import("./Pages/ScanTicket"));

const Fallback = () => (
  <div className="h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <span className="QurovaDEMO text-[#ff7f11] text-3xl">Tixwav</span>
      <div className="w-6 h-6 border-2 border-[#ff7f11] border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

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
  if (!sessionChecked) return <Fallback />;

  return (
    <div className="App">
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Public */}
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route element={<ResetPassword />} path="/reset-password" />
          <Route element={<VerifyEmail />} path="/verify-email" />
          <Route element={<About />} path="/about" />
          <Route element={<Discover />} path="/discover" />
          <Route element={<Search />} path="/search" />
          <Route element={<Pricing />} path="/pricing" />
          <Route element={<EventDetail />} path="/events/:id" />
          <Route element={<PaymentVerify />} path="/payment/verify" />
          <Route element={<OrderConfirmation />} path="/orders/:id" />

          {/* OAuth callback */}
          <Route element={<AuthCallback />} path="/auth/callback" />

          {/* Authenticated (any role) */}
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
                <BecomeOrganizer />
              </ProtectedRoute>
            }
            path="/become-organizer"
          />

          {/* Organizer / Admin */}
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <OrganizerDashboard />
              </RoleRoute>
            }
            path="/organizer"
          />
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <PayoutSetup />
              </RoleRoute>
            }
            path="/organizer/payout"
          />
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <ScanTicket />
              </RoleRoute>
            }
            path="/organizer/scan"
          />
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <EventForm mode="create" />
              </RoleRoute>
            }
            path="/organizer/events/new"
          />
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <EventForm mode="edit" />
              </RoleRoute>
            }
            path="/organizer/events/:id/edit"
          />
          <Route
            element={
              <RoleRoute roles={["organizer", "admin"]} redirectTo="/become-organizer">
                <EventTickets />
              </RoleRoute>
            }
            path="/organizer/events/:id/tickets"
          />

          {/* Admin only */}
          <Route
            element={
              <RoleRoute roles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
            path="/admin"
          />

          <Route element={<NotFound />} path="*" />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
