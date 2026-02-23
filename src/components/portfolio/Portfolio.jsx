import { useEffect, useRef, useState } from "react";
import "./portfolio.css";
import { motion, useInView, useScroll, useTransform } from "motion/react";

const items = [
  {
    id: 1,
    img: "/p1.png",
    title: "Vatstech - Modern Web Platform",
    desc: "A modern web platform offering secure user accounts, AI-powered insights, and client engagement tools. Built with TypeScript for robust type safety and scalability.",
    link: "https://github.com/Harshpandeyiitian04/Vatstech",
  },
  {
    id: 2,
    img: "/p2.png",
    title: "Cars24 - AutoTech Platform",
    desc: "Developed a dynamic website for Cars24 using Next.js for server-side rendering, optimized font loading with Geist font family, and implemented API routes for backend functionality.",
    link: "https://github.com/Harshpandeyiitian04/Cars24",
  },
  {
    id: 3,
    img: "/p3.png",
    title: "TradeX - Stock Market Tracker",
    desc: "Track real-time stock prices, get personalized alerts and explore detailed company insights. Full-stack Next.js application with real-time data integration.",
    link: "https://github.com/Harshpandeyiitian04/TradeX",
  },
  {
    id: 4,
    img: "/p4.png",
    title: "Xpecto '25 - IIT Mandi Fest Website",
    desc: "Official website for Xpecto '25, the annual fest of IIT Mandi. Event management platform with real-time updates, user authentication via Clerk, and Supabase for data management.",
    link: "https://github.com/Harshpandeyiitian04/xpecto-25",
  },
  {
    id: 5,
    img: "/p5.png",
    title: "GenWeb - AI Website Builder",
    desc: "AI-powered website generation tool using Next.js and Agent.ai. Features automated GitHub repository creation, live preview functionality, and dynamic file structure generation.",
    link: "https://github.com/Harshpandeyiitian04/GenWeb",
  },
];

const imgVariants = {
  initial: {
    x: -500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const textVariants = {
  initial: {
    x: 500,
    y: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.05,
    },
  },
};

const ListItem = ({ item }) => {
  const ref = useRef();

  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div className="pItem" ref={ref}>
      <motion.div
        variants={imgVariants}
        animate={isInView ? "animate" : "initial"}
        className="pImg"
      >
        <img src={item.img} alt="" />
      </motion.div>
      <motion.div
        variants={textVariants}
        animate={isInView ? "animate" : "initial"}
        className="pText"
      >
        <motion.h1 variants={textVariants}>{item.title}</motion.h1>
        <motion.p variants={textVariants}>{item.desc}</motion.p>
        <motion.a variants={textVariants} href={item.link} target="_blank" rel="noopener noreferrer">
          <button>View Project</button>
        </motion.a>
      </motion.div>
    </div>
  );
};

const Portfolio = () => {
  const [containerDistance, setContainerDistance] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const calculateDistance = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setContainerDistance(rect.left);
      }
    };

    calculateDistance();

    window.addEventListener("resize", calculateDistance);

    return () => {
      window.removeEventListener("resize", calculateDistance);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref });

  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -window.innerWidth * items.length]
  );

  return (
    <div className="portfolio" ref={ref}>
      <motion.div className="pList" style={{ x: xTranslate }}>
        <div
          className="empty"
          style={{
            width: window.innerWidth - containerDistance,
          }}
        />
        {items.map((item) => (
          <ListItem item={item} key={item.id} />
        ))}
      </motion.div>
      <section />
      <section />
      <section />
      <section />
      <section />
      <div className="pProgress">
        <svg width="100%" height="100%" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#ddd"
            strokeWidth={20}
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#dd4c62"
            strokeWidth={20}
            style={{ pathLength: scrollYProgress }}
            transform="rotate(-90 80 80)"
          />
        </svg>
      </div>
    </div>
  );
};

export default Portfolio;