'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  index?: number;
  loading?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, color, index = 0, loading }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-5 overflow-hidden group hover:border-white/15 transition-all duration-300"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${color} opacity-10 blur-2xl translate-x-6 -translate-y-6 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-16 rounded-lg bg-white/5 animate-pulse mb-1" />
      ) : (
        <div className="text-3xl font-bold text-white font-heading">{value}</div>
      )}
      <div className="text-xs text-slate-500 mt-1 font-medium">{title}</div>
    </motion.div>
  );
}
