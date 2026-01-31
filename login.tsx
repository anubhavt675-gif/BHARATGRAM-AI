import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ emailOrPhone, password });
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.needsVerification) {
        navigate('/verify-otp', { state: { userId: err.response.data.userId } });
      } else {
        setError(err.response?.data?.error || 'Login failed. Note: Backend must be running at localhost:5000');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    guestLogin();
    navigate('/');
  };

  return (
    <div className="auth-dark-bg">
      <div className="relative z-10 max-w-sm w-full mx-4 glass-card p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-700">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
             <div className="relative w-20 h-20 bg-gradient-to-br from-saffron via-white to-green p-[2px] rounded-3xl shadow-[0_20px_40px_-10px_rgba(255,153,51,0.3)] overflow-hidden">
                <div className="w-full h-full bg-black rounded-[1.4rem] flex items-center justify-center overflow-hidden relative">
                    <img src="./logo.png" className="w-full h-full object-cover" alt="Bharatgram" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-white/10 pointer-events-none"></div>
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            BharatGram
          </h1>
          <p className="text-slate-400 text-[10px] mt-1 font-bold tracking-[0.2em] uppercase opacity-60">Connect with Bharat</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <input
              type="text"
              placeholder="Email or phone number"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <button type="button" className="text-[10px] text-saffron hover:underline">Forgot password?</button>
          </div>
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-2xl text-white font-bold text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-110"
              style={{ background: 'linear-gradient(to right, #138808, #2e7d32)' }}
            >
              {loading ? 'Entering Bharat...' : 'Log in'}
            </button>
            
            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all border border-white/10 bg-white/5 active:scale-[0.98] hover:bg-white/10"
            >
              🚀 Try Demo Mode
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-slate-500 text-[10px] font-medium">or continue with</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full py-3 rounded-2xl glass-input flex items-center justify-center gap-3 text-xs font-medium text-slate-300 hover:bg-white/5 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
             Log in with Facebook
          </button>
          <button className="w-full py-3 rounded-2xl glass-input flex items-center justify-center gap-3 text-xs font-medium text-slate-300 hover:bg-white/5 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
             Log in with Google
          </button>
        </div>

        <p className="text-center mt-10 text-xs text-slate-500">
          Don't have an account? <Link to="/signup" className="text-saffron font-bold hover:underline transition-all">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
