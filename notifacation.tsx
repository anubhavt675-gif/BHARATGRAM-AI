import React, { useEffect, useState } from 'react';
import { NotificationController } from '../services/apiService';
import { ICONS, COLORS } from '../constants';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock for now if backend not ready, but wired to controller
    const fetchNotifs = async () => {
      try {
        // Replace with real API call
        setNotifications([
          { id: '1', type: 'like', sender: { username: 'virat.kohli', avatar: 'https://picsum.photos/id/101/100/100' }, createdAt: new Date(), post: { mediaUrl: 'https://picsum.photos/id/120/100/100' } },
          { id: '2', type: 'follow', sender: { username: 'aliaabhatt', avatar: 'https://picsum.photos/id/102/100/100' }, createdAt: new Date() },
          { id: '3', type: 'comment', sender: { username: 'isro.official', avatar: 'https://picsum.photos/id/106/100/100' }, text: 'Jai Hind! 🇮🇳🚀', createdAt: new Date(), post: { mediaUrl: 'https://picsum.photos/id/121/100/100' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  return (
    <div className="max-w-[600px] mx-auto bg-white min-h-[calc(100vh-140px)] md:rounded-2xl border border-slate-100 shadow-sm">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-xl font-bold">Activity</h2>
        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Mark All as Read</span>
      </div>

      <div className="flex flex-col">
        {notifications.map(n => (
          <div key={n.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50/50">
            <img src={n.sender.avatar} className="w-12 h-12 rounded-full border border-slate-200" alt="" />
            <div className="flex-1 text-sm">
              <span className="font-bold">{n.sender.username}</span>
              <span className="text-slate-600 ml-1">
                {n.type === 'like' && 'liked your post.'}
                {n.type === 'follow' && 'started following you.'}
                {n.type === 'comment' && `commented: "${n.text}"`}
              </span>
              <p className="text-[10px] text-slate-400 uppercase mt-1">2 hours ago</p>
            </div>
            {n.post && (
              <img src={n.post.mediaUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
            )}
            {n.type === 'follow' && (
              <button className="bg-[#FF9933] text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-sm">FOLLOW</button>
            )}
          </div>
        ))}

        {!loading && notifications.length === 0 && (
          <div className="p-20 text-center opacity-30">
            <ICONS.Heart className="w-16 h-16 mx-auto mb-4" />
            <p className="font-medium italic">No activity yet. Share more of Bharat!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
