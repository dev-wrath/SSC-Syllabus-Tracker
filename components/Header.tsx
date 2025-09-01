
import React from 'react';
import { TargetIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <TargetIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="ml-3 text-2xl font-bold text-slate-100 tracking-tight">
          SSC Syllabus Tracker
        </h1>
      </div>
    </header>
  );
};
