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
      <header className="p-4 lg:p-8 relative" style={{ zIndex: 50 }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            <nav>
              <Link to="/" className="QurovaDEMO text-[#ff7f11ff] text-3xl">
                Tixwav
              </Link>
            </nav>
            <nav className="lg:flex items-center space-x-8 hidden text-gray-800">
              <Link to="/">Home</Link>
              <Link>About</Link>
              <Link>Discover</Link>
              <Link>Pricing</Link>
              <Link>
                <Search />
              </Link>
            </nav>
            <nav className="block lg:hidden relative" style={{ zIndex: 51 }}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50"
              >
                {isOpen ? <X size={25} /> : <Menu size={25} />}
              </button>
            </nav>
          </div>
        </div>
      </header>

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
              <button
                onClick={() => handleNavigation(item.path)}
                className="text-gray-800 text-lg mt-4 block hover:text-[#ff7f11ff] transition-colors w-full text-left"
              >
                {item.label}
              </button>
            </motion.div>
          ))}
        </motion.nav>
      </motion.div>

      {/* Overlay */}
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

// Menu items
const menuItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Discover", path: "/discover" },
  { label: "Pricing", path: "/pricing" },
];

// Animation variants
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

// Hook for dimensions
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
