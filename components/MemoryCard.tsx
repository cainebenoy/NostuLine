import React from 'react';
import { Memory } from '../types';

interface MemoryCardProps {
  data: Memory;
  onEdit?: (memory: Memory) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ data, onEdit }) => {
  // Parse date for display (e.g., "2023-11-12" -> "NOV 12, 2023")
  const dateObj = new Date(data.date);
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  return (
    <div className="group relative flex h-60 w-48 flex-col justify-between rounded-xl bg-white/40 p-4 shadow-lg shadow-black/10 ring-1 ring-inset ring-white/20 backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 dark:bg-black/20 dark:shadow-primary/10 dark:hover:shadow-primary/30">
      
      {/* Edit Button */}
      {onEdit && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onEdit(data);
            }}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-slate-700 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover:opacity-100 dark:bg-black/40 dark:text-slate-200 dark:hover:bg-black/60 z-30"
            title="Edit Memory"
        >
            <span className="material-symbols-outlined text-[14px]">edit</span>
        </button>
      )}

      <div className="flex flex-col items-center text-center mt-3">
        <span className="text-4xl select-none filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">{data.emoji}</span>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#3d2f21] dark:text-[#f0e2d3] opacity-70">
            {formattedDate}
            </p>
        </div>
        <div className="text-center">
            <p className="text-sm font-bold text-[#1c140d] dark:text-[#fcfaf8] line-clamp-2 leading-tight">
            {data.title}
            </p>
        </div>
        {data.description && (
             <div className="text-center mt-0.5">
             <p className="text-[10px] font-medium text-[#5c4a3d] dark:text-[#d0c2b3] line-clamp-3 leading-relaxed opacity-90">
             {data.description}
             </p>
         </div>
        )}
      </div>
      
      {/* Decorative gradient blob at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20 rounded-b-xl pointer-events-none"
      />
    </div>
  );
};

export default MemoryCard;