'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmDanger?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function AdminModal({
  isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm',
  confirmDanger = false, loading = false, children
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto rounded-2xl border border-white/10 bg-[#0d1526] shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <div className="flex items-center gap-3">
                  {confirmDanger && <AlertTriangle size={18} className="text-red-400" />}
                  <h3 className="font-heading font-bold text-white">{title}</h3>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                {description && <p className="text-slate-400 text-sm mb-4">{description}</p>}
                {children}
              </div>

              {onConfirm && (
                <div className="flex items-center justify-end gap-3 px-5 pb-5">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all disabled:opacity-50 ${
                      confirmDanger
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                    }`}
                  >
                    {loading ? 'Processing…' : confirmLabel}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
