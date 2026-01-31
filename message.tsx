
import React, { useState, useEffect, useRef } from 'react';
import { ICONS, COLORS } from '../constants';
import VideoCall from '../components/VideoCall';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socketService';
import { ChatService } from '../services/apiService';
import { useLocation } from 'react-router-dom';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      socketService.connect(user._id || user.id);
      
      const fetchChats = async () => {
        try {
          const { data } = await ChatService.getChats();
          setChats(data);
          
          // Check if navigated from feed
          if (location.state?.activeChatId) {
            const chat = data.find((c: any) => c._id === location.state.activeChatId);
            if (chat) setActiveChat(chat);
          } else if (data.length > 0) {
            setActiveChat(data[0]);
          }
        } catch (err) {
          console.error("Failed to load chats");
        }
      };

      fetchChats();

      socketService.onMessage((data) => {
        if (activeChat && data.chatId === activeChat._id) {
          setChatHistory(prev => [...prev, { _id: data._id, text: data.text, sender: data.senderId, createdAt: data.createdAt }]);
        }
      });

      socketService.onTyping((data) => {
        if (activeChat && data.chatId === activeChat._id) {
          setIsTyping(data.isTyping);
        }
      });

      socketService.onIncomingCall((data) => {
        setIncomingCallData(data);
        setIsIncomingCall(true);
        setIsCalling(true);
      });
    }
  }, [user, activeChat]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeChat) {
        try {
          const { data } = await ChatService.getMessages(activeChat._id);
          setChatHistory(data);
          scrollToBottom();
        } catch (err) {
          console.error("Failed to fetch message history");
        }
      }
    };
    fetchHistory();
  }, [activeChat]);

  useEffect(scrollToBottom, [chatHistory]);

  const handleSend = () => {
    if (!msg.trim() || !user || !activeChat) return;
    
    const recipient = activeChat.participants.find((p: any) => p._id !== user._id && p._id !== user.id);
    
    socketService.sendMessage(activeChat._id, recipient._id, msg, user._id || user.id);
    
    setChatHistory(prev => [...prev, { 
      _id: Date.now().toString(), 
      text: msg, 
      sender: user._id || user.id, 
      createdAt: new Date().toISOString() 
    }]);
    
    setMsg('');
    socketService.emitTyping(activeChat._id, recipient._id, false);
  };

  const handleInputChange = (val: string) => {
    setMsg(val);
    if (activeChat && user) {
      const recipient = activeChat.participants.find((p: any) => p._id !== user._id && p._id !== user.id);
      socketService.emitTyping(activeChat._id, recipient._id, val.length > 0);
    }
  };

  const startCall = () => {
    if (!activeChat) return;
    setIsIncomingCall(false);
    setIsCalling(true);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[700px] bg-white dark:bg-zinc-950 md:rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl relative">
      {/* Calling UI */}
      {isCalling && activeChat && (
        <VideoCall 
          isIncoming={isIncomingCall} 
          remoteName={isIncomingCall ? incomingCallData?.name : activeChat.participants.find((p: any) => p._id !== (user._id || user.id))?.fullName} 
          remoteId={isIncomingCall ? incomingCallData?.from : activeChat.participants.find((p: any) => p._id !== (user._id || user.id))?._id}
          initialOffer={incomingCallData?.offer}
          onClose={() => setIsCalling(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-50 dark:border-white/5 flex flex-col ${activeChat && 'hidden md:flex'}`}>
        <div className="p-6 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
          <h2 className="font-black text-xl tracking-tight dark:text-white">Dost</h2>
          <button className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm">
             <ICONS.Plus className="w-5 h-5 text-orange-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map(chat => {
            const otherUser = chat.participants.find((p: any) => p._id !== (user?._id || user?.id));
            return (
              <div 
                key={chat._id} 
                onClick={() => setActiveChat(chat)}
                className={`p-5 flex items-center gap-4 cursor-pointer transition-all border-b border-slate-50/10 ${activeChat?._id === chat._id ? 'bg-orange-50/50 dark:bg-orange-950/20 border-l-4 border-l-orange-500' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <div className="relative">
                  <img src={otherUser?.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100 dark:border-white/10" alt="" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm truncate dark:text-white">{otherUser?.username}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Just Now</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate italic">"{chat.lastMessage}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat View */}
      <div className={`flex-1 flex flex-col ${!activeChat && 'hidden md:flex'}`}>
        {activeChat ? (
          <>
            <div className="p-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <button onClick={() => setActiveChat(null)} className="md:hidden p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                 </button>
                 <div className="relative">
                    <img 
                      src={activeChat.participants.find((p: any) => p._id !== (user?._id || user?.id))?.avatar} 
                      className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm" alt="" 
                    />
                 </div>
                 <div>
                    <span className="font-black text-sm block leading-none dark:text-white">
                      {activeChat.participants.find((p: any) => p._id !== (user?._id || user?.id))?.fullName}
                    </span>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
                       {isTyping ? 'Typing...' : 'Active Now'}
                    </span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={startCall} className="p-3 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                 </button>
                 <button onClick={startCall} className="p-3 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-black/20 no-scrollbar">
              {chatHistory.map(m => (
                <div key={m._id} className={`flex ${m.sender === (user?._id || user?.id) ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.sender === (user?._id || user?.id) ? 'bg-[#FF9933] text-white rounded-tr-none' : 'bg-white dark:bg-zinc-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-white/5 flex gap-4 items-center">
              <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors">
                <ICONS.Plus className="w-6 h-6" />
              </button>
              <input 
                type="text" 
                placeholder="Namaste! Kahiye kya baat karni hai?..." 
                className="flex-1 bg-slate-100 dark:bg-zinc-900 border-none rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 transition-all dark:text-white"
                value={msg}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!msg.trim()}
                className="bg-gradient-to-tr from-orange-400 to-orange-600 text-white p-4 rounded-2xl shadow-xl shadow-orange-100 dark:shadow-none active:scale-95 disabled:opacity-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-40">
             <div className="w-32 h-32 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <ICONS.Chat className="w-16 h-16 text-slate-400" />
             </div>
             <h3 className="text-xl font-bold mb-2 dark:text-white">Start a Desi Conversation</h3>
             <p className="text-sm max-w-[250px] dark:text-slate-400">Connect with your brothers and sisters across Bharatgram.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
