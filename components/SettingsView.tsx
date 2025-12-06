import React from 'react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onClearData: () => void;
  memoryCount: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  isDarkMode, 
  onToggleTheme, 
  onClearData,
  memoryCount 
}) => {
  return (
    <div className="w-full h-full overflow-y-auto flex justify-center pt-20 px-4 pb-20">
      <div className="w-full max-w-2xl animate-fade-in-up">
        
        <div className="mb-8 text-center">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
             <p className="text-slate-500 dark:text-slate-400 mt-2">Customize your experience</p>
        </div>

        <div className="space-y-6">
            
            {/* Appearance Section */}
            <div className="rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Appearance</h3>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-blue-100 text-blue-600'}`}>
                            <span className="material-symbols-outlined">
                                {isDarkMode ? 'dark_mode' : 'light_mode'}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Theme Mode</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isDarkMode ? 'Dark Mode is active' : 'Light Mode is active'}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onToggleTheme}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            isDarkMode ? 'bg-primary' : 'bg-slate-300'
                        }`}
                    >
                        <span 
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition transition-transform duration-200 ease-in-out ${
                                isDarkMode ? 'translate-x-7' : 'translate-x-1'
                            }`} 
                        />
                    </button>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 shadow-sm border border-white/50 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 mb-4">Danger Zone</h3>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <span className="material-symbols-outlined">delete_forever</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Clear All Data</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                This will permanently delete {memoryCount} memories.
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            if(window.confirm('Are you sure you want to delete all memories? This cannot be undone.')) {
                                onClearData();
                            }
                        }}
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                    >
                        Reset Data
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className="text-center mt-12">
                <p className="text-xs text-slate-400 dark:text-slate-600">
                    Nostalgia App v1.0.0 • Built with React & Tailwind
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;