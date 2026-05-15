
import { motion } from "framer-motion";
import { FiCalendar, FiUsers, FiBell, FiArrowRight, FiLogIn, FiUserPlus, FiUser, FiActivity } from "react-icons/fi";
import { FaBuilding, FaCalendarCheck, FaChartLine, FaChurch, FaMapMarkedAlt,  FaQuoteLeft, FaQuoteRight, FaSchool, FaStar, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgTwo from "../assets/bgTwo.jpg"
import {
  CalendarDays,
  Users,
  Ticket,
  BarChart3,
  ShieldCheck,
  LifeBuoy,
  BellRing,
  LayoutDashboard,
  Activity,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const floating = (delay = 0) => ({
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    },
  },
});



const testimonials =[
            {
              name: "Sarah M.",
              role: "Event Planner",
              text: "Planora competely changed how I manage events. Everything from registration and tracking is now smooth and stress-free.",
            },
            {
              name: "Manyika M.",
              role: "Chief Executive Officer",
              text: "We use to struggle with spreadsheets. Planora gave us a profesional system that saves time and improves cordination.",
            },
            {
              name: "Emily T.",
              role: "School Administrator",
              text: "Managing school events has never been easier. Planora keeps everything organized in one place.",
            },
          ]

/* ================= FOOTER LINKS ================= */

const LandingPage = () => {

  const navigate = useNavigate();

  return (
      <section className="relative overflow-hidden">

            {/* HERO BACKGROUND */}
            <div className="absolute inset-0 -z-10">
              {/* Gradient Mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#8B5CF6,transparent_20%),radial-gradient(circle_at_80%_30%,#6366F1,transparent_40%),radial-gradient(circle_at_50%_80%,#EDE9FE,transparent_50%)] opacity-20" />

              {/* Floating Shapes */}
              <motion.div
                variants={floating(0)}
                animate="animate"
                className="absolute top-20 left-10 w-20 h-20 bg-secondary rounded-2xl blur-sm opacity-90"
              />
              <motion.div
                variants={floating(0)}
                animate="animate"
                className="absolute top-20 left-10 w-20 h-20 bg-[#8B5CF6] rounded-2xl blur-sm opacity-90"
              />
              <motion.div
                variants={floating(0)}
                animate="animate"
                className="absolute top-110 left-120 w-20 h-20 bg-[#8B5CF6] rounded-2xl blur-sm opacity-90"
              />
              <motion.div
                variants={floating(0)}
                animate="animate"
                className="absolute top-80 left-200 w-20 h-20 bg-[#8B5CF6] rounded-2xl blur-sm opacity-90"
              />

              <motion.div
                variants={floating(1)}
                animate="animate"
                className="absolute top-60 right-20 w-16 h-16 bg-[#8B5CF6] rounded-2xl blur-sm opacity-90"
              />

              <motion.div
                variants={floating(2)}
                animate="animate"
                className="absolute bottom-40 left-1/3 w-24 h-24 bg-[#EDE9FE] rounded-full blur-md opacity-20"
              />

              <motion.div
                variants={floating(1.5)}
                animate="animate"
                className="absolute bottom-20 right-1/3 w-14 h-14 bg-[#8B5CF6] rotate-45 blur-sm opacity-30"
              />
            </div>

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full bg-dark font-mono backdrop-blur-md border-b border-[#1F2937] z-50">
              <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 text-secondary">
                  <Sparkles className="" size={30} />
                  <h1 className="text-2xl uppercase font-bold">Planora</h1>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => navigate("/login")} className="flex hover:bg-secondary cursor-pointer items-center gap-2 text-sm px-4 text-white py-2 rounded-xl border border-[#1F2937]">
                    <FiLogIn /> Login
                  </button>
                  <button onClick={() => navigate("/register")} className="flex hover:bg-purple-600 cursor-pointer items-center gap-2 text-sm px-4 text-white py-2 rounded-xl bg-secondary">
                    <FiUserPlus /> Register
                  </button>
                </div>
              </div>
            </nav>

            {/* HERO */}
            <section style={{
              backgroundImage: `url(${bgTwo})`, backgroundSize: "cover", backgroundPosition: "center"
            }} className="relative min-h-screen grid grid-cols-1">
            
                <div className="bg-gradient-to-r from-purple-900 text-white overflow-hidden max-w-8xl mx-auto px-8 py-20 grid md:grid-cols-2 items-center">
                  <div>
                    <p className="uppercase mb-3 font-mono opacity-60">Event Management System</p>
                     <motion.h1
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="text-4xl md:text-6xl font-mono  font-bold leading-tight"
                      >
                      PLAN YOUR EVENTS WITHOUT CHAOS
                    </motion.h1>

                    <motion.p
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className=" md:text-xl text-sm text-gray-200 mb-8"
                    >
                      Planora helps you organize, manage, and track events from one powerful system.
                    </motion.p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-[#8B5CF6] hover:bg-purple-600 px-6 py-3 rounded text-white font-mono flex items-center gap-2"
                    >
                      Get Started <FiArrowRight />
                    </motion.button>
                  </div>
                </div>

            </section>

            {/* FEATURES */}
            <section className="py-15 px-6 bg-[#111827]">

              <div className="flex mb-6 justify-center">
                  <h1 className="text-4xl font-bold font-mono  text-[#8B5CF6]">Key Feature</h1>
              </div>

              <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <FiCalendar size={35} />,
                    title: "Event Creation & Scheduling",
                    desc: "Create and schedule events effortlessly with an intuitve calende interface.",
                  },
                  {
                    icon: <FiUsers size={35} />,
                    title: "Attendee Register & Management",
                    desc: "Manage attendees, organizers, and roles efficiently.",
                  },
                  {
                    icon: <FaTicketAlt size={35} />,
                    title: "Ticket System (Free / Paid)",
                    desc: "Monitor sales, validate entries, and manage event access seamlessly.",
                  },
                  {
                    icon: <FaChartLine size={35} />,
                    title: "Analytics Dashboard",
                    desc: "Gain insights with real-time analytics on attendance, revenue and engagementsxxxx.",
                  },
                  {
                    icon: <FiBell size={30} />,
                    title: "Notifications",
                    desc: "Stay updated with real-time alerts and reminders.",
                  },
                  {
                    icon: <FaMapMarkedAlt size={30} />,
                    title: "Venue & Resouece Management",
                    desc: "Stay updated with real-time alerts and reminders.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ scale: 1.03 }}
                    viewport={{ once: true }}
                    className="bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-[#1F2937]"
                  >
                    <div className="text-[#8B5CF6] mb-4">{item.icon}</div>
                    <h3 className="text-xl text-white font-mono mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

      {/* TESTIMONIALS */}
        <section className="py-15 px-6" >
        
        <div className="max-w-6xl mx-auto px-4 text-cente">
              {/* HEADER */}

              <FaQuoteLeft color="#8B5CF6" size={40} />
              <div className="mb-9 text-center">
                {/* <FaQuoteLeft className="mx-auto text-3xl mb-3 " /> */}
                <h2 className="text-4xl font-bold font-mono text-secondary">What People Say.</h2>
                <p className="text-gray-600 mt-2">
                  Trusted by organizers and growing organisations.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((t, idx) => 
                  <motion.div 
                    key={idx} 
                    whileHover={{scale: 1.05}}
                    className="bg-white p-6 rounded-2xl shadow-md">

                      <div className="flex gap-3 items-center mb-2">
                         <FiUser className="text-4xl text-secondary mb-3" />
                          <div>
                             <h4 className="font-semibold text-secondary font-mono"> {t.name} </h4>
                               <p className="text-small text-gray-400 font-mono">{t.role}</p>
                          </div>
                      </div>
                      <p className="text-gray-600 mb-4 text-justify">{t.text}</p>

                      {/* STARS */}

                      <div className="flex gap-2 justify-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar />
                          ))}
                      </div>

                      {/* <h4 className="font-semibold text-secondary font-mono"> {t.name} </h4>
                      <p className="text-small text-gray-400 font-mono">{t.role}</p> */}
                  </ motion.div>
                )} 
              </div>

                    {/* TRUSTED BY */}
                <div className="mt-10">
                  {/* <p className="text-gray-500 mb-4">Trusted by growing teams</p> */}
                  <div className="flex justify-center gap-6 flex-wrap">
                    <span className="bg-white px-4 py-2 rounded-lg shadow text-sm flex gap-1 items-center font-mono"> <FaSchool color="#8B5CF6"  /> Schools</span>
                    <span className="bg-white px-4 py-2 rounded-lg shadow text-sm flex gap-1 items-center font-mono"> <FiActivity color="#8B5CF6"  /> Startups</span>
                    <span className="bg-white px-4 py-2 rounded-lg shadow text-sm flex gap-1 items-center font-mono"> <FaChurch color="#8B5CF6"  /> Churches</span>
                    <span className="bg-white px-4 py-2 rounded-lg shadow text-sm flex gap-1 items-center font-mono"> <FaBuilding color="#8B5CF6"  /> Corporate Teams</span>
                    <span className="bg-white px-4 py-2 rounded-lg shadow text-sm flex gap-1 items-center font-mono"> <FaCalendarCheck color="#8B5CF6" /> Event Planner</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <FaQuoteRight  color="#8B5CF6" size={40} />
                </div>

        </div>
         
       
        </section>

      <footer className="border-t border-white/10 bg-dark py-12 font-mono">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-gray-400">

          {/* BRAND INFO */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-secondary" size={30} />
              <h3 className="font-orbitron text-white text-4xl">
                Planora
              </h3>
            </div>

            <p className="leading-7 text-gray-400">
             Easily organize events, manage attendees, track registrations,
            coordinate schedules, and stay updated in real time all from one
            powerful dashboard built to save you time and simplify event planning.
            </p>
          </div>

          {/* EVENT MANAGEMENT */}
          <div>
            <h3 className="text-secondary font-bold mb-4 uppercase tracking-wider">
              Event Management
            </h3>

            <div className="space-y-3">
              {[
                {
                  icon: <CalendarDays size={18} />,
                  label: "Create Events",
                },
                {
                  icon: <Users size={18} />,
                  label: "Manage Attendees",
                },
                {
                  icon: <Ticket size={18} />,
                  label: "Ticket Registrations",
                },
                {
                  icon: <LayoutDashboard size={18} />,
                  label: "Schedules & Timelines",
                },
                {
                  icon: <BarChart3 size={18} />,
                  label: "Event Analytics",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 hover:text-secondary cursor-pointer transition"
                >
                  <span className="text-secondary">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ORGANIZER SUPPORT */}
          <div>
            <h3 className="text-secondary font-bold mb-4 uppercase tracking-wider">
              Organizer Support
            </h3>

            <div className="space-y-3">
              {[
                {
                  icon: <LifeBuoy size={18} />,
                  label: "Help Center",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  label: "Security & Privacy",
                },
                {
                  icon: <BellRing size={18} />,
                  label: "System Updates",
                },
                {
                  icon: <Users size={18} />,
                  label: "Community Support",
                },
                {
                  icon: <Mail size={18} />,
                  label: "Contact Support",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 hover:text-secondary cursor-pointer transition"
                >
                  <span className="text-secondary">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM FEATURES */}
          <div>
            <h3 className="text-secondary font-bold mb-4 uppercase tracking-wider">
              Platform Features
            </h3>

            <div className="space-y-3">
              {[
                {
                  icon: <LayoutDashboard size={18} />,
                  label: "Organizer Dashboard",
                },
                {
                  icon: <Activity size={18} />,
                  label: "Live Event Tracking",
                },
                {
                  icon: <Users size={18} />,
                  label: "Team Collaboration",
                },
                {
                  icon: <Mail size={18} />,
                  label: "Email Notifications",
                },
                {
                  icon: <BarChart3 size={18} />,
                  label: "Smart Reports",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 hover:text-secondary cursor-pointer transition"
                >
                  <span className="text-secondary">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-10 pt-5 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Planora Event Management System.
          Built for seamless planning, registrations, and successful events.
        </div>
      </footer>
      </section>

  );
};

export default LandingPage;
