import "./App.css";
import { Route, Routes } from "react-router";
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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<ForgotPassword />} path="/forgot-password" />
        <Route element={<Admin />} path="/admin" />
        <Route element={<Profile />} path="/profile" />
        <Route element={<About />} path="/about" />
        <Route element={<Discover />} path="/discover" />
        <Route element={<Pricing />} path="/pricing" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </div>
  );
}

export default App;
