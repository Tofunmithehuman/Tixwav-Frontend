import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Ticket, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as motion from "motion/react-client";
import {
  selectIsAuthenticated,
  selectUser,
  logoutUser,
} from "../store/slices/authSlice";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => navigate(path), 1000);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logoutUser()).then(() => navigate("/login", { replace: true }));
  };

  return (
    <div className="Navigation">
      <motion.header
        className="p-4 lg:p-8 relative"
        style={{ zIndex: 50 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <nav>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/" className="QurovaDEMO text-[#ff7f11ff] text-3xl">
                  Tixwav
                </Link>
              </motion.div>
            </nav>

            {/* Desktop Nav Links */}
            <nav className="lg:flex items-center space-x-8 hidden text-gray-800">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/about"
                  className="hover:text-[#ff7f11ff] duration-200"
                >
                  About
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/discover"
                  className="hover:text-[#ff7f11ff] duration-200"
                >
                  Discover
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/pricing"
                  className="hover:text-[#ff7f11ff] duration-200"
                >
                  Pricing
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <button className="hover:text-[#ff7f11ff] duration-200">
                  <Search size={18} />
                </button>
              </motion.div>
            </nav>

            {/* Desktop Auth / User */}
            <nav className="md:flex items-center space-x-4 hidden">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                    whileTap={{ scale: 0.93 }}
                  >
                    {user.avatar && user.avatar.trim() !== "" ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#ff7f11]"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display:
                          user.avatar && user.avatar.trim() !== ""
                            ? "none"
                            : "flex",
                      }}
                      className="w-9 h-9 rounded-full bg-[#ff7f11] flex items-center justify-center text-white font-semibold text-lg select-none"
                    >
                      {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                  </motion.button>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50"
                    >
                      {/* User name */}
                      <div className="px-4 py-2.5 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-800 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* View Tickets */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-[#ff7f11] transition-colors"
                      >
                        <Ticket size={14} />
                        View Tickets
                      </Link>

                      {/* Sign Out */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className="text-gray-800 hover:text-[#ff7f11ff] duration-200"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="bg-[#ff7f11ff] hover:bg-[#e66f00] rounded-xs text-white py-2 px-4 inline-block transition-colors duration-200"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <nav className="block md:hidden relative" style={{ zIndex: 51 }}>
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50"
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={25} /> : <Menu size={25} />}
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        className="fixed top-0 right-0 bottom-0 w-full md:hidden"
        style={{ zIndex: 40, pointerEvents: isOpen ? "auto" : "none" }}
      >
        <motion.div
          variants={sidebarVariants}
          className="absolute top-0 right-0 bottom-0 w-full bg-white shadow-2xl"
        />

        <motion.nav
          variants={navVariants}
          className="relative flex flex-col p-8 pt-24"
        >
          {isAuthenticated && user ? (
            <>
              {/* 1. User info — top */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-3 pb-5 border-b border-neutral-100">
                  {user.avatar && user.avatar.trim() !== "" ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#ff7f11]"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display:
                        user.avatar && user.avatar.trim() !== ""
                          ? "none"
                          : "flex",
                    }}
                    className="w-11 h-11 rounded-full bg-[#ff7f11] items-center justify-center text-white font-semibold text-base select-none shrink-0"
                  >
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2. View Tickets */}
              <motion.div variants={itemVariants} className="mb-2">
                <motion.button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center gap-2.5 text-neutral-700 text-lg hover:text-[#ff7f11ff] transition-colors w-full py-2"
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Ticket size={16} /> View Tickets
                </motion.button>
              </motion.div>

              {/* 3. Nav links */}
              <div className=" pt-4 mt-2 flex flex-col gap-1">
                {menuItems.map((item, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <motion.button
                      onClick={() => handleNavigation(item.path)}
                      className="text-gray-800 text-lg py-3 block hover:text-[#ff7f11ff] transition-colors w-full text-left"
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* 4. Sign Out — bottom, red */}
              <motion.div
                variants={itemVariants}
                className="border-t border-neutral-100 mt-4 pt-4"
              >
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 text-red-500 text-base hover:text-red-600 transition-colors w-full py-2 font-medium"
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={16} /> Sign Out
                </motion.button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Nav links for unauthenticated */}
              <div className="flex flex-col gap-1">
                {menuItems.map((item, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <motion.button
                      onClick={() => handleNavigation(item.path)}
                      className="text-gray-800 text-lg py-3 block hover:text-[#ff7f11ff] transition-colors w-full text-left"
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={itemVariants}
                className="pt-6 space-y-4 border-t border-neutral-100 mt-4"
              >
                <motion.button
                  onClick={() => handleNavigation("/login")}
                  className="text-gray-800 text-lg text-center block hover:text-[#ff7f11ff] transition-colors w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/register")}
                  className="bg-[#ff7f11ff] hover:bg-[#e66f00] text-center rounded-sm w-full text-white py-2 px-6 inline-block transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                </motion.button>
              </motion.div>
            </>
          )}
        </motion.nav>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ zIndex: 39 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const menuItems = [
  { label: "About", path: "/about" },
  { label: "Discover", path: "/discover" },
  { label: "Pricing", path: "/pricing" },
  { label: "Search", path: "/search" },
];

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 25px) 25px)`,
    transition: { type: "spring", stiffness: 20, restDelta: 2 },
  }),
  closed: {
    clipPath: "circle(0px at calc(100% - 25px) 25px)",
    transition: { delay: 0.2, type: "spring", stiffness: 400, damping: 40 },
  },
};

const navVariants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: { y: { stiffness: 1000 } },
  },
};

const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });
  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);
  return dimensions.current;
};

export default Navigation;
