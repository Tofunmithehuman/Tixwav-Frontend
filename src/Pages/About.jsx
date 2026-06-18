import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import ScrollToTop from "@/components/ScrollToTop";
import * as motion from "motion/react-client";
import { Link } from "react-router-dom";
import { Heart, Zap, Shield, Users, MapPin, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We believe great events create lasting connections. Every feature we build starts with the question: does this bring people closer together?",
    color: "#ff7f11",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Ticket purchases happen in seconds. Our infrastructure is built for the moments that matter most — when your event goes viral overnight.",
    color: "#ff3f00",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Every transaction is encrypted. Every ticket is verified. We take the worry out of payments so you can focus on the experience.",
    color: "#beb7a4",
  },
  {
    icon: Users,
    title: "Built for Africa",
    description: "Designed in Lagos, built for every city across the continent. We support Naira payments, local banks, and the pace of Nigerian life.",
    color: "#ff7f11",
  },
];

const team = [
  { name: "Bolaji Oluwatofunmi", role: "CTO & Co-founder", avatar: "https://avatar.vercel.sh/ada1" },
  { name: "Adebayo Timileyin", role: "CEO & Co-founder", avatar: "https://avatar.vercel.sh/seun2" },
  { name: "Sophia Balogun", role: "Head of Design &  Co-founder", avatar: "https://avatar.vercel.sh/kemi3" },
];

const stats = [
  { value: "50k+", label: "Tickets sold" },
  { value: "1,200+", label: "Events hosted" },
  { value: "18", label: "Cities covered" },
  { value: "98%", label: "Customer satisfaction" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffffcff]">
      <Seo
        title="About"
        description="Tixwav is Nigeria's event ticketing platform — making it easy to discover, buy and sell tickets for the events you love."
        path="/about"
      />
      <Navigation />

      {/* Hero */}
      <motion.section
        className="px-4 md:px-8 pt-14 pb-14 border-b border-neutral-100"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Our Story
            </motion.p>
            <motion.h1
              className="text-3xl md:text-4xl font-semibold text-neutral-800 leading-tight mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Making events<br />
              <span className="text-[#ff7f11]">accessible</span> to everyone
            </motion.h1>
            <motion.p
              className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tixwav was born in Lagos in 2026 with a simple idea: event ticketing in Africa should be as smooth as the events themselves. No long queues, no fake tickets, no friction.
            </motion.p>
            <motion.div
              className="flex items-center gap-1.5 text-xs text-neutral-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <MapPin size={12} className="text-[#ff7f11]" />
              <span>Founded in Lagos, Nigeria · 2026</span>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm text-center"
              >
                <p className="text-3xl font-semibold text-[#ff7f11] mb-1">{stat.value}</p>
                <p className="text-xs text-neutral-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section
        className="px-4 md:px-8 py-14 bg-white border-b border-neutral-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-xl mx-auto text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-3">Our Mission</p>
          <blockquote className="text-xl md:text-2xl font-light text-neutral-700 leading-relaxed">
            "To remove every barrier between a great event and the people who deserve to experience it."
          </blockquote>
        </div>
      </motion.section>

      {/* Values */}
      <section className="px-4 md:px-8 py-14 border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-2">What drives us</p>
            <h2 className="text-xl font-semibold text-neutral-800">Our core values</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${v.color}18` }}>
                    <Icon size={18} style={{ color: v.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-800 mb-2">{v.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 md:px-8 py-14 border-b border-neutral-100 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[11px] font-semibold text-[#ff7f11] uppercase tracking-widest mb-2">The people</p>
            <h2 className="text-xl font-semibold text-neutral-800">Meet the team</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="text-center cursor-default"
              >
                <div className="relative mx-auto w-16 h-16 mb-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <p className="text-xs font-semibold text-neutral-700 leading-snug">{member.name}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="px-4 md:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-lg mx-auto bg-[#ff7f11] rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Join the Tixwav community</h3>
            <p className="text-sm text-white/70">Discover events, connect with people, and create memories.</p>
          </div>
          <Link to="/register">
            <motion.div
              whileTap={{ scale: 0.96 }}
              className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-[#ff7f11] rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Get started <ArrowRight size={14} />
            </motion.div>
          </Link>
        </div>
      </motion.section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default About;