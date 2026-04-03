'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="/images/hero.webp"
        alt="جزارة السرايا"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />

      {/* Animated gold radial accent */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4a574]/10 blur-[120px] pointer-events-none"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-gradient text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          أفضل اللحوم الطازجة
        </motion.h1>

        <motion.p
          variants={slideUpVariants}
          className="text-[#a0a0b0] text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          نقدم لكم أجود أنواع اللحوم الطازجة في الإسكندرية
        </motion.p>

        <motion.div variants={slideUpVariants}>
          <a
            href="#menu"
            className="inline-block bg-gradient-gold text-[#0a0a0a] font-bold text-lg px-10 py-4 rounded-full
                       shadow-[0_0_30px_rgba(212,165,116,0.3)] hover:shadow-[0_0_40px_rgba(212,165,116,0.45)]
                       transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            تصفح المنتجات
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
