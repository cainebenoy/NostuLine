import React, { useState, useMemo, useRef, useEffect } from 'react';
import TimelineView, { TimelineRef } from './components/TimelineView';
import GalleryView from './components/GalleryView';
import SettingsView from './components/SettingsView';
import AddMemoryModal from './components/AddMemoryModal';
import { Memory } from './types';

// Initial Mock Data
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'First Autumn Rain',
    date: '2023-11-12',
    emoji: '🍂',
    description: 'The smell of wet earth and the sound of raindrops against the window.',
  },
  {
    id: '2',
    title: 'Summer Roadtrip',
    date: '2023-07-15',
    emoji: '🚐',
    description: 'Driving down the coast with the windows down and music blasting.',
  },
  {
    id: '3',
    title: 'New Year, New Me',
    date: '2024-01-01',
    emoji: '🎆',
    description: 'Watching the fireworks illuminate the city skyline.',
  },
  {
    id: '4',
    title: 'Spring Blossom',
    date: '2024-04-10',
    emoji: '🌸',
    description: 'Picnic under the cherry blossom trees in the park.',
  },
  {
    id: '5',
    title: 'Coffee Date',
    date: '2023-09-20',
    emoji: '☕',
    description: 'Found a cute little cafe tucked away in the alleyway.',
  },
];

type ViewType = 'timeline' | 'gallery' | 'settings';

const App: React.FC = () => {
  // --- State ---
  const [currentView, setCurrentView] = useState<ViewType>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Memory State
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem('memories_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load memories", e);
    }
    return INITIAL_MEMORIES;
  });

  const timelineRef = useRef<TimelineRef>(null);

  // --- Effects ---

  // Persistence
  useEffect(() => {
    localStorage.setItem('memories_data', JSON.stringify(memories));
  }, [memories]);

  // Theme Handling
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Computations ---

  const sortedMemories = useMemo(() => {
    return [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [memories]);

  // --- Handlers ---

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const clearData = () => {
      setMemories(INITIAL_MEMORIES);
      localStorage.removeItem('memories_data');
      alert('Data reset to defaults.');
  };

  const handleSaveMemory = (memoryData: Omit<Memory, 'id'>) => {
    if (editingMemory) {
        // Update existing
        setMemories((prev) => 
            prev.map((m) => m.id === editingMemory.id ? { ...m, ...memoryData } : m)
        );
        setEditingMemory(null);
    } else {
        // Create new
        const memoryWithId: Memory = {
            ...memoryData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setMemories((prev) => [...prev, memoryWithId]);
        
        // If in timeline view, scroll to end
        if (currentView === 'timeline') {
            setTimeout(() => {
                timelineRef.current?.scrollToEnd();
            }, 100);
        }
    }
    setIsModalOpen(false);
  };

  const handleEditRequest = (memory: Memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingMemory(null);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentView === 'timeline') {
        timelineRef.current?.scrollToStart();
    } else {
        setCurrentView('timeline');
    }
  };

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display selection:bg-primary/30">
        
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100/40 via-background-light to-indigo-50/40 dark:from-black dark:via-background-dark dark:to-[#2c1a0f] transition-colors duration-700 ease-in-out"></div>

      <div className="relative z-10 flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 md:px-10 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-black/20 z-50">
          <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
            <div className="p-2 bg-primary/20 rounded-lg">
                <span className="material-symbols-outlined text-primary">hourglass_top</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">NostuLine</h2>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
             <nav className="flex gap-2 bg-white/10 dark:bg-black/20 p-1 rounded-xl backdrop-blur-md border border-white/10">
                <button 
                  onClick={() => setCurrentView('timeline')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currentView === 'timeline' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/10'}`}
                >
                  Timeline
                </button>
                <button 
                  onClick={() => setCurrentView('gallery')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currentView === 'gallery' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/10'}`}
                >
                  Gallery
                </button>
                <button 
                  onClick={() => setCurrentView('settings')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${currentView === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/10'}`}
                >
                  Settings
                </button>
             </nav>
          </div>

          <button 
            onClick={() => {
                setEditingMemory(null);
                setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Add Memory</span>
          </button>
        </header>

        {/* Main Content Area */}
        {/* We use justify-start for Gallery/Settings to allow top-down scrolling, but center for Timeline */}
        <main id="main-timeline-area" className={`flex flex-1 flex-col w-full relative overflow-hidden transition-all duration-500 ${currentView === 'timeline' ? 'items-center justify-center' : 'items-center justify-start'}`}>
          
          {currentView === 'timeline' && (
             <>
                <div className="text-center mb-4 z-20 px-4 pt-4 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                        Your Journey
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                        Every moment is a stepping stone.
                    </p>
                </div>
                <TimelineView 
                    ref={timelineRef} 
                    memories={sortedMemories} 
                    onEditMemory={handleEditRequest} 
                />
             </>
          )}

          {currentView === 'gallery' && (
              <GalleryView 
                memories={sortedMemories} 
                onEditMemory={handleEditRequest} 
              />
          )}

          {currentView === 'settings' && (
              <SettingsView 
                isDarkMode={isDarkMode} 
                onToggleTheme={toggleTheme} 
                onClearData={clearData}
                memoryCount={memories.length}
              />
          )}

        </main>

        {/* Floating Action / Help Button */}
        <div className="absolute bottom-8 right-8 z-50">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform cursor-pointer shadow-lg">
                <span className="material-symbols-outlined">question_mark</span>
            </div>
        </div>
      </div>

      {/* Modal */}
      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveMemory}
        initialData={editingMemory}
      />
    </div>
  );
};

export default App;