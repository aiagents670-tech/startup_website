'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LETTERS = ['T', 'E', 'R', 'V', 'O', 'M'];

export default function TervomLogo() {
  const [isDark, setIsDark] = useState(true);

  // Detect dark/light mode from the <html> class
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setIsDark(html.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const logoSrc = isDark ? '/tervom-logo-dark.png' : '/tervom-logo-light.png';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* ── Circular Animated Logo ── */}
      <div className="tervom-logo-wrapper" aria-hidden="true">
        {/* Rotating light ring */}
        <div className="tervom-ring-outer" />
        {/* Glowing border circle */}
        <motion.div
          className="tervom-logo-inner"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
        >
          <Image
            src={logoSrc}
            alt="TERVOM Logo"
            width={48}
            height={48}
            className="tervom-logo-img"
            priority
          />
        </motion.div>
      </div>

      {/* ── Animated Word: TERVOM ── */}
      <div className="relative flex items-baseline gap-[1px]" aria-label="TERVOM">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={letter + i}
            className="tervom-letter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 * i,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
        {/* Soft glow after full word loads */}
        <motion.div
          className="tervom-word-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ delay: LETTERS.length * 0.15 + 0.2, duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
