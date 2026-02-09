import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Company: [
      { name: "About", path: "/about" },
      { name: "Discover", path: "/discover" },
      { name: "Pricing", path: "/pricing" },
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "Contact Us", path: "/contact" },
      { name: "Privacy Policy", path: "/privacy" },
    ],
    Social: [
      { name: "Instagram", path: "#" },
      { name: "Twitter", path: "#" },
      { name: "LinkedIn", path: "#" },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="Footer">
      <footer>
        <div className="bg-[#fe902f1d] mt-6">
          <motion.div
            className="max-w-screen-2xl mx-auto pt-16 pb-4 px-4 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Link
                  to="/"
                  className="QurovaDEMO text-[#ff7f11ff] text-3xl inline-block mb-4"
                >
                  Tixwav
                </Link>
                <p className="text-gray-600 text-sm mb-6 max-w-sm">
                  Discover and book tickets for the most exciting events in your
                  area. From concerts to conferences, we've got you covered.
                </p>

                <div className="space-y-3">
                  <motion.div
                    className="flex items-center gap-2 text-gray-600 text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <MapPin size={16} className="text-[#ff7f11ff]" />
                    <span>123 Event Street, City, State 12345</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 text-gray-600 text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail size={16} className="text-[#ff7f11ff]" />
                    <a
                      href="mailto:hello@tixwav.com"
                      className="hover:text-[#ff7f11ff] transition-colors"
                    >
                      hello@tixwav.com
                    </a>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 text-gray-600 text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone size={16} className="text-[#ff7f11ff]" />
                    <a
                      href="tel:+1234567890"
                      className="hover:text-[#ff7f11ff] transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {Object.entries(footerLinks).map(([category, links]) => (
                <motion.div key={category} variants={itemVariants}>
                  <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wide">
                    {category}
                  </h3>
                  <ul className="space-y-2.5">
                    {links.map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          to={link.path}
                          className="text-gray-600 text-sm hover:text-[#ff7f11ff] transition-colors inline-block"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="border-t border-gray-300/50"
              variants={itemVariants}
            />

            <motion.div
              className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
              variants={itemVariants}
            >
              <p className="text-gray-600 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Tixwav. All rights reserved.
              </p>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="px-4 py-2 text-sm border border-gray-300 rounded-xs focus:outline-none focus:border-[#ff7f11ff] transition-colors w-48 hidden lg:block"
                />
                <motion.button
                  className="bg-[#ff7f11ff] text-white px-4 py-2 rounded-xs text-sm hover:bg-[#e66f00] transition-colors hidden lg:block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
