import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { ICONS, COLORS } from '../constants';
import { ChatService } from '../services/apiService';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleStartChat = async () => {
    try {
      // In Demo Mode we just navigate, in real mode we hit API
      if (localStorage.getItem('bharatgram_token') === 'demo_token_xyz') {
        navigate('/messages', { state: { initialChatWith: post.username } });
        return;
      }
      const { data } = await ChatService.initiateChat(post.userId);
      navigate('/messages', { state: { activeChatId: data._id } });
    } catch (err) {
      // Fallback for demo
      navigate('/messages');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 md:rounded-xl border border-slate-200 dark:border-white/5 mb-4 overflow-hidden shadow-sm transition-all hover:shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-saffron p-0.5">
            <img src={post.userAvatar} className="w-full h-full rounded-full object-cover" alt={post.username} />
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight dark:text-white">{post.username}</h4>
            {post.location && <p className="text-[10px] text-slate-500 dark:text-slate-400">{post.location}</p>}
          </div>
        </div>
        <button className="text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>

      {/* Post Image/Video */}
      <div className="aspect-square bg-slate-100 dark:bg-zinc-800 relative group overflow-hidden">
        <img 
          src={post.imageUrl} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
          alt="Post Content" 
          onDoubleClick={handleLike}
        />
        {isLiked && (
          <div className="absolute inset-0 flex items-center justify-center animate-ping pointer-events-none opacity-0">
             <ICONS.Heart className="text-white w-24 h-24 fill-white" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={handleLike} className="transition-transform active:scale-125">
            <ICONS.Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-700 dark:text-slate-300'}`} />
          </button>
          <button onClick={handleStartChat} className="transition-transform hover:scale-110 active:scale-95">
            <ICONS.Chat className="w-7 h-7 text-slate-700 dark:text-slate-300 hover:text-orange-500" />
          </button>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-300"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
          <div className="flex-1" />
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-300"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>
        </div>

        <p className="font-bold text-sm mb-1 dark:text-white">{likesCount.toLocaleString()} likes</p>
        <p className="text-sm dark:text-slate-200">
          <span className="font-bold mr-2">{post.username}</span>
          {post.caption}
        </p>
        <button className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">View all {post.comments} comments</button>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mt-2">{post.timestamp}</p>
      </div>
    </div>
  );
};

export default PostCard;
