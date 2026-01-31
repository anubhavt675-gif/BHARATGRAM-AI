import React, { useState } from 'react';
import { PostService } from '../services/apiService';
import { generateDesiCaption, checkContentSafety } from '../services/geminiService';
import { ICONS, COLORS } from '../constants';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSuccess }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'reel'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [safetyError, setSafetyError] = useState<string | null>(null);

  const handleMagicCaption = async () => {
    if (!mediaUrl) return alert("Arre, upload something first!");
    setIsGenerating(true);
    const result = await generateDesiCaption(caption || "A beautiful day in Bharat");
    setCaption(result.caption + "\n\n" + result.hashtags.join(' '));
    setIsGenerating(false);
    setSafetyError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;
    
    setIsSubmitting(true);
    setSafetyError(null);

    try {
      // Step 1: Bharat AI Safety Pre-check
      const safety = await checkContentSafety(caption);
      
      if (!safety.isSafe) {
        setSafetyError(safety.reason || "Arre yaar, this content doesn't follow our community guidelines. Thoda positive vibes rakho!");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Proceed with post creation if safe
      await PostService.createPost({ mediaUrl, mediaType, caption, location });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error creating post. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[700px]">
        {/* Left: Preview */}
        <div className="flex-1 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center relative min-h-[250px] md:min-h-[400px]">
          {mediaUrl ? (
            mediaType === 'image' ? (
              <img src={mediaUrl} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                 <ICONS.Reels className="w-12 h-12 text-white animate-pulse" />
              </div>
            )
          ) : (
            <div className="text-center p-6 text-slate-400">
              <ICONS.Plus className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">Select Media</p>
            </div>
          )}
          <input 
            type="text" 
            placeholder="Paste Image/Video URL..." 
            className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 py-2 rounded-xl text-xs outline-none border border-slate-200 dark:border-white/10 dark:text-white"
            value={mediaUrl}
            onChange={(e) => {
              setMediaUrl(e.target.value);
              setSafetyError(null);
            }}
          />
        </div>

        {/* Right: Info */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg dark:text-white">New Post</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
            {safetyError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl animate-in slide-in-from-top-2">
                <div className="flex gap-2 items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Safety Warning</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 italic">"{safetyError}"</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 block">Caption</label>
              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 dark:text-white min-h-[100px] resize-none"
                  placeholder="What's happening in Bharat?"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    setSafetyError(null);
                  }}
                />
                <button 
                  type="button"
                  onClick={handleMagicCaption}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 bg-gradient-to-tr from-orange-400 to-orange-600 text-white p-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                  title="Generate AI Caption"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ICONS.Sparkles className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 block">Media Type</label>
              <div className="flex gap-2">
                {['image', 'reel'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMediaType(type as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${mediaType === type ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 block">Location</label>
              <input 
                type="text" 
                placeholder="Delhi, Mumbai, Kashmir..." 
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 dark:text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !mediaUrl}
              className={`w-full py-4 mt-6 bg-[#FF9933] text-white font-black rounded-2xl shadow-xl shadow-orange-200 dark:shadow-none active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 overflow-hidden relative`}
            >
              <span className={isSubmitting ? 'translate-x-[-10px]' : ''}>
                {isSubmitting ? 'AI SCANNING...' : 'SHARE POST'}
              </span>
              {isSubmitting && (
                <div className="absolute right-4">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
