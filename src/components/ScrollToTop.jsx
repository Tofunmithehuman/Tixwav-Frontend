import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import * as motion from "motion/react-client";

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 hover:bg-[#ff7f11ff] text-white cursor-pointer p-3 rounded-full shadow-lg bg-gray-900 transition-colors duration-300 z-50"
      aria-label="Scroll to top"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              scale: 1,
              y: [0, -5, 0],
            }
          : {
              opacity: 0,
              scale: 0,
              y: 20,
            }
      }
      transition={{
        opacity: { duration: 0.3 },
        scale: { type: "spring", stiffness: 260, damping: 20 },
        y: isVisible
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.3 },
      }}
      whileHover={{
        scale: 1.1,
        rotate: -5,
      }}
      whileTap={{ scale: 0.9 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}

export default ScrollToTop;