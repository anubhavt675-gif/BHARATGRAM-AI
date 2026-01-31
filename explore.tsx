: React.FC = () => {
  return (
    <div className="px-4 pb-10">
      {/* Search Bar */}
      <div className="mb-4 sticky top-16 z-30 bg-slate-50 py-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Bharatgram..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-12 shadow-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {CATEGORIES.map(cat => (
          <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium hover:border-orange-300 hover:text-orange-600 transition-all shadow-sm">
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {[...Array(24)].map((_, i) => (
          <div key={i} className={`relative group cursor-pointer overflow-hidden ${i % 7 === 0 ? 'col-span-2 row-span-2' : ''} aspect-square bg-slate-200 md:rounded-xl`}>
            <img 
              src={`https://picsum.photos/id/${i + 40}/800/800`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              alt="Explore content" 
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                <span className="flex items-center gap-1"><ICONS.Heart className="w-5 h-5 fill-white" /> {Math.floor(Math.random() * 1000)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Internal Import helper
import { ICONS } from '../constants';

export default Explore;
