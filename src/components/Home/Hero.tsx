import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, X, Loader2, Brain, Cloud, Code2, Smartphone, Bot, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCountUp, useSectionInView } from './shared';

const stats = [
  { label: 'Projects Delivered', value: '50+', num: 50, suffix: '+' },
  { label: 'Happy Clients', value: '20+', num: 20, suffix: '+' },
  { label: 'Years Experience', value: '3+', num: 3, suffix: '+' },
  { label: 'Team Members', value: '25+', num: 25, suffix: '+' },
];

const orbitChips = [
  { icon: Brain, label: 'AI', className: 'left-[2%] top-[8%]', anim: 'animate-float' },
  { icon: Code2, label: 'Web', className: 'right-[4%] top-[16%]', anim: 'animate-float-delayed' },
  { icon: Smartphone, label: 'Apps', className: 'left-[6%] bottom-[14%]', anim: 'animate-float-delayed' },
  { icon: Cloud, label: 'Cloud', className: 'right-[2%] bottom-[8%]', anim: 'animate-float' },
];

function Stat({ stat, started, index }: { stat: (typeof stats)[number]; started: boolean; index: number }) {
  const v = useCountUp(stat.num, started);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={started ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
      className="text-center"
    >
      <div className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
        {v}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
    </motion.div>
  );
}

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: statsRef, inView: statsInView } = useSectionInView<HTMLDivElement>(0.4);

  // Subtle 3D tilt on the visual (mouse-driven, desktop only effect)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 120, damping: 18 });
  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const resetTilt = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900 dark:via-primary-800 dark:to-secondary-900">
      {/* Background decor */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-50 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(109,77,148,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary-300/50 blur-3xl dark:bg-primary-600/20 motion-reduce:animate-none animate-float-slow" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-secondary-300/50 blur-3xl dark:bg-secondary-600/20 motion-reduce:animate-none animate-float-slower" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Copy */}
          <div className="min-w-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-lg dark:bg-gray-800"
            >
              <Star className="h-4 w-4 fill-current text-yellow-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Web, Mobile, AI & Business Software — Built Around Your Goals
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl xl:text-6xl"
            >
              Building the{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Future
              </span>
              <br />
              of Digital Innovation
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 dark:text-gray-300 lg:mx-0"
            >
              We build MERN stack web apps, AI chatbots and automations, custom CRM/ERP
              software, and digital marketing that brings customers — from Ujjain, India
              to clients worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.34 }}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/contact')}
                className="inline-flex min-h-[48px] items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-3.5 font-semibold text-white shadow-xl transition-all duration-200 hover:from-primary-600 hover:to-secondary-600"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setIsVideoLoading(true);
                  setIsVideoModalOpen(true);
                }}
                className="inline-flex min-h-[48px] items-center justify-center space-x-2 rounded-xl border border-primary-200 bg-white px-8 py-3.5 font-semibold text-primary-600 shadow-lg transition-all duration-200 hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-800 dark:text-white dark:hover:bg-primary-700"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4 lg:mx-0"
            >
              {stats.map((s, i) => (
                <Stat key={s.label} stat={s} started={statsInView} index={i} />
              ))}
            </motion.div>
          </div>

          {/* CSS-3D visual */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="relative mx-auto w-full max-w-[520px]"
            style={{ perspective: 1200 }}
          >
            <div onMouseMove={onTilt} onMouseLeave={resetTilt} className="relative">
              <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative rounded-3xl border border-white/60 bg-white/85 p-5 shadow-2xl shadow-secondary-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/85 dark:shadow-black/40 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 [animation-duration:1.8s] motion-reduce:animate-none" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Delivery Pipeline · Live
                  </span>
                  <Bot className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { v: '42ms', l: 'API p95' },
                    { v: '98', l: 'Lighthouse' },
                    { v: '63%', l: 'AI deflected' },
                  ].map((m) => (
                    <div key={m.l} className="rounded-xl bg-gray-50 px-2 py-3 dark:bg-white/5">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{m.v}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{m.l}</p>
                    </div>
                  ))}
                </div>
                <svg viewBox="0 0 300 56" className="mt-4 h-12 w-full text-primary-500 dark:text-primary-400" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M0,44 C30,40 45,28 70,30 C95,32 105,18 130,20 C155,22 165,34 190,28 C215,22 225,10 250,12 C270,14 285,8 300,10 L300,56 L0,56 Z" fill="currentColor" opacity="0.15" />
                  <path d="M0,44 C30,40 45,28 70,30 C95,32 105,18 130,20 C155,22 165,34 190,28 C215,22 225,10 250,12 C270,14 285,8 300,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Deploy #312 successful · zero downtime
                </div>
              </motion.div>

              {orbitChips.map((c) => (
                <div
                  key={c.label}
                  className={`absolute ${c.className} z-10 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/95 sm:flex motion-reduce:animate-none ${c.anim}`}
                >
                  <c.icon className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal (kept from previous hero) */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative mx-4 w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
                <h3 className="text-xl font-semibold text-white">Product Demo</h3>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  aria-label="Close demo video"
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="relative aspect-video">
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="h-full w-full"
                  src="/video.mp4"
                  controls
                  autoPlay
                  onLoadedData={() => setIsVideoLoading(false)}
                  onError={() => setIsVideoLoading(false)}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="border-t border-gray-800 bg-gray-900 p-4">
                <p className="text-sm text-gray-400">
                  Watch our product demo to see how we can help transform your business with our innovative solutions.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
