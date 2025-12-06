import React from 'react';
import { Memory } from '../types';
import MemoryCard from './MemoryCard';

interface GalleryViewProps {
  memories: Memory[];
  onEditMemory: (memory: Memory) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ memories, onEditMemory }) => {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {memories.map((memory, index) => (
            <div 
                key={memory.id} 
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="transform transition-all duration-300 hover:scale-105 hover:rotate-1">
                    <MemoryCard data={memory} onEdit={onEditMemory} />
                </div>
            </div>
          ))}
        </div>
        
        {memories.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                <p>No memories found yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;