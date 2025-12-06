import React, { useState, useEffect } from 'react';
import { Memory } from '../types';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id'>) => void;
  initialData?: Memory | null;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    emoji: '✨',
    description: '',
  });

  // Effect to populate form when opening for edit or reset for new
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                title: initialData.title,
                date: initialData.date,
                emoji: initialData.emoji,
                description: initialData.description || '',
            });
        } else {
             setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0],
                emoji: '✨',
                description: '',
            });
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/90 dark:bg-[#2a2018]/95 p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Memory' : 'New Memory'}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white"
              placeholder="e.g. Summer Roadtrip"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>

            {/* Emoji Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mood Emoji
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={2}
                  required
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full rounded-lg border-slate-200 bg-white/50 px-4 py-2.5 text-center text-xl focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border-slate-200 bg-white/50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white"
              placeholder="What made this moment special?"
            />
          </div>

          <div className="mt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
            >
              {initialData ? 'Update Memory' : 'Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;