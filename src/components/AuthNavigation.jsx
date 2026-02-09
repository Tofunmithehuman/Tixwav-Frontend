import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as motion from "motion/react-client";

const AuthNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  return (
    <div className="AuthNavigation">
      <motion.header
        className="p-4 lg:p-8 relative"
        style={{ zIndex: 50 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
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

            {/* Desktop Navigation Links */}
            <nav className="lg:flex items-center space-x-8 hidden text-gray-800">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link to="/" className="hover:text-[#ff7f11ff] duration-200">
                  Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link className="hover:text-[#ff7f11ff] duration-200">About</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link className="hover:text-[#ff7f11ff] duration-200">
                  Discover
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link className="hover:text-[#ff7f11ff] duration-200">Pricing</Link>
              </motion.div>
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Link className="hover:text-[#ff7f11ff] duration-200">
                  <Search />
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <nav className="block lg:hidden relative" style={{ zIndex: 51 }}>
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
        className="fixed top-0 right-0 bottom-0 w-full lg:hidden"
        style={{
          zIndex: 40,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <motion.div
          variants={sidebarVariants}
          className="absolute top-0 right-0 bottom-0 w-full bg-white shadow-2xl"
        />

        <motion.nav
          variants={navVariants}
          className="relative flex flex-col space-y-6 p-8 pt-24"
        >
          {menuItems.map((item, i) => (
            <motion.div key={i} variants={itemVariants}>
              <motion.button
                onClick={() => handleNavigation(item.path)}
                className="text-gray-800 text-lg mt-4 block hover:text-[#ff7f11ff] transition-colors w-full text-left"
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            </motion.div>
          ))}
        </motion.nav>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 lg:hidden"
          style={{ zIndex: 39 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const menuItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Discover", path: "/discover" },
  { label: "Pricing", path: "/pricing" },
];

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 25px) 25px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at calc(100% - 25px) 25px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const navVariants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
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

export default AuthNavigation;