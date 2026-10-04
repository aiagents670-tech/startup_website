'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const WA_NUMBER  = '917416858563';
const WA_MESSAGE = encodeURIComponent("Hello, I'm interested in discussing my project with you");
const WA_HREF    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [pulse,   setPulse]   = useState(true);

  /* Show button after 1 s; stop pulse ring after 4 s */
  useEffect(() => {
    const show  = setTimeout(() => setVisible(true),  1000);
    const ring  = setTimeout(() => setPulse(false),   5000);
    return () => { clearTimeout(show); clearTimeout(ring); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          id="whatsapp-float-btn"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-20 z-[9999] flex items-center justify-center min-w-[56px] min-h-[56px]"
          style={{ textDecoration: 'none' }}
        >
          {/* Pulse ring */}
          {pulse && (
            <span
              className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
              aria-hidden="true"
            />
          )}

          {/* Glow halo */}
          <span
            className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-md"
            aria-hidden="true"
          />

          {/* Button disc */}
          <span className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.5)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(37,211,102,0.7)]">
            {/* WhatsApp SVG icon — inlined so no extra network request */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="34"
              height="34"
              fill="white"
              aria-hidden="true"
            >
              <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.88-1.813A13.28 13.28 0 0 0 16.004 29.333c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667zm0 24c-2.16 0-4.267-.587-6.107-1.693l-.44-.267-4.08 1.067 1.093-3.973-.28-.453A10.613 10.613 0 0 1 5.333 16c0-5.88 4.787-10.667 10.667-10.667S26.667 10.12 26.667 16 21.88 26.667 16 26.667zm5.84-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-.987 1.253-.16.213-.347.24-.667.08-.32-.16-1.36-.493-2.587-1.573-.96-.853-1.6-1.907-1.787-2.227-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.533-.72-.547h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.763.333 1.36.533 1.827.68.773.24 1.467.2 2.027.12.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
