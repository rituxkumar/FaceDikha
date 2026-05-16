'use client';

import React from 'react';
import { Video, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="h-16 glass-dark border-b border-white/10 px-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          className="bg-primary/20 p-2 rounded-xl"
        >
          <Video className="text-primary w-6 h-6" />
        </motion.div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          FaceDikha.
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl hover:bg-white/5 transition-all text-white/60 hover:text-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
