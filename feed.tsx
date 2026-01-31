
import React, { useEffect, useState } from 'react';
import StoryCircle from '../components/StoryCircle';
import PostCard from '../components/PostCard';
import { Post as PostType } from '../types';
import { PostService } from '../services/apiService';
import { generateDesiCaption } from '../services/geminiService';
import { ICONS } from '../constants';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [aiCaption, setAiCaption] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await PostService.getFeed();
        // Fix: Added missing userId property to mapping logic to satisfy Post interface
        const mappedPosts = data.map((p: any) => ({
          id: p._id,
          userId: p.user?._id || p.user?.id || 'unknown',
          username: p.user.username,
          userAvatar: p.user.avatar,
          imageUrl: p.mediaUrl,
          caption: p.caption,
          likes: p.likes.length,
          comments: p.comments.length,
          location: p.location,
          timestamp: new Date(p.createdAt).toLocaleDateString(),
          type: p.mediaType
        }));
        setPosts(mappedPosts);
      } catch (err) {
        // Fallback for demo
        // Fix: Added missing userId property to fallback Post objects to satisfy Post interface
        setPosts([
           { id: '1', userId: 'u1', username: 'virat.kohli', userAvatar: 'https://picsum.photos/id/101/100/100', imageUrl: 'https://picsum.photos/id/101/800/800', caption: 'Back in action! 🏏 #TeamIndia', likes: 1240000, comments: 24500, timestamp: '2 hours ago', type: 'image' },
           { id: '2', userId: 'u2', username: 'isro.official', userAvatar: 'https://picsum.photos/id/106/100/100', imageUrl: 'https://picsum.photos/id/106/800/800', caption: 'Mission success! 🚀🚀', likes: 89000, comments: 1200, timestamp: '5 hours ago', type: 'image' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMagicCaption = async () => {
    setIsGenerating(true);
    const result = await generateDesiCaption("Celebrating Diwali with my family");
    setAiCaption(result.caption);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-[600px] mx-auto pb-10">
      {/* AI Assistant Banner */}
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-green-50 dark:from-zinc-900 dark:to-zinc-900 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
            <ICONS.Sparkles className="text-saffron" />
          </div>
          <div>
            <h5 className="font-bold text-sm dark:text-white">Bharat AI Assistant</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Generate Desi captions in a click!</p>
          </div>
        </div>
        <button 
          onClick={handleMagicCaption}
          disabled={isGenerating}
          className="bg-saffron text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 disabled:opacity-50 transition-all"
        >
          {isGenerating ? 'GENIE WORKING...' : 'MAGIC CAPTION'}
        </button>
      </div>

      {aiCaption && (
        <div className="mx-4 mb-4 p-3 bg-white dark:bg-zinc-900 rounded-xl border-2 border-orange-100 dark:border-orange-900/30 animate-in fade-in slide-in-from-top-4">
          <p className="text-xs italic text-slate-600 dark:text-slate-300">" {aiCaption} "</p>
        </div>
      )}

      {/* Stories */}
      <div className="bg-white dark:bg-black border-b md:border md:rounded-xl border-slate-200 dark:border-white/5 p-4 mb-4 flex gap-4 overflow-x-auto no-scrollbar shadow-sm">
        <StoryCircle user={{ username: 'You', avatar: 'https://picsum.photos/id/64/100/100', isMe: true }} />
        <StoryCircle user={{ username: 'virat.kohli', avatar: 'https://picsum.photos/id/101/100/100', hasStory: true }} />
        <StoryCircle user={{ username: 'aliaabhatt', avatar: 'https://picsum.photos/id/102/100/100', hasStory: true }} />
        <StoryCircle user={{ username: 'isro.official', avatar: 'https://picsum.photos/id/106/100/100', hasStory: true }} />
        <StoryCircle user={{ username: 'modi_ji', avatar: 'https://picsum.photos/id/108/100/100', hasStory: true }} />
      </div>

      {/* Posts */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
