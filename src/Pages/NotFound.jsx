import { Link, useNavigate } from "react-router-dom";
import * as motion from "motion/react-client";
import { Home, ArrowLeft, Search, Ticket } from "lucide-react";

const quickLinks = [
  { label: "Browse Events", to: "/discover", icon: Search },
  { label: "My Tickets", to: "/profile", icon: Ticket },
  { label: "Go Home", to: "/", icon: Home },
];

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffffcff] px-4 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ff7f11]/5"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#ff3f00]/5"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Logo */}
      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link to="/" className="QurovaDEMO text-[#ff7f11] text-2xl font-light">
          Tixwav
        </Link>
      </motion.div>

      <motion.div
        className="text-center max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div variants={itemVariants} className="mb-2 relative">
          <p className="text-[120px] md:text-[160px] font-semibold leading-none text-neutral-100 select-none">
            404
          </p>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="px-4 py-2 bg-[#ff7f11] rounded-xl shadow-lg shadow-[#ff7f11]/30">
              <p className="text-white text-sm font-semibold whitespace-nowrap">Page not found</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-xl font-semibold text-neutral-800 mb-2"
        >
          This ticket doesn't exist
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-sm text-neutral-400 mb-8 leading-relaxed"
        >
          The page you're looking for has been moved, deleted, or never existed. Let's get you back on track.
        </motion.p>

        {/* Quick Links */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-8"
        >
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={i} to={link.to}>
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${i === 0 ? "bg-[#ff7f11] text-white hover:bg-[#e66f00] shadow-sm shadow-[#ff7f11]/20" : "border border-neutral-200 text-neutral-600 hover:border-[#ff7f11] hover:text-[#ff7f11] bg-white"}`}
                >
                  <Icon size={14} /> {link.label}
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Back button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#ff7f11] transition-colors mx-auto"
          >
            <ArrowLeft size={12} /> Go back to previous page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;