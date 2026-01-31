import React from 'react';
import { ICONS, COLORS } from '../constants';

const REELS = [
  { id: 1, videoUrl: 'https://picsum.photos/id/237/1080/1920', user: 'foodie_delhi', caption: 'Best Chole Bhature in Old Delhi! 🥘 #Foodie #Delhi', likes: '230K' },
  { id: 2, videoUrl: 'https://picsum.photos/id/238/1080/1920', user: 'dance_with_desi', caption: 'Classical fusion choreography 💃 #BharatgramReels', likes: '45K' },
  { id: 3, videoUrl: 'https://picsum.photos/id/239/1080/1920', user: 'tech_bharat', caption: 'New smartphone launch in India! 📱', likes: '12K' },
];

const Reels: React.FC = () => {
  return (
    <div className="h-[calc(100vh-120px)] md:h-[800px] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black md:rounded-3xl shadow-2xl">
      {REELS.map(reel => (
        <div key={reel.id} className="h-full w-full snap-start relative flex flex-col justify-end p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          <img src={reel.videoUrl} className="absolute inset-0 w-full h-full object-cover" alt="Reel placeholder" />
          
          <div className="z-20 text-white flex justify-between items-end">
            <div className="flex-1 pr-12">
              <div className="flex items-center gap-3 mb-4">
                <img src={`https://picsum.photos/id/${reel.id + 50}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar" />
                <span className="font-bold">@{reel.user}</span>
                <button className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Follow</button>
              </div>
              <p className="text-sm mb-4 line-clamp-2">{reel.caption}</p>
              <div className="flex items-center gap-2 text-xs bg-white/10 w-max p-1 px-3 rounded-full backdrop-blur-md mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span>Original Audio • {reel.user}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pb-2">
              <button className="flex flex-col items-center gap-1">
                <ICONS.Heart className="w-8 h-8" />
                <span className="text-[10px] font-bold">{reel.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <ICONS.Chat className="w-8 h-8" />
                <span className="text-[10px] font-bold">1.2K</span>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
              <button className="w-8 h-8 rounded-md border-2 border-white overflow-hidden p-0.5">
                 <img src={`https://picsum.photos/id/${reel.id + 10}/100/100`} className="w-full h-full object-cover" alt="disk" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels;
