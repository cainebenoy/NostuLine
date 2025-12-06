import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Memory } from '../types';
import MemoryCard from './MemoryCard';

// Configuration constants for layout tuning
const LAYOUT_CONFIG = {
  CARD_WIDTH: 192,       // w-48 (12rem) = 192px
  START_PADDING: 128,    // px-32 (8rem) = 128px
  MIN_SPACING: 60,       // Minimum horizontal space between cards (px)
  MAX_SPACING: 800,      // Maximum horizontal space cap (px)
  PIXELS_PER_DAY: 3,     // Spacing multiplier per day difference (Scale factor)
  WAVE_AMPLITUDE: 30     // Vertical offset for the connector wave
};

interface TimelineViewProps {
  memories: Memory[];
  onEditMemory: (memory: Memory) => void;
}

export interface TimelineRef {
  scrollToStart: () => void;
  scrollToEnd: () => void;
}

const TimelineView = forwardRef<TimelineRef, TimelineViewProps>(({ memories, onEditMemory }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToStart: () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    },
    scrollToEnd: () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' });
      }
    }
  }));

  // Helper to calculate days between dates
  const getDaysDifference = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Pre-calculate layout data (X positions) to ensure SVG aligns with Flex/Margin layout
  const layoutItems = useMemo(() => {
    // Start X represents the center of the first node.
    // It must account for the container padding and half the card width.
    let currentX = LAYOUT_CONFIG.START_PADDING + (LAYOUT_CONFIG.CARD_WIDTH / 2);

    return memories.map((memory, index) => {
      let marginLeft = 0;
      
      if (index > 0) {
        const prevDate = memories[index - 1].date;
        const daysDiff = getDaysDifference(prevDate, memory.date);
        
        // Revised Spacing Logic:
        // Purely additive based on time difference, with a minimum floor and a maximum ceiling.
        const dynamicSpacing = daysDiff * LAYOUT_CONFIG.PIXELS_PER_DAY;
        
        marginLeft = Math.min(
            LAYOUT_CONFIG.MIN_SPACING + dynamicSpacing, 
            LAYOUT_CONFIG.MAX_SPACING
        );

        // Update X cursor for the current node.
        // We move past the previous card (CARD_WIDTH) plus the calculated margin.
        currentX += LAYOUT_CONFIG.CARD_WIDTH + marginLeft;
      }
      
      const isEven = index % 2 === 0;
      
      // Calculate Y Offset for the "Wave" Connector
      const yOffset = isEven ? LAYOUT_CONFIG.WAVE_AMPLITUDE : -LAYOUT_CONFIG.WAVE_AMPLITUDE;

      return {
        ...memory,
        x: currentX,
        y: yOffset,
        marginLeft,
        isEven
      };
    });
  }, [memories]);

  return (
    <div className="w-full flex justify-center items-center h-full min-h-[500px]">
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-x-auto overflow-y-hidden hide-scrollbar scroll-smooth perspective-1000"
      >
        <div className="relative flex items-center h-full px-32 min-w-max">
          
          {/* Central Straight Spine (Subtle) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200/50 dark:bg-white/5 z-0"></div>

          {/* SVG Connector Layer (The Wave) */}
          <svg className="absolute top-0 left-0 h-full w-full pointer-events-none z-0 overflow-visible">
             <defs>
                <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
             </defs>
             {layoutItems.map((item, index) => {
                if (index === layoutItems.length - 1) return null;
                const nextItem = layoutItems[index + 1];
                
                const startX = item.x;
                const startY = item.y; 
                const endX = nextItem.x;
                const endY = nextItem.y;

                // Bezier Control Points for a smooth sine wave
                const midX = (startX + endX) / 2;
                const cp1x = midX;
                const cp1y = startY;
                const cp2x = midX;
                const cp2y = endY;
                
                // Highlight line if it connects to or from the hovered item
                const isActive = hoveredIndex !== null && (hoveredIndex === index || hoveredIndex === index + 1);

                return (
                  <g key={`connector-${item.id}`} className="transition-all duration-300 ease-out">
                    <path 
                      d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={isActive ? "5" : "2"}
                      className={`transform translate-y-[50%] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isActive 
                          ? 'text-primary drop-shadow-[0_0_10px_rgba(244,140,37,0.6)] opacity-100' 
                          : 'text-slate-300 dark:text-slate-600 opacity-60'
                      }`}
                    />
                  </g>
                );
             })}
          </svg>
          
          {/* Items Wrapper */}
          <div className="relative flex h-full items-center z-10">
            {layoutItems.map((memory, index) => {
              const isEven = memory.isEven;
              const isHovered = hoveredIndex === index;
              
              return (
                <div 
                  key={memory.id} 
                  className="relative flex flex-col items-center group opacity-0 animate-fade-in-up"
                  style={{ 
                    marginLeft: index === 0 ? '0px' : `${memory.marginLeft}px`,
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: 'forwards'
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Date Label Node (The "Knots" on the wave) */}
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isEven ? 'top-[calc(50%+30px)]' : 'bottom-[calc(50%+30px)]' // Aligned with yOffset
                    } ${isHovered ? 'scale-125' : 'scale-100'}`}
                  >
                     {/* The Dot */}
                     <div 
                        className={`relative rounded-full border-[3px] transition-all duration-300 shadow-sm ${
                            isHovered
                            ? 'h-5 w-5 bg-primary border-primary shadow-[0_0_15px_rgba(244,140,37,0.8)]' 
                            : 'h-3 w-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-500'
                        }`}
                     >
                     </div>
                  </div>

                  {/* Year Label - Positioned next to the Node */}
                  <div className={`absolute left-1/2 -translate-x-1/2 z-20 whitespace-nowrap transition-all duration-300 ${
                      isEven 
                        ? 'top-[calc(50%+50px)]' 
                        : 'bottom-[calc(50%+50px)]'
                  }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                          isHovered 
                          ? 'text-primary scale-110 drop-shadow-sm' 
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {new Date(memory.date).getFullYear()}
                      </span>
                  </div>


                  {isEven ? (
                    <>
                      {/* --- CARD ABOVE --- */}
                      <div className="absolute bottom-1/2 mb-6 flex flex-col items-center">
                        {/* Card Wrapper */}
                        <div 
                            className={`transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom ${
                                isHovered 
                                ? '-translate-y-4 scale-105 z-30 drop-shadow-2xl grayscale-0' 
                                : 'hover:-translate-y-1 grayscale-[0.1]'
                            }`}
                        >
                           <MemoryCard data={memory} onEdit={onEditMemory} />
                        </div>
                        
                        {/* Vertical Drop Line to Node */}
                        <div className={`w-px bg-gradient-to-b from-transparent transition-all duration-500 ${
                            isHovered 
                            ? 'h-10 to-primary/80 opacity-100' 
                            : 'h-8 to-slate-300 dark:to-slate-600 opacity-50'
                        }`}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* --- CARD BELOW --- */}
                      <div className="absolute top-1/2 mt-6 flex flex-col-reverse items-center">
                         {/* Card Wrapper */}
                         <div 
                            className={`transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${
                                isHovered 
                                ? 'translate-y-4 scale-105 z-30 drop-shadow-2xl grayscale-0' 
                                : 'hover:translate-y-1 grayscale-[0.1]'
                            }`}
                         >
                           <MemoryCard data={memory} onEdit={onEditMemory} />
                         </div>
                         
                         {/* Vertical Drop Line to Node */}
                         <div className={`w-px bg-gradient-to-t from-transparent transition-all duration-500 ${
                            isHovered 
                            ? 'h-10 to-primary/80 opacity-100' 
                            : 'h-8 to-slate-300 dark:to-slate-600 opacity-50'
                        }`}></div>
                      </div>
                    </>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TimelineView;