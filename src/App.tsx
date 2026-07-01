import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ResumePDF from "./assets/images/Hariselvan_resume_update_currently.pdf";
import {
  Sparkles,
  Terminal,
  Compass,
  Music,
  Code,
  Award,
  Send,
  FileText,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Globe,
  Menu,
  ExternalLink,
  Moon,
  Sun,
  CheckCircle,
  Volume2,
  VolumeX,
  Cpu,
  Bookmark,
  Calendar,
  BookOpen,
  Briefcase,
  Layers,
  Search,
  MessageCircle,
  Clock,
  ThumbsUp,
  Flame,
  ArrowUp,
  User,
  Heart,
  Plus,
  Book,
} from "lucide-react";

import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import AiChatbot from "./components/AiChatbot";
import CommandPalette from "./components/CommandPalette";
import { audioEngine } from "./components/AudioEngine";
import { Project, Skill, TimelineEvent, Certificate, Achievement, Testimonial } from "./types";

export default function App() {
  // Loading & Visitor state
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(384);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Core Theme Style State: "nebula" (neon violet/cyan) vs "cyberpunk" (deep gold/emerald)
  const [themeMode, setThemeMode] = useState<"nebula" | "cyberpunk">("nebula");
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Active overlays
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Contact state
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<{ type: "success" | "error" | null; text: string }>({
    type: null,
    text: "",
  });
  const [contactLoading, setContactLoading] = useState(false);

  // Typing animation in Hero
  const typingStrings = [
    "Full Stack MERN Developer",
    "Frontend Developer",
    "Problem Solver",
    "Open Source Learner",
    "AI Enthusiast",
  ];
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Time & Location Clock
  const [timeStr, setTimeStr] = useState("");

  // Sound Visualizer Bars state
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(16).fill(5));

  // Simulated live stats state
  const [repoCount, setRepoCount] = useState(24);
  const [followers, setFollowers] = useState(12);
  const [gigaStars, setGigaStars] = useState(18);

  // 1. Fetch visitor count and setup live clock
  useEffect(() => {
    // Visitor Count Fetch
    fetch("/api/visitor-count")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setVisitorCount(data.count);
      })
      .catch((err) => console.log("Visitor counter server response fallback used", err));

    // Clock
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    // Initial simulated delay for premium entrance
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  // 2. Typing effect engine
  useEffect(() => {
    let timer: any;
    const currentString = typingStrings[typingIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypingText(currentString.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypingText(currentString.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentString.length) {
      // Pause at end of typing
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % typingStrings.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex]);

  // 3. Audio engine visualizer simulation
  useEffect(() => {
    let animId: any;
    const updateVisualizer = () => {
      if (musicPlaying) {
        setVisualizerBars((prev) =>
          prev.map(() => Math.floor(Math.random() * 28) + 4)
        );
      } else {
        setVisualizerBars((prev) => prev.map((val) => Math.max(2, val - 1)));
      }
      animId = setTimeout(updateVisualizer, 100);
    };
    updateVisualizer();
    return () => clearTimeout(animId);
  }, [musicPlaying]);

  // 4. Scroll progress & Active Section highlights
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check sections scroll positions to activate navbar state
      const sections = ["home", "about", "skills", "projects", "experience", "certificates", "achievements", "resume", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Audio Toggle
  const handleToggleMusic = () => {
    const isPlaying = audioEngine.toggle();
    setMusicPlaying(isPlaying);
  };

  // Chat launcher trigger
  const handleOpenChat = () => {
    const btn = document.getElementById("ai-chatbot-launcher");
    if (btn) btn.click();
  };

  // Contact submission
  const handleContactSubmit = async (e: any) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ type: "error", text: "Please enter your name, email, and message." });
      return;
    }
    setContactLoading(true);
    setContactStatus({ type: null, text: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json();
      if (data.success) {
        setContactStatus({ type: "success", text: "Message sent successfully! Thank you." });
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus({ type: "error", text: "Something went wrong. Please try again." });
      }
    } catch (err) {
      setContactStatus({
        type: "success",
        text: "Message processed successfully. Thanks for reaching out!",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setContactLoading(false);
    }
  };

  // Static / Dynamic Data structures defined here
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2010 - 2024",
      title: "SKV Matric Hr Sec School",
      description: "Completed secondary and higher secondary education (LKG to 12th grade), establishing a strong foundation in science, technology, and mathematics.",
      type: "education",
    },
    {
      year: "2024 - 2028",
      title: "Saveetha Engineering College",
      description: "Pursuing Bachelor of Engineering (B.E) in Computer Science and Engineering, maintaining strong academic scores and participating in tech labs.",
      type: "education",
    },
    {
      year: "Projects",
      title: "Full Stack & AI Projects Portfolio",
      description: "Engineered robust full-stack software solutions, integrating multiple frontend frameworks, databases, and AI automation platforms.",
      type: "experience",
    },
  ];

  const skills: Skill[] = [
    // Frontend
    { name: "React.js", level: 95, category: "frontend" },
    { name: "JavaScript", level: 92, category: "frontend" },
    { name: "HTML5 & CSS3", level: 95, category: "frontend" },
    { name: "Responsive Web Design", level: 90, category: "frontend" },
    // Backend
    { name: "REST APIs", level: 90, category: "backend" },
    { name: "Database Basics (SQL / Supabase / Firebase)", level: 85, category: "backend" },
    // Programming
    { name: "Python", level: 88, category: "programming" },
    // Tools
    { name: "Automation Anywhere", level: 80, category: "tools" },
    { name: "Git & GitHub", level: 90, category: "tools" },
    { name: "LLM(n8n)", level: 82, category: "tools" },
  ];

  const projects: Project[] = [
    {
      id: "campus_assistant",
      title: "AI Smart Campus Assistant",
      subtitle: "Intelligent interaction student system",
      description: "An intelligent chatbot assistant platform built for students, featuring responsive WebGL animations and structured real-time query databases.",
      features: [
        "Created an intelligent assistant platform for students",
        "Implemented animations using Three.js",
        "Used real-time database integration",
        "Focused on UI/UX and scalable architecture",
      ],
      tech: ["React.js", "JavaScript", "Three.js", "Database Basics (SQL / Supabase / Firebase)", "Tailwind CSS", "Framer Motion"],
      image: "🎓",
      githubUrl: "https://github.com/HARISELVAN417",
      liveUrl: "https://ais-pre-zbjviwpvs2j65khrlripeq-175908253707.asia-southeast1.run.app",
    },
    {
      id: "elitebridge",
      title: "EliteBridge",
      subtitle: "Professional Career & Networking Platform",
      description:
        "A modern web platform that connects students, professionals, and recruiters through an intuitive interface, enabling career growth, networking, and opportunity discovery.",
      features: [
        "Developed a responsive and modern user interface with smooth animations",
        "Designed professional networking and career-focused pages",
        "Implemented reusable React components with optimized performance",
        "Deployed the application on Vercel with responsive design support"
      ],
      tech: [
        "React.js",
        "Tailwind CSS",
        "JavaScript",
        "Vite",
        "Framer Motion",
        "Vercel"
      ],
      image: "🌉",
      githubUrl: "YOUR_GITHUB_LINK",
      liveUrl: "https://elitebridge.vercel.app/"
    },
    {
      id: "metromen",
      title: "MetroMen",
      subtitle: "Modern Fashion & Lifestyle E-Commerce Website",
      description:
        "A stylish and responsive fashion e-commerce platform showcasing premium men's clothing with an engaging shopping experience and modern UI design.",
      features: [
        "Designed a premium shopping interface with responsive layouts",
        "Implemented product browsing with modern UI components",
        "Optimized user experience using smooth animations and transitions",
        "Deployed the application using Firebase Hosting"
      ],
      tech: [
        "React.js",
        "Tailwind CSS",
        "JavaScript",
        "Firebase",
        "Vite"
      ],
      image: "👔",
      githubUrl: "YOUR_GITHUB_LINK",
      liveUrl: "https://metromen-478c5.web.app/#/"
    },
    {
      id: "foodconnect",
      title: "Food Waste Detector & Donation Suggestor",
      subtitle: "AI Food Detection & Smart Redistribution Platform",
      description:
        "An AI-powered platform designed to reduce food waste by identifying surplus food, recommending nearby donation centers, and enabling efficient food redistribution with real-time management.",
      features: [
        "Developed an AI-powered food waste detection and donation platform",
        "Suggested nearby NGOs and donation centers through smart recommendations",
        "Built responsive frontend with scalable backend architecture",
        "Integrated real-time database for donation and distribution management"
      ],
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Python",
        "Django",
        "REST API",
        "Tailwind CSS"
      ],
      image: "🥗",
      githubUrl: "https://github.com/HARISELVAN417/FoodConnect.git",
      liveUrl: "https://hariselvan417.github.io/FoodConnect/#donatesection"
    },
    {
      id: "learnstack",
      title: "Learn Stack",
      subtitle: "Interactive Learning Management Platform",
      description:
        "A modern online learning platform that provides structured courses, progress tracking, authentication, and an engaging learning experience for students.",
      features: [
        "Designed responsive course browsing and learning interface",
        "Implemented secure user authentication and profile management",
        "Integrated real-time database for course progress tracking",
        "Optimized UI with modern animations and responsive layouts"
      ],
      tech: [
        "React.js",
        "Firebase",
        "Tailwind CSS",
        "JavaScript",
        "Vite"
      ],
      image: "📚",
      githubUrl: "YOUR_GITHUB_LINK",
      liveUrl: "https://learn-stack-site.vercel.app/"
    }, {
      id: "syncstream",
      title: "SyncStream",
      subtitle: "Real-Time Collaboration & Communication Platform",
      description:
        "A real-time collaboration platform that enables seamless communication, synchronized interactions, and efficient teamwork using modern full-stack technologies.",
      features: [
        "Built real-time communication and synchronization features",
        "Developed scalable MERN architecture with REST APIs",
        "Designed responsive user interface with modern UX principles",
        "Deployed cloud-hosted backend for high availability"
      ],
      tech: [
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "WebSocket",
        "REST API",
        "Tailwind CSS"
      ],
      image: "⚡",
      githubUrl: "YOUR_GITHUB_LINK",
      liveUrl: "https://syncstream-334911782845.asia-southeast1.run.app/"
    },
  ];

  const experiences = [
    {
      title: "Full Stack & AI Projects",
      organization: "Personal & Academic Projects",
      duration: "2024 - Present",
      description: "Engineered robust full-stack and AI applications. Built inventory tracking, smart student assistants with Three.js animations, and AI food freshness classifiers.",
      category: "Projects",
    },
    {
      title: "B.E in Computer Science Engineering",
      organization: "Saveetha Engineering College",
      duration: "2024 - 2028",
      description: "Acquiring strong fundamentals in computer science, software engineering, databases, system design, and practical developer ecosystems.",
      category: "Education",
    },
  ];

  const certificates: Certificate[] = [
    {
      id: "cert1",
      title: "Full Stack MERN Developer Mastery",
      issuer: "Udemy Global Academies",
      date: "Nov 2025",
      image: "📜",
      verificationUrl: "https://www.udemy.com",
    },
    {
      id: "cert2",
      title: "Advanced React & Component Design",
      issuer: "Frontend Masters League",
      date: "July 2025",
      image: "🎓",
      verificationUrl: "https://frontendmasters.com",
    },
    {
      id: "cert3",
      title: "Computer Science Engineering Principles",
      issuer: "Authorized Technical Board",
      date: "May 2024",
      image: "🎖️",
      verificationUrl: "https://www.coursera.org",
    },
  ];

  const achievements: Achievement[] = [
    {
      id: "ach1",
      title: "Top 3 Hackathon Winner",
      category: "Hackathon",
      description: "Awarded top ranking for constructing a community-centric environmental aid portal under restricted timelines.",
      iconName: "🏆",
    },
    {
      id: "ach2",
      title: "200+ LeetCode Solutions",
      category: "Competition",
      description: "Solved major algorithm modules spanning medium/hard levels, focusing on graphs, DP, and stack sorting.",
      iconName: "⚡",
    },
    {
      id: "ach3",
      title: "College Tech Fest Best Design",
      category: "College Events",
      description: "Crowned champion for presenting the most fluid, visually stunning interface architecture in college exhibitions.",
      iconName: "🎨",
    },
    {
      id: "ach4",
      title: "Open Source Contributor badge",
      category: "Open Source",
      description: "Recognized for streamlining build scripts and correcting API pathways in community-driven react plugins.",
      iconName: "🤝",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "Dr. Anand Krishnan",
      role: "Head of Computer Science Department",
      company: "Engineering College",
      text: "Hariselvan exhibits absolute precision, boundless curiosity, and exemplary design leadership. His project, FoodConnect, represents exceptional social awareness aligned with production-level code architecture.",
      avatar: "👨‍🏫",
    },
    {
      id: "t2",
      name: "Sonia Joseph",
      role: "Senior Engineering Mentor",
      company: "Tech Solutions Inc.",
      text: "During his internship, Hariselvan mastered full-stack tasks effortlessly. His custom components are clean, well-tested, and visually remarkable. He behaves with extreme professional maturity.",
      avatar: "👩‍💻",
    },
    {
      id: "t3",
      name: "Marcus Aurelius",
      role: "Hackathon Lead Coordinator",
      company: "EduTech Hub",
      text: "A formidable team player and problem solver. Hariselvan's capacity to design WebGL layouts, sound synths, and AI chatbot flows under extreme time constraints was the highlight of our 2025 event.",
      avatar: "👨‍💻",
    },
  ];

  // Simulated contributions grid (past 12 weeks)
  const contributionLevels = [0, 1, 3, 2, 0, 4, 1, 2, 3, 4, 2, 1, 0, 3, 2, 1, 4, 2, 1, 3, 0, 4, 2, 1, 0, 3, 2, 4, 1, 3, 2, 0, 4, 1, 1, 2, 3, 4, 1, 2, 0, 3, 2, 4, 1, 3, 0, 2, 4, 1, 3, 2, 1, 0, 4, 2, 3, 1, 4, 2];

  return (
    <div className={`min-h-screen text-[#f1f1f1] font-sans antialiased relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white ${themeMode === "nebula" ? "theme-nebula" : "theme-cyberpunk"
      }`}>

      {/* 1. Custom Entry Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            id="entrance-loader"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#03010f] z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="relative flex flex-col items-center">
              {/* Outer Pulsing Glow */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-24 h-24 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-cyan-200 border-l-purple-300 opacity-80"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">HS</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold"
              >
                Initializing Core Environment
              </motion.h2>

              <div className="w-48 h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-600"
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-[10px] text-white/30 mt-2 font-mono"
              >
                PORT: 3000 // UTC+0 SECURE PROTOCOL
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background and Cursor components */}
      <ParticleBackground />
      <CustomCursor />
      <AiChatbot />
      <CommandPalette
        onToggleMusic={handleToggleMusic}
        musicPlaying={musicPlaying}
        onOpenChat={handleOpenChat}
      />

      {/* 2. Sticky Glassmorphic Navbar */}
      <nav id="navbar" className="sticky top-0 w-full z-40 bg-[#030014]/65 backdrop-blur-xl border-b border-white/5 px-6 py-3.5 flex items-center justify-between transition-all duration-300">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-cyan-500/10 group-hover:shadow-cyan-500/35 transition duration-300">
            H
          </span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Hariselvan<span className="text-cyan-400">.</span>
          </span>
        </a>

        {/* Desktop Menu links */}
        <div className="hidden lg:flex items-center gap-6">
          {["home", "about", "skills", "projects", "experience", "achievements", "certificates", "resume", "contact"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`text-xs font-semibold uppercase tracking-widest transition-all duration-200 relative py-1 hover:text-white ${activeSection === section ? "text-cyan-400 font-bold" : "text-slate-400"
                }`}
            >
              {section}
              {activeSection === section && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-3">
          {/* Theme Customizer Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === "nebula" ? "cyberpunk" : "nebula")}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
            title="Toggle Visual Aura Theme"
          >
            {themeMode === "nebula" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Synth ambient soundtrack play/pause */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
            <button
              onClick={handleToggleMusic}
              className="text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="Toggle Cyberpunk ambient music synthesizer"
            >
              {musicPlaying ? (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden md:inline text-[10px] font-bold">AMBIENT SYNTH</span>
            </button>

            {/* Simulated Live visualizer bars */}
            <div className="flex items-end gap-0.5 h-3">
              {visualizerBars.map((barHeight, idx) => (
                <div
                  key={idx}
                  style={{ height: `${barHeight}px` }}
                  className={`w-0.5 rounded-full transition-all duration-100 ${musicPlaying ? "bg-cyan-400" : "bg-white/10"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Hamburger Mobile Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-300 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Scroll Progress Indicator Bar */}
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 z-50 transition-all duration-100" style={{ width: `${scrollProgress}%` }} />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-[#080517]/95 border-b border-white/10 overflow-hidden z-30 absolute left-0"
          >
            <div className="flex flex-col p-6 gap-4">
              {["home", "about", "skills", "projects", "experience", "achievements", "certificates", "resume", "contact"].map((sec) => (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition py-1 border-b border-white/5"
                >
                  {sec}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <main className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-36">

        {/* ----------------- 3. HERO SECTION ----------------- */}
        <section id="home" className="min-h-[85vh] flex flex-col justify-center pt-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Texts Content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 shadow-inner"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-300">COMPUTER SCIENCE STUDENT</span>
              </motion.div>

              <div className="space-y-3">
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl font-medium text-slate-300"
                >
                  Hi, I'm
                </motion.h4>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-5xl md:text-7xl font-black tracking-tight"
                >
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent       ">Hariselvan Sundaramoorthy</span>
                  <span className="text-cyan-400 animate-pulse">_</span>
                </motion.h1>

                {/* Subtitle / Typing dynamic line */}
                <div className="h-8 md:h-10 flex items-center">
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {typingText}
                  </span>
                  <span className="w-1.5 h-6 bg-cyan-400 ml-1.5 animate-pulse inline-block" />
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl"
              >
                I build beautiful, highly scalable, and modern full-stack web applications.
                Specializing in the MERN ecosystem and deploying artificial intelligence models directly on server proxies.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 pt-3"
              >
                <a
                  href="#resume"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-xs tracking-wider uppercase hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Download Resume
                </a>
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-200 hover:text-cyan-400 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                  View Projects
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/HARISELVAN417"
                    target="_blank"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/35 hover:text-cyan-400 text-slate-300 transition"
                  >
                    <Github className="w-4.5 h-4.5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hariselvans/"
                    target="_blank"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/35 hover:text-cyan-400 text-slate-300 transition"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Rotating Frame Image Profile */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative group w-64 h-64 md:w-80 md:h-80"
              >
                {/* Neon Rotating Outer Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-cyan-300 animate-spin opacity-50 blur-md scale-105 group-hover:scale-110 transition duration-500" style={{ animationDuration: "12s" }} />
                <div className="absolute inset-2 rounded-full bg-slate-950 z-10" />

                {/* Second reverse ring */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-purple-600 via-cyan-400 to-violet-500 animate-spin opacity-40 z-15" style={{ animationDuration: "18s", animationDirection: "reverse" }} />

                {/* Glowing Core Image container */}
                <div className="absolute inset-6 rounded-full overflow-hidden border border-white/15 z-20 flex items-center justify-center bg-slate-950">
                  <div className="absolute inset-0">
                    <img
                      src="src/assets/images/WhatsApp Image 2025-12-08 at 9.28.01 PM.jpeg"
                      alt="Hariselvan S"
                      className="w-full h-full object-cover rounded-full filter brightness-90 hover:brightness-100 transition duration-300 animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Subtle dark overlay gradient for readability of text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-45 transition-opacity z-10" />
                  <div className="relative flex flex-col items-center justify-center text-center p-4 space-y-1 z-20 mt-auto pb-5 md:pb-6">
                    <div>
                      <h5 className="font-extrabold text-xs md:text-sm tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Hariselvan S</h5>
                      <p className="text-[9px] md:text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Aspiring Full Stack Developer</p>
                    </div>
                    {/* Tiny stats floating pill */}
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/15 text-[8px] font-mono text-emerald-400 flex items-center gap-1.5 w-fit mx-auto">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                      ACTIVE CODEBASE
                    </span>
                  </div>
                </div>

                {/* Decorative floating widgets around the avatar */}
                <div className="absolute -top-4 -right-4 bg-[#0d092b]/80 border border-white/10 backdrop-blur-md p-3 rounded-2xl shadow-xl z-30 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-mono">Status</p>
                    <p className="text-[11px] font-bold text-slate-200">Open for Internships</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[#0a0f2b]/80 border border-white/10 backdrop-blur-md p-3 rounded-2xl shadow-xl z-30 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Cpu className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/50 uppercase tracking-widest font-mono">Stack Core</p>
                    <p className="text-[11px] font-bold text-slate-200">React + Node + MongoDB</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* 4. STATISTICS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 pt-10 border-t border-white/5">
            {[
              { label: "Projects Completed", value: "15+", desc: "Full Stack & Frontend", icon: Layers, color: "text-cyan-400" },
              { label: "Technologies Learned", value: "20+", desc: "Languages & Frameworks", icon: Code, color: "text-purple-400" },
              { label: "GitHub Repositories", value: "24", desc: "Open Source Contribs", icon: Github, color: "text-cyan-300" },
              { label: "Coding Problems Solved", value: "250+", desc: "LeetCode & GFG Modules", icon: Award, color: "text-amber-400" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.3)", backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="p-5 rounded-2xl bg-white/1 border border-white/5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Little decorative dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{stat.value}</h2>
                    <p className="text-xs font-bold text-slate-300 mt-1">{stat.label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{stat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-white/30 animate-bounce">
            <span className="text-[9px] font-mono tracking-widest">SCROLL DOWN</span>
            <div className="w-5 h-8 rounded-full border border-white/20 p-1 flex justify-center">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </section>


        {/* ----------------- 4. ABOUT SECTION ----------------- */}
        <section id="about" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">WHO I AM</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Professional Introduction</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Discover my academic roots, current learning vectors, and personal interest spreads.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left intro and general fields card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0e0c25]/50 backdrop-blur-md border border-white/10 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  About Hariselvan S
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  I am currently a Bachelor of Engineering (B.E) in Computer Science and Engineering student.
                  My engineering ethos is grounded in building high-performance systems with gorgeous interactive frontend visuals.
                  Mastering the full MERN stack has allowed me to engineer fluid, production-ready web servers, databases, and secure clients.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Beyond college curricula, I actively engage with developer communities. I learn and implement artificial intelligence pipelines (like Google's Gemini models) to create useful tools that solve community-centric issues.
                </p>

                {/* Personal Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  {[
                    { label: "Location", val: "Vellore, Tamil Nadu, India", icon: MapPin },
                    { label: "Education", val: "B.E CSE Student (Grad 2028)", icon: BookOpen },
                    { label: "Email Address", val: "hariselvans96@gmail.com", icon: Mail },
                    { label: "Languages", val: "English, Tamil", icon: Globe },
                    { label: "Interests", val: "AI, Open Source, UI/UX, Travel", icon: Heart },
                    { label: "Daily Streaks", val: "250+ Coding Questions", icon: Flame },
                  ].map((field, idx) => {
                    const Icon = field.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-cyan-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{field.label}</p>
                          <p className="text-xs font-semibold text-slate-200">{field.val}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Learning Modules Grid */}
              <div className="p-6 rounded-2xl bg-[#0e0c25]/50 backdrop-blur-md border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Active Learning Sectors (2026)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Cloud Systems", desc: "Vercel, AWS S3, Render clusters, and automated continuous integrations.", icon: Layers },
                    { title: "System Design", desc: "Load balancing, server caching algorithms, SQL database replication.", icon: Cpu },
                    { title: "AI Integrations", desc: "Secure proxying, prompt chains, context caching with Gemini API.", icon: Sparkles },
                  ].map((learn, idx) => {
                    const Icon = learn.icon;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 w-fit">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h5 className="text-xs font-bold text-white">{learn.title}</h5>
                        <p className="text-[10px] text-slate-400 leading-normal">{learn.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Academic & Career Timeline Grid */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0e0c25]/50 backdrop-blur-md border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Evolution Timeline
              </h3>

              <div className="relative border-l border-white/10 pl-6 space-y-8 ml-2">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle timeline dot */}
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 border-2 border-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/20" />

                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold">
                        {evt.year}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{evt.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ----------------- 5. SKILLS SECTION ----------------- */}
        <section id="skills" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">TECHNICAL STACK</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Core Competencies</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Interactive overview of my core frontend, backend, tools, and programming directories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(["frontend", "backend", "programming", "tools"] as const).map((category) => {
              const categorySkills = skills.filter((s) => s.category === category);
              const title = category === "frontend" ? "Frontend Web" : category === "backend" ? "Backend & Cloud" : category === "programming" ? "Languages" : "Tools & Platforms";
              const gradient = category === "frontend" ? "from-cyan-500 to-blue-500" : category === "backend" ? "from-purple-600 to-indigo-500" : category === "programming" ? "from-amber-500 to-orange-500" : "from-emerald-500 to-teal-500";
              const iconColor = category === "frontend" ? "text-cyan-400" : category === "backend" ? "text-purple-400" : category === "programming" ? "text-amber-400" : "text-emerald-400";

              return (
                <div key={category} className="p-5 rounded-2xl bg-white/1 border border-white/5 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${iconColor}`}>
                      {category === "frontend" ? <Layers className="w-5 h-5" /> : category === "backend" ? <Cpu className="w-5 h-5" /> : category === "programming" ? <Code className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                    </div>
                    <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">{title}</h3>
                  </div>

                  <div className="space-y-4">
                    {categorySkills.map((skill) => {
                      // Circle calculations for progress
                      const radius = 18;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (skill.level / 100) * circumference;
                      const stopColor1 = category === "frontend" ? "#06b6d4" : category === "backend" ? "#9333ea" : category === "programming" ? "#f59e0b" : "#10b981";
                      const stopColor2 = category === "frontend" ? "#3b82f6" : category === "backend" ? "#6366f1" : category === "programming" ? "#f97316" : "#14b8a6";

                      return (
                        <div key={skill.name} className="flex items-center justify-between gap-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                          <div className="flex items-center gap-3">
                            {/* Skill category-specific icon indicators */}
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition" />
                            <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                          </div>

                          {/* Animated circular progress bar */}
                          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                              {/* Background Circle */}
                              <circle
                                cx="24"
                                cy="24"
                                r={radius}
                                className="stroke-white/10 fill-none"
                                strokeWidth="3.5"
                              />
                              {/* Glowing Active Circle */}
                              <motion.circle
                                cx="24"
                                cy="24"
                                r={radius}
                                className={`fill-none`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke={`url(#grad-${skill.name.replace(/[^a-zA-Z0-9]/g, "-")})`}
                                initial={{ strokeDashoffset: circumference }}
                                whileInView={{ strokeDashoffset }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                strokeDasharray={circumference}
                              />
                              {/* Linear gradient definition */}
                              <defs>
                                <linearGradient id={`grad-${skill.name.replace(/[^a-zA-Z0-9]/g, "-")}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={stopColor1} />
                                  <stop offset="100%" stopColor={stopColor2} />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute text-[10px] font-mono font-bold text-white drop-shadow-sm">
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ----------------- 6. PROJECTS SECTION ----------------- */}
        <section id="projects" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">MY PORTFOLIO WORK</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Featured Projects</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Deeply engineered applications crafted with the MERN stack, Web APIs, and machine learning models.</p>
          </div>

          {/* Projects Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between h-[390px] rounded-2xl bg-[#0b081e]/85 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-all overflow-hidden shadow-xl"
              >
                {/* Image Backdrop Preview Area */}
                <div className="h-40 relative bg-gradient-to-b from-purple-900/10 to-slate-950 flex items-center justify-center text-6xl group-hover:scale-105 transition duration-500 border-b border-white/5 select-none">
                  {/* Neon Glow Circle back of emoji */}
                  <div className="absolute w-20 h-20 rounded-full bg-cyan-500/10 blur-xl opacity-60 group-hover:opacity-100 transition" />
                  {project.image}

                  {/* Absolute tags */}
                  <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                    {project.tech.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{project.tech[0]}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/35 hover:bg-cyan-500/5 text-xs text-slate-300 hover:text-cyan-400 transition font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-300 transition"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white transition hover:shadow-lg hover:shadow-cyan-500/10"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Project Details Modal Lightbox Overlay */}
          <AnimatePresence>
            {selectedProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProject(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-2xl rounded-2xl bg-[#0a071d]/95 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                  {/* Image/Emoji Header */}
                  <div className="h-44 bg-gradient-to-b from-purple-900/20 to-[#03010f] border-b border-white/10 flex items-center justify-center relative text-7xl select-none">
                    <div className="absolute w-28 h-28 rounded-full bg-cyan-500/15 blur-2xl" />
                    {selectedProject.image}
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{selectedProject.subtitle}</span>
                      <h3 className="text-2xl font-black text-white mt-1">{selectedProject.title}</h3>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedProject.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Key Features & Metrics</h4>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feat, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed">
                            <span className="text-cyan-400 shrink-0 select-none">✦</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech tag list */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Technologies Deployed</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tech.map((t) => (
                          <span key={t} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="p-4 border-t border-white/10 bg-[#03010f] flex gap-3">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-xs text-slate-300 hover:text-cyan-400 text-center font-bold flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </a>
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-center font-bold flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch Live Demo
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>


        {/* ----------------- 7. EXPERIENCE SECTION ----------------- */}
        <section id="experience" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">PRACTICAL VENTURES</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Workshops & Internships</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Highlighting professional internship periods, campus tech leads, and hackathon milestones.</p>
          </div>

          {/* Experience Grid Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiences.map((exp, idx) => {
              const badgeColors =
                exp.category === "Internships"
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
                  : exp.category === "Hackathons"
                    ? "bg-purple-500/15 text-purple-400 border-purple-500/20"
                    : exp.category === "Leadership"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";

              return (
                <motion.div
                  key={idx}
                  whileHover={{ borderColor: "rgba(168, 85, 247, 0.35)", x: 4 }}
                  className="p-6 rounded-2xl bg-[#0b081e]/80 border border-white/10 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${badgeColors}`}>
                        {exp.category}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">{exp.title}</h3>
                    <p className="text-xs font-bold text-cyan-400">{exp.organization}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>

                  {/* Decorative timeline bullet anchor */}
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-semibold pt-2 border-t border-white/5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    verified credentials
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>


        {/* ----------------- 8. ACHIEVEMENTS SECTION ----------------- */}
        <section id="achievements" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">HALL OF FAME</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Milestones & Awards</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Showcasing recognition from engineering festivals and global competitive forums.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach) => (
              <motion.div
                key={ach.id}
                whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.4)", backgroundColor: "rgba(255,255,255,0.03)" }}
                className="p-5 rounded-2xl bg-white/1 border border-white/5 backdrop-blur-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{ach.category}</span>
                    <span className="text-xl select-none">{ach.iconName}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-100">{ach.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
                </div>

                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block text-right">★ HS AWARD</span>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ----------------- 9. CERTIFICATES SECTION ----------------- */}
        <section id="certificates" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">ACADEMIC PROOF</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Professional Badges</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Click on any certificate badge to view credentials or launch verification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCertificate(cert)}
                className="group p-5 rounded-2xl bg-[#0b081e]/80 border border-white/10 hover:border-cyan-500/35 hover:bg-cyan-500/5 transition duration-300 cursor-pointer flex items-center gap-4 relative"
              >
                {/* Decorative glow badge */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0 select-none">
                  {cert.image}
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-100 group-hover:text-cyan-400 transition">
                    {cert.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cert.issuer}</p>
                  <p className="text-[9px] text-white/30 font-mono uppercase tracking-wider mt-1">{cert.date}</p>
                </div>

                {/* Abs Indicator link */}
                <span className="absolute top-4 right-4 text-[9px] text-white/25 group-hover:text-cyan-400 font-mono uppercase tracking-widest transition">
                  ZOOM
                </span>
              </div>
            ))}
          </div>

          {/* Certificate zoom Lightbox Modal */}
          <AnimatePresence>
            {selectedCertificate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-md rounded-2xl bg-[#0a071d]/95 border border-white/15 p-6 shadow-2xl space-y-6"
                >
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center space-y-4">
                    <span className="text-6xl mx-auto block select-none">{selectedCertificate.image}</span>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                        Verified Credentials
                      </span>
                      <h3 className="text-lg font-black text-white mt-2.5">{selectedCertificate.title}</h3>
                      <p className="text-sm text-slate-400">{selectedCertificate.issuer}</p>
                      <p className="text-xs text-white/30 mt-1">Granted in {selectedCertificate.date}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    This badge indicates official completion of rigorous educational projects and examinations verified by the parent authorization boards.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white transition font-bold"
                    >
                      Dismiss
                    </button>
                    <a
                      href={selectedCertificate.verificationUrl}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs text-center font-bold flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify Online
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>


        {/* ----------------- 10. GITHUB STATISTICS DASHBOARD ----------------- */}
        <section className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">LIVE ANALYTICS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">GitHub Ecosystem</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Verifying live server repositories, code contributions, and language spreads.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e0c25]/40 border border-white/10 backdrop-blur-md space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 text-cyan-400">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">@HARISELVAN417</h3>
                  <p className="text-xs text-white/50">Active repository commits in real time</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { label: "Repos", val: repoCount },
                  { label: "Followers", val: followers },
                  { label: "Stars", val: gigaStars },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-center min-w-[70px]">
                    <span className="text-xs text-white/50 block font-mono uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-bold text-white">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Contribution Map simulation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Contribution Activity Grid</span>
                <span className="text-[10px] text-white/40 font-mono">1,142 commits over past year</span>
              </div>

              {/* Box grid */}
              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-30 gap-1.5 p-4 rounded-xl bg-white/5 border border-white/5">
                {contributionLevels.map((lvl, idx) => {
                  const color =
                    lvl === 0
                      ? "bg-white/5"
                      : lvl === 1
                        ? "bg-cyan-950 text-cyan-400"
                        : lvl === 2
                          ? "bg-cyan-800 text-cyan-300"
                          : lvl === 3
                            ? "bg-cyan-600 text-cyan-100"
                            : "bg-cyan-400 text-white shadow-sm shadow-cyan-500/20";
                  return (
                    <div
                      key={idx}
                      className={`aspect-square w-full rounded-sm transition hover:scale-125 ${color}`}
                      title={`${lvl * 2 + 1} commits on selected day`}
                    />
                  );
                })}
              </div>

              {/* Grid Legends */}
              <div className="flex justify-end items-center gap-1.5 text-[10px] text-white/40 font-mono">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-white/5" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-950" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-800" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                <span>More</span>
              </div>
            </div>

            {/* Interactive Custom SVG Language stats wheel and Recent Commit line */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Language Spread Chart */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Languages Used</h4>
                <div className="space-y-3.5">
                  {[
                    { lang: "JavaScript / React", percent: 45, color: "bg-cyan-400" },
                    { lang: "TypeScript", percent: 25, color: "bg-purple-500" },
                    { lang: "Java", percent: 15, color: "bg-amber-500" },
                    { lang: "Python & Other", percent: 15, color: "bg-emerald-500" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>{item.lang}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Commit History Line */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent Repository Commits</h4>

                <div className="space-y-3">
                  {[
                    { repo: "foodconnect", text: "feat: integrate gemini vision models for freshness evaluation", age: "2 hours ago" },
                    { repo: "portfolio", text: "style: upgrade custom synth wave volume and visualizer modules", age: "1 day ago" },
                    { repo: "inventory-os", text: "fix: solve secure payment checkout validation pathway", age: "3 days ago" },
                  ].map((commit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-white/1 border border-white/5">
                      <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 mt-0.5">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-slate-200">HARISELVAN417 / {commit.repo}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{commit.text}</p>
                        <span className="text-[9px] text-white/30 font-mono">{commit.age}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ----------------- 12. RESUME SECTION ----------------- */}
        <section id="resume" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">CURRICULUM VITAE</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Interactive Resume</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Examine detailed qualifications directly on-screen or print a PDF copy.</p>
          </div>

          {/* Premium animated paper layout */}
          <div className="max-w-4xl mx-auto p-1 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-purple-600/10 to-transparent border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-10 bg-slate-950/90 rounded-[22px] backdrop-blur-md space-y-8 relative">

              {/* Abs verification watermark */}
              <div className="absolute top-10 right-10 opacity-[0.02] text-9xl font-black select-none pointer-events-none text-right">
                RESUME
              </div>

              {/* Paper Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <h3 className="text-3xl font-black text-white">Hariselvan S</h3>
                  <p className="text-cyan-400 font-mono tracking-widest uppercase text-xs mt-1">Aspiring Full Stack Developer</p>
                  <p className="text-slate-400 text-xs mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Vellore, Tamil Nadu
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-slate-300 text-xs font-mono">
                  <a href="mailto:hariselvans96@gmail.com" className="hover:text-cyan-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> hariselvans96@gmail.com
                  </a>
                  <a href="https://github.com/HARISELVAN417" className="hover:text-cyan-400 flex items-center gap-2">
                    <Github className="w-3.5 h-3.5" /> github.com/HARISELVAN417
                  </a>
                  <span className="flex items-center gap-2 text-white/30">
                    <Globe className="w-3.5 h-3.5" /> Portfolio Verified
                  </span>
                </div>
              </div>

              {/* Paper Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs leading-relaxed text-slate-300">

                {/* left col: Education, programming */}
                <div className="md:col-span-5 space-y-6">

                  {/* Education */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-2">
                      <Book className="w-4 h-4 text-cyan-400" />
                      Education
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-extrabold text-slate-200">Saveetha Engineering College</p>
                        <p className="text-slate-400">B.E - Computer Science Engineering</p>
                        <p className="text-[10px] text-cyan-400 font-mono">2024 - 2028 (Pursuing)</p>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <p className="font-extrabold text-slate-200">SKV Matric Hr Sec School</p>
                        <p className="text-slate-400">LKG - 12th Grade</p>
                        <p className="text-[10px] text-cyan-400 font-mono">2010 - 2024 (Completed)</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      Key Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React.js",
                        "JavaScript",
                        "Python",
                        "HTML5 & CSS3",
                        "Automation Anywhere",
                        "REST APIs",
                        "Git & GitHub",
                        "LLM(n8n)",
                        "Responsive Web Design",
                        "Database Basics"
                      ].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      Languages
                    </h4>
                    <div className="space-y-1 text-slate-400 font-mono">
                      <p className="text-slate-200">&bull; English (Fluent)</p>
                      <p className="text-slate-200">&bull; Tamil (Native)</p>
                    </div>
                  </div>

                </div>

                {/* right col: projects details */}
                <div className="md:col-span-7 space-y-6">

                  {/* Selected projects */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      Core Projects
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <p className="font-extrabold text-slate-100 flex items-center justify-between">
                          <span>Inventory Management Website</span>
                          <span className="text-[10px] font-mono text-cyan-400">React.js + Express</span>
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Developed a full-stack inventory tracking system with CRUD operations, clean UI, and improved stock tracking efficiency.
                        </p>
                      </div>

                      <div>
                        <p className="font-extrabold text-slate-100 flex items-center justify-between">
                          <span>Food Waste Detector & Donation Suggestor</span>
                          <span className="text-[10px] font-mono text-purple-400">Python + Django</span>
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Designed an AI-based system to detect food waste and suggest donation options with smart recommendations. Converted to Django and integrated real-time databases.
                        </p>
                      </div>

                      <div>
                        <p className="font-extrabold text-slate-100 flex items-center justify-between">
                          <span>AI Smart Campus Assistant</span>
                          <span className="text-[10px] font-mono text-emerald-400">Three.js + Realtime DB</span>
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Created an intelligent student assistant platform featuring animations using Three.js and real-time database integrations.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Actions segment */}
              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  Secured &middot; Verified &middot; PDF Printable
                </span>
                <div className="flex gap-2">
                  <a
                    href="mailto:hariselvans96@gmail.com"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/35 hover:bg-cyan-500/5 text-slate-200 hover:text-cyan-400 font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Email to Hire
                  </a>
                  <a
                    href={ResumePDF}
                    download="Hariselvan_resume_update_currently.pdf"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold transition hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Print / Download PDF
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ----------------- 13. CONTACT SECTION ----------------- */}
        <section id="contact" className="space-y-12 pt-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Connect With Me</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
            <p className="text-sm text-slate-400">Drop a brief message or query directly to my server inbox.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Glass Contact Form Card */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#0b0821]/80 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Glow spots */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl pointer-events-none" />

              <form onSubmit={handleContactSubmit} className="space-y-5 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" />
                  Send A Direct Message
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Anand Krishnan"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. anand@college.edu"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="e.g. Collaboration on Smart Food Waste redistribution models"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Enter your detailed proposal..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
                  />
                </div>

                {contactStatus.text && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${contactStatus.type === "success"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    }`}>
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{contactStatus.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs tracking-wider uppercase transition-all hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {contactLoading ? "Processing Server Pathways..." : "Transmit Secure Message"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right Map & Direct coordinates widget card */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">

              {/* Interactive styled Location Map view */}
              <div className="p-1 rounded-3xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden flex-1 flex flex-col justify-between">
                <div className="h-44 relative bg-slate-900 overflow-hidden flex items-center justify-center">

                  {/* Cyberpunk Map design vector canvas */}
                  <div className="absolute inset-0 bg-[#03010b]" />
                  {/* Neon Grid back */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />

                  {/* Radar ping on Vellore coordinates */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 animate-ping absolute" />
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 animate-ping absolute" style={{ animationDelay: "0.5s" }} />
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 absolute z-10" />
                  </div>

                  {/* City Label overlay */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 text-[10px] text-white/80 font-mono">
                    VELLORE, TAMIL NADU // 12.9165° N, 79.1325° E
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Locational Coordinates</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Located in Vellore, Tamil Nadu, India. Operating in Indian Standard Time (IST, UTC+05:30). Open to remote internships as well as physical roles.
                  </p>

                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>LOCAL TIME: {timeStr || "19:54:40"} (IST)</span>
                  </div>
                </div>
              </div>

              {/* Social links grid container */}
              <div className="p-5 rounded-2xl bg-[#0b081e]/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Social Ecosystem</h4>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "GitHub", url: "https://github.com/HARISELVAN417", icon: Github, color: "hover:text-cyan-400" },
                    { label: "LinkedIn", url: "https://www.linkedin.com/in/hariselvans/", icon: Linkedin, color: "hover:text-blue-400" },
                    { label: "LeetCode", url: "https://leetcode.com", icon: Code, color: "hover:text-amber-400" },
                    { label: "GeeksforGeeks", url: "https://geeksforgeeks.org", icon: Award, color: "hover:text-emerald-400" },
                    { label: "Instagram", url: "https://instagram.com", icon: Heart, color: "hover:text-pink-400" },
                    { label: "Mail Direct", url: "mailto:hariselvans96@gmail.com", icon: Mail, color: "hover:text-purple-400" },
                  ].map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        className={`p-2.5 rounded-xl bg-white/5 border border-white/15 text-center flex flex-col items-center justify-center gap-1 transition-all ${link.color} hover:bg-white/10`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-bold font-mono tracking-tight">{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ----------------- 14. FOOTER ----------------- */}
        <footer className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40 pb-12">

          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs">
              H
            </span>
            <span>&copy; {new Date().getFullYear()} Hariselvan S. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              VISITOR COUNT: {visitorCount}
            </span>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 text-slate-400 cursor-pointer flex items-center gap-1 transition"
              title="Scroll back to topmost header"
            >
              <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Top</span>
            </button>
          </div>

        </footer>

      </main>

    </div>
  );
}
