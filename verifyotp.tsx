import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/apiService';
import { COLORS } from '../constants';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) navigate('/login');
    
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, userId]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return setError('Please enter full OTP');

    setError('');
    setLoading(true);
    try {
      const { data } = await AuthService.verifyOtp({ userId, otp: otpValue });
      localStorage.setItem('bharatgram_token', data.token);
      localStorage.setItem('bharatgram_user', JSON.stringify(data.user));
      window.location.href = '/'; // Refresh to init app
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await AuthService.resendOtp({ userId });
      setTimer(60);
      setError('');
    } catch (err: any) {
      setError('Failed to resend OTP.');
    }
  };

  return (
    <div className="auth-desi-bg flex items-center justify-center px-4">
      <div className="relative z-10 max-w-md w-full bg-white p-10 py-12 rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-white/40 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-1" style={{ color: COLORS.SAFFRON }}>
            BharatGram
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Secure your connection</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-16 bg-slate-100/60 border-2 border-transparent rounded-2xl text-center text-2xl font-black focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none transition-all"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full text-white font-black text-lg shadow-xl shadow-orange-200/50 transition-all active:scale-[0.98] disabled:opacity-50 hover:brightness-105"
            style={{ 
                background: `linear-gradient(to right, ${COLORS.SAFFRON}, #ffab57)`
            }}
          >
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Didn't receive code?{' '}
            {timer > 0 ? (
              <span className="font-black" style={{ color: COLORS.NAVY }}>{timer}s</span>
            ) : (
              <button 
                onClick={handleResend}
                className="font-black hover:underline" 
                style={{ color: COLORS.SAFFRON }}
              >
                Resend Now
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
