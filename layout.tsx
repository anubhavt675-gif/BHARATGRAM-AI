import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pb-16 md:pb-0 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-4 py-2 flex justify-between items-center md:px-8 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-saffron via-white to-green p-[1px] rounded-xl shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-black/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                <img src="./logo.png" alt="B" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <span className="text-xl font-black italic tracking-tighter hidden sm:block">
                <span style={{ color: COLORS.SAFFRON }}>Bharat</span><span className="dark:text-white" style={{ color: !isDarkMode ? COLORS.NAVY : undefined }}>gram</span>
            </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500 hover:text-saffron"}><ICONS.Home /></NavLink>
            <NavLink to="/explore" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500 hover:text-saffron"}><ICONS.Search /></NavLink>
            <button onClick={() => setShowCreateModal(true)} className="text-slate-400 dark:text-slate-500 hover:text-saffron transition-colors"><ICONS.Plus /></button>
            <NavLink to="/reels" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500 hover:text-saffron"}><ICONS.Reels /></NavLink>
            <NavLink to="/messages" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500 hover:text-saffron"}><ICONS.Chat /></NavLink>
            <NavLink to="/bharat-ai" className={({isActive}) => isActive ? "text-saffron bg-saffron/10 p-2 rounded-xl" : "text-slate-400 dark:text-slate-500 hover:text-saffron p-2"}><ICONS.Sparkles /></NavLink>
        </nav>

        <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 dark:text-slate-500"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
            
            <NavLink to="/notifications" className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors relative hidden sm:block">
              <ICONS.Heart />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></div>
            </NavLink>
            
            <div className="group relative">
                <img src={user?.avatar || "https://picsum.photos/id/64/100/100"} className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 cursor-pointer object-cover" alt="Avatar" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[70]">
                  <button onClick={() => navigate(`/profile/${user?._id || user?.id || 'me'}`)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5">Profile</button>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 font-bold">Log Out</button>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-0 md:px-4 md:py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-slate-100 dark:border-white/5 flex justify-around items-center py-3 z-[60] shadow-xl">
        <NavLink to="/" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500"}><ICONS.Home /></NavLink>
        <NavLink to="/explore" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500"}><ICONS.Search /></NavLink>
        <button onClick={() => setShowCreateModal(true)} className="text-slate-400 dark:text-slate-500"><ICONS.Plus /></button>
        <NavLink to="/reels" className={({isActive}) => isActive ? "text-saffron" : "text-slate-400 dark:text-slate-500"}><ICONS.Reels /></NavLink>
        <NavLink to="/profile/me" className={({isActive}) => isActive ? "border-saffron" : "border-transparent"}>
            <img src={user?.avatar || "https://picsum.photos/id/64/100/100"} className="w-6 h-6 rounded-full border-2 object-cover" alt="p" />
        </NavLink>
      </nav>

      {showCreateModal && (
        <CreatePostModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={() => { window.location.reload(); }} 
        />
      )}
    </div>
  );
};

export default Layout;
