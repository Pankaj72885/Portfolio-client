"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "grid" | "dots" | "waves";
}

// Pre-computed particle positions to avoid impure function calls during render
const PARTICLES = [
  { left: 5, top: 10, duration: 4.2, delay: 0.5 },
  { left: 15, top: 25, duration: 3.5, delay: 1.2 },
  { left: 25, top: 15, duration: 4.8, delay: 0.3 },
  { left: 35, top: 40, duration: 3.2, delay: 1.8 },
  { left: 45, top: 30, duration: 4.5, delay: 0.8 },
  { left: 55, top: 55, duration: 3.8, delay: 1.5 },
  { left: 65, top: 20, duration: 4.1, delay: 0.2 },
  { left: 75, top: 45, duration: 3.6, delay: 1.0 },
  { left: 85, top: 35, duration: 4.4, delay: 0.7 },
  { left: 95, top: 60, duration: 3.3, delay: 1.4 },
  { left: 10, top: 70, duration: 4.0, delay: 0.4 },
  { left: 20, top: 80, duration: 3.9, delay: 1.1 },
  { left: 30, top: 65, duration: 4.6, delay: 0.6 },
  { left: 40, top: 75, duration: 3.4, delay: 1.7 },
  { left: 50, top: 85, duration: 4.3, delay: 0.9 },
  { left: 60, top: 72, duration: 3.7, delay: 1.3 },
  { left: 70, top: 88, duration: 4.7, delay: 0.1 },
  { left: 80, top: 78, duration: 3.1, delay: 1.6 },
  { left: 90, top: 92, duration: 4.9, delay: 0.0 },
  { left: 50, top: 50, duration: 5.0, delay: 1.9 },
];

export function AnimatedBackground({ variant = "grid" }: AnimatedBackgroundProps) {
  if (variant === "dots") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 right-0 opacity-30"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="url(#wave-gradient)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,170.7C672,149,768,107,864,112C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Default: grid with floating particles
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Floating particles */}
      {PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-indigo-400/30"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
