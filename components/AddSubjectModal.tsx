
import React, { useState, useEffect } from 'react';
import { iconMap } from './icons';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (name: string, icon: string) => void;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAddSubject }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedIcon('');
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedIcon) {
      onAddSubject(name.trim(), selectedIcon);
    }
  };

  if (!isOpen) return null;

  const availableIcons = Object.keys(iconMap).filter(key => key !== 'TargetIcon');

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-subject-title"
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="add-subject-title" className="text-2xl font-bold text-slate-100 mb-4">
          Add New Subject
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject-name" className="block text-sm font-medium text-slate-400 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Computer Knowledge"
              required
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Choose an Icon
            </label>
            <div className="grid grid-cols-5 gap-3 bg-slate-700/50 p-3 rounded-lg">
              {availableIcons.map(iconKey => {
                const Icon = iconMap[iconKey];
                const isSelected = selectedIcon === iconKey;
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setSelectedIcon(iconKey)}
                    className={`flex items-center justify-center aspect-square rounded-lg transition-all duration-200 ${isSelected ? 'bg-cyan-500 ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-400' : 'bg-slate-600 hover:bg-slate-500'}`}
                    aria-label={`Select ${iconKey} icon`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-slate-200 font-semibold rounded-lg hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !selectedIcon}
              className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
