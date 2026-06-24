/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Check, MessageSquare, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (phone: string) => void;
  onClose: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onClose
}) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Count down timer for verification code
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleGetCode = () => {
    if (!phone || phone.length !== 11 || !/^\d+$/.test(phone)) {
      setError('请输入正确的11位手机号码');
      return;
    }
    setError('');
    setCountdown(60);
    // Auto-fill code with a random simulated verification code for a highly responsive flow!
    setTimeout(() => {
      setCode('123456');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length !== 11 || !/^\d+$/.test(phone)) {
      setError('请输入正确的11位手机号码');
      return;
    }

    if (!code || code.length < 4) {
      setError('请输入验证码');
      return;
    }

    if (!isAgreementChecked) {
      setError('请勾选并同意《用户协议》与《隐私政策》');
      return;
    }

    // Success login!
    onLoginSuccess(phone);
  };

  return (
    <div className="flex-1 bg-white flex flex-col relative overflow-hidden min-h-screen z-50">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute top-[30%] -left-[10%] w-64 h-64 rounded-full bg-secondary-container/10 blur-3xl"></div>
      </div>

      {/* Header Close button */}
      <header className="relative z-10 flex items-center justify-between h-16 px-4 w-full shrink-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <button className="text-primary font-sans text-xs font-semibold px-2 py-1 rounded hover:bg-primary/5 transition-colors cursor-pointer">
          密码登录
        </button>
      </header>

      {/* Main Form content */}
      <main className="relative z-10 flex-1 flex flex-col px-6 pt-6 pb-12 max-w-md mx-auto w-full">
        {/* Brand details */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-primary/10">
            <GraduationCap className="w-8 h-8 fill-current" />
          </div>
          <h1 className="font-display text-xl font-bold text-slate-800 mb-2">欢迎登录学源汇</h1>
          <p className="font-sans text-xs text-slate-400">探索海量优质教育资源，让学习更高效。</p>
        </div>

        {/* Input Validation Error */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Phone Input with +86 indicator */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="font-sans text-xs font-semibold text-slate-500 border-r border-slate-200 pr-3">+86</span>
            </div>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              maxLength={11}
              placeholder="请输入手机号"
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl pl-16 pr-4 py-3.5 font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Verification code input + timer */}
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <input 
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                placeholder="请输入验证码"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3.5 font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
              />
            </div>
            <button 
              type="button"
              disabled={countdown > 0}
              onClick={handleGetCode}
              className="whitespace-nowrap px-4 bg-slate-100 text-primary hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed font-sans text-xs font-semibold rounded-xl border border-transparent transition-colors cursor-pointer flex items-center justify-center min-w-[100px]"
            >
              {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
            </button>
          </div>

          {/* Submit Action Button */}
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white font-display text-sm font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] mt-2 text-center"
          >
            登录 / 注册
          </button>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2.5 mt-2">
            <div className="relative flex items-center pt-0.5 shrink-0">
              <input 
                id="agreement"
                type="checkbox"
                checked={isAgreementChecked}
                onChange={(e) => setIsAgreementChecked(e.target.checked)}
                className="peer w-4.5 h-4.5 appearance-none border border-slate-200 rounded bg-slate-50 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
              />
              <Check className="w-3.5 h-3.5 absolute inset-0 m-auto pointer-events-none opacity-0 peer-checked:opacity-100 text-white font-bold shrink-0" />
            </div>
            <label 
              htmlFor="agreement"
              className="font-sans text-[11px] text-slate-500 leading-relaxed cursor-pointer"
            >
              我已阅读并同意学源汇的 <a href="#" className="text-primary hover:underline">《用户协议》</a>、<a href="#" className="text-primary hover:underline">《隐私政策》</a> 及 <a href="#" className="text-primary hover:underline">《儿童个人信息保护规则》</a>，未注册手机号将自动注册。
            </label>
          </div>
        </form>

        <div className="flex-1"></div>

        {/* WeChat social login footer mockup */}
        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center w-full gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="font-sans text-[11px] text-slate-400 uppercase tracking-wider font-semibold">其他登录方式</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>
          
          <button className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-500 hover:bg-emerald-100/50 hover:border-emerald-200 transition-all cursor-pointer shadow-sm">
            <MessageSquare className="w-5 h-5 fill-current" />
          </button>
        </div>
      </main>
    </div>
  );
};
