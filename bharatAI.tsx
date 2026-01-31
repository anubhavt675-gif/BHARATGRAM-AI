import React, { useState } from 'react';
import { chatWithBharatAI } from '../services/geminiService';
import { ICONS, COLORS } from '../constants';

const BharatAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste! Main Bharat AI hoon. How can I help you today? Kahiye, kya haal-chaal hain? 🇮🇳' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await chatWithBharatAI(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-[600px] mx-auto h-[calc(100vh-140px)] md:h-[750px] flex flex-col bg-white md:rounded-[2rem] shadow-2xl overflow-hidden border border-orange-100">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-white/20">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="./logo.png" alt="B" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight leading-none">Bharat AI</h2>
            <p className="text-[10px] text-orange-100 font-bold uppercase tracking-widest mt-1">Intelligent Assistant</p>
          </div>
        </div>
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
           <ICONS.Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-orange-50/20 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[1.75rem] shadow-sm text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-orange-500 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-orange-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-orange-100 p-5 rounded-[1.75rem] rounded-tl-none flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              <span className="text-[10px] font-black text-orange-300 ml-2 uppercase tracking-widest">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-orange-100 flex gap-3 items-center">
        <input 
          type="text" 
          placeholder="Ask me anything in Hinglish..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-[1.25rem] px-6 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-100 transition-all shadow-inner"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-orange-500 text-white p-4 rounded-[1.25rem] shadow-xl shadow-orange-200/50 active:scale-95 disabled:opacity-50 transition-all hover:brightness-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BharatAI;
