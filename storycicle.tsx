import React from 'react';

interface StoryCircleProps {
  user: {
    username: string;
    avatar: string;
    hasStory?: boolean;
    isMe?: boolean;
  };
}

const StoryCircle: React.FC<StoryCircleProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer group">
      <div className={`p-0.5 rounded-full ${user.hasStory ? 'bg-gradient-to-tr from-[#FF9933] to-[#138808]' : 'bg-slate-200'}`}>
        <div className="bg-white p-0.5 rounded-full overflow-hidden">
          <img 
            src={user.avatar} 
            className="w-14 h-14 rounded-full object-cover group-hover:scale-110 transition-transform" 
            alt={user.username} 
          />
        </div>
      </div>
      <span className="text-[10px] font-medium text-slate-600 truncate max-w-[64px]">
        {user.isMe ? 'Your Story' : user.username}
      </span>
      {user.isMe && (
        <div className="absolute top-10 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
        </div>
      )}
    </div>
  );
};

export default StoryCircle;
