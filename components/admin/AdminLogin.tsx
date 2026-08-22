
import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className={`w-full max-w-md bg-white border-8 ${error ? 'border-[#FF5F1F]' : 'border-black'} p-12 transition-colors duration-200`}>
        <h2 className="font-heading font-black text-5xl mb-12 uppercase leading-none tracking-tighter">
          ACCESS<br />RESTRICTED
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">ENCRYPTION KEY</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-b-4 border-black p-4 text-2xl font-black focus:outline-none focus:border-[#FF5F1F] placeholder:opacity-20"
            />
          </div>
          {error && <p className="text-[#FF5F1F] font-black uppercase text-sm animate-pulse">INVALID CREDENTIALS. SYSTEM LOCKDOWN IMMINENT.</p>}
          <button 
            type="submit"
            className="w-full bg-black text-white py-6 text-xl font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors"
          >
            DECRYPT
          </button>
        </form>
        <p className="mt-8 text-[10px] font-black uppercase opacity-40 text-center tracking-widest">AUTHORIZED PERSONNEL ONLY - HINT: admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;
