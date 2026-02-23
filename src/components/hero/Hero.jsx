import { Canvas } from "@react-three/fiber";
import "./hero.css";
import Speech from "./Speech";
import { motion } from "motion/react";
import Shape from "./Shape";
import { Suspense, useState } from "react";
import AIChat from "../ai/AIChat"; // adjust path if needed
import { Bot } from "lucide-react";

const awardVariants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
    },
  },
};

const followVariants = {
  initial: {
    y: -100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
    },
  },
};

const Hero = () => {
  const [showChat, setShowChat] = useState(false);
  return (
    <>
      <div className="hero">
      <div className="hSection left">
        {/* TITLE */}
        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hTitle"
        >
          Hey There,
          <br />
          <span>I'm Harsh Pandey!</span>
        </motion.h1>
        {/* AWARDS */}
        <motion.div
          variants={awardVariants}
          initial="initial"
          animate="animate"
          className="awards"
        >
          <motion.h2 variants={awardVariants}>Full-Stack Developer</motion.h2>
          <motion.p variants={awardVariants}>
            Student at IIT Mandi, specializing in MERN Stack, Next.js, Django, FastAPI and AI-powered web solutions.
          </motion.p>
          <motion.div variants={awardVariants} className="awardList">
            <motion.img variants={awardVariants} src="/award1.png" alt="" />
            <motion.img variants={awardVariants} src="/award2.png" alt="" />
            <motion.img variants={awardVariants} src="/award3.png" alt="" />
          </motion.div>
        </motion.div>
        {/* SCROLL SVG */}
        <motion.a
          animate={{ y: [0, 5], opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          href="#services"
          className="scroll"
        >
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9Z"
              stroke="white"
              strokeWidth="1"
            />
            <motion.path
              animate={{ y: [0, 5] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              d="M12 5V8"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </motion.a>
      </div>
      <div className="hSection right">
        {/* FOLLOW */}
        <motion.div
          variants={followVariants}
          initial="initial"
          animate="animate"
          className="follow"
        >
          <motion.a variants={followVariants} href="https://www.linkedin.com/in/harsh-pandey-6514902ba/">
            <img src="/linkedin.png" alt=""  />
          </motion.a>
          <motion.a variants={followVariants} href="https://github.com/Harshpandeyiitian04">
            <img src="/github.png" alt="" />
          </motion.a>
          <motion.a variants={followVariants} href="https://leetcode.com/u/harshpandey04/">
            <img src="/leetcode.png" alt="" />
          </motion.a>
          <motion.div variants={followVariants} className="followTextContainer">
            <h3 className="followText">FOLLOW ME</h3>
          </motion.div>
        </motion.div>
        {/* BUBBLE */}
        <Speech />
        {/* CERTIFICATE */}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 1 }}
          className="certificate"
        >
          <img src="/certificate.png" alt="" />
          IIT MANDI
          <br />
          B.TECH STUDENT
        </motion.div>
        {/* CONTACT BUTTON */}
        <motion.div
  onClick={() => setShowChat(true)}
  className="contactLink"
  animate={{
    x: [200, 0],
    opacity: [0, 1],
  }}
  transition={{
    duration: 2,
  }}
  style={{ cursor: "pointer" }}
>
  <motion.div
    className="contactButton"
    animate={{ rotate: [0, 360] }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <svg viewBox="0 0 200 200" width="150" height="150">
      <circle cx="100" cy="100" r="90" fill="pink" />
      <path
        id="innerCirclePath"
        fill="none"
        d="M 100,100 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
      />
      <text className="circleText ">
        <textPath href="#innerCirclePath">
          Talk With My
        </textPath>
      </text>
      <text className="circleText">
        <textPath href="#innerCirclePath" startOffset="44%">
          Resume AI •
        </textPath>
      </text>
    </svg>

    <div className="arrow">
      <Bot size={40} color="black" />
    </div>
  </motion.div>
</motion.div>
      </div>
      <div className="bg">
        {/* 3d */}
        <Canvas>
          <Suspense fallback="loading...">
            <Shape />
          </Suspense>
        </Canvas>
        <div className="hImg">
          <img src="/hero.png" alt="" />
        </div>
      </div>
    </div>
      {showChat && (
  <AIChat onClose={() => setShowChat(false)} />
)}
    </>
  );
};

export default Hero;