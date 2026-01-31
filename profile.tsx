import React from 'react';
import { ICONS, COLORS } from '../constants';

const Profile: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto pb-10">
      {/* Profile Header */}
      <div className="px-4 py-8 md:flex gap-12 items-start bg-white md:rounded-2xl border-b md:border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-center mb-6 md:mb-0">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-orange-400 via-white to-green-400">
            <div className="bg-white p-1 rounded-full overflow-hidden w-full h-full">
                <img src="https://picsum.photos/id/64/400/400" className="w-full h-full object-cover rounded-full" alt="Profile" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                bharat_traveler_01
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0095f6" stroke="white" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </h2>
            <div className="flex gap-2">
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">Edit Profile</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">View Archive</button>
              <button className="p-2 bg-slate-100 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>
            </div>
          </div>

          <div className="flex gap-8 mb-6 border-y md:border-none py-3 md:py-0 justify-around md:justify-start">
            <div className="text-center md:text-left"><span className="font-bold">124</span> <span className="text-slate-500 text-sm">posts</span></div>
            <div className="text-center md:text-left"><span className="font-bold">12.5K</span> <span className="text-slate-500 text-sm">followers</span></div>
            <div className="text-center md:text-left"><span className="font-bold">840</span> <span className="text-slate-500 text-sm">following</span></div>
          </div>

          <div className="text-sm">
            <p className="font-bold">Rahul Verma</p>
            <p className="text-slate-600">🇮🇳 Exploring India, one village at a time.</p>
            <p className="text-slate-600">Photography | Culture | Food</p>
            <a href="#" className="text-navy-900 font-bold mt-1 inline-block" style={{ color: COLORS.NAVY }}>linktr.ee/rahulverma</a>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 mb-8">
        {['Kashmir', 'Kerala', 'Rajasthan', 'Hampi', 'Add New'].map((tag, i) => (
          <div key={tag} className="flex flex-col items-center gap-2 min-w-[72px]">
            <div className="w-16 h-16 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                <div className="bg-slate-100 rounded-full w-full h-full flex items-center justify-center overflow-hidden text-slate-400">
                    {tag === 'Add New' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    ) : (
                        <img src={`https://picsum.photos/id/${i + 70}/100/100`} className="w-full h-full object-cover" alt={tag} />
                    )}
                </div>
            </div>
            <span className="text-[10px] font-medium text-slate-600">{tag}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-slate-200">
        <div className="flex justify-center gap-12 -mt-[1px]">
          <button className="flex items-center gap-2 py-4 border-t-2 border-slate-900 text-xs font-bold uppercase tracking-widest"><ICONS.Home className="w-4 h-4" /> Posts</button>
          <button className="flex items-center gap-2 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest"><ICONS.Reels className="w-4 h-4" /> Reels</button>
          <button className="flex items-center gap-2 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Tagged</button>
        </div>

        <div className="grid grid-cols-3 gap-1 md:gap-4 mt-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 md:rounded-lg overflow-hidden relative group">
                <img src={`https://picsum.photos/id/${i + 120}/600/600`} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt="post" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
