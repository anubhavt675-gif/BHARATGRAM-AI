import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/apiService';
import { COLORS } from '../constants';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await AuthService.signup(formData);
      navigate('/verify-otp', { state: { userId: data.userId } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-dark-bg">
      <div className="relative z-10 max-w-sm w-full mx-4 glass-card p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Sign up</h1>
          <p className="text-slate-400 text-[10px] mt-1 font-medium tracking-wide">Create your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 1 7 7c0 2.33-1.03 4.41-2.67 5.82L12 22l-4.33-7.18A7 7 0 0 1 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2"/></svg>
            </div>
            <input
              name="username"
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input outline-none transition-all text-xs text-white focus:border-white/20"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-105"
            style={{ 
                background: `linear-gradient(to right, ${COLORS.SAFFRON}, #ffab57)`
            }}
          >
            {loading ? 'Setting up...' : 'Sign up'}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-6 leading-relaxed">
          By signing up, you agree to our <br/>
          <span className="text-slate-300 font-medium">Terms of Service and Privacy Policy</span>
        </p>

        <div className="mt-8 space-y-3">
          <button className="w-full py-3 rounded-2xl glass-input flex items-center justify-center gap-3 text-xs font-medium text-slate-300 hover:bg-white/5 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
             Sign up with Facebook
          </button>
          <button className="w-full py-3 rounded-2xl glass-input flex items-center justify-center gap-3 text-xs font-medium text-slate-300 hover:bg-white/5 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.13-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
             Sign up with Google
          </button>
        </div>

        <p className="text-center mt-8 text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-green font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
