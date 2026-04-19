import React, { useState, useEffect } from 'react';
import { GraduationCap, Eye, ArrowRight, ShieldCheck, Award, TrendingUp, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loginAsGuest, getPassword, rememberUsername, getRememberedUsername, rememberPassword, getRememberedPasswordData, clearRememberedPassword } = useUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotPasswordResult, setForgotPasswordResult] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [autoLoginExpired, setAutoLoginExpired] = useState(false);
  const [showRememberPwdModal, setShowRememberPwdModal] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState<{ username: string; password: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studentId, setStudentId] = useState('');

  // 加载记住的账号和密码
  useEffect(() => {
    const rememberedUsername = getRememberedUsername();
    const rememberedPwdData = getRememberedPasswordData();

    if (rememberedUsername) {
      setUsername(rememberedUsername);
    }

    if (rememberedPwdData) {
      // 检查是否在24小时内
      const EXPIRY_MS = 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - rememberedPwdData.timestamp > EXPIRY_MS;

      if (!isExpired) {
        // 未过期，自动登录模式
        setUsername(rememberedPwdData.username);
        setPassword('');
        setIsAutoLogin(true);
      } else {
        // 已过期，清空密码
        setAutoLoginExpired(true);
        clearRememberedPassword();
      }
    }
  }, [getRememberedUsername, getRememberedPasswordData]);

  const handleLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();

    // 自动登录且未过期
    if (isAutoLogin && !autoLoginExpired && !password) {
      const rememberedPwdData = getRememberedPasswordData();
      if (rememberedPwdData) {
        localStorage.setItem('is_logged_in', 'true');
        localStorage.removeItem('is_guest');
        navigate('/dashboard');
        return;
      }
    }

    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('账号或密码错误');
      return;
    }

    // 记住账号
    rememberUsername(username);

    // 登录成功，弹出记住密码选择
    setPendingLoginData({ username, password });
    setShowRememberPwdModal(true);
  };

  const handleRememberPassword = () => {
    if (pendingLoginData) {
      rememberPassword(pendingLoginData.username, pendingLoginData.password);
      setIsAutoLogin(true);
      setAutoLoginExpired(false);
    }
    setShowRememberPwdModal(false);
    setPendingLoginData(null);
    navigate('/dashboard');
  };

  const handleSkipRememberPassword = () => {
    setShowRememberPwdModal(false);
    setPendingLoginData(null);
    navigate('/dashboard');
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    if (password.length < 6) {
      setError('密码长度不少于6位');
      return;
    }

    const result = register(username, password);
    if (!result.success) {
      setError('该账号已被注册，请换个账号试试');
      return;
    }

    // 注册成功，显示学号
    setStudentId(result.studentId || '');
    setShowSuccessModal(true);
  };

  const handleForgotPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotUsername) {
      setForgotPasswordResult('请输入账号');
      return;
    }

    const password = getPassword(forgotUsername);
    if (!password) {
      setForgotPasswordResult('账号不存在');
      return;
    }

    setForgotPasswordResult(`密码：${password}`);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setMode('login');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a469b] overflow-hidden flex items-center justify-center font-sans selection:bg-white/20 selection:text-white">
      {/* Background Animated Waves */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a469b] via-[#1065c7] to-[#0a469b]"></div>
        <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="rgba(255,255,255,0.05)">
            <animate attributeName="d" dur="20s" repeatCount="indefinite" values="M0,50 Q25,30 50,50 T100,50 V100 H0 Z; M0,50 Q25,70 50,50 T100,50 V100 H0 Z; M0,50 Q25,30 50,50 T100,50 V100 H0 Z" />
          </path>
        </svg>
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-white opacity-[0.03] rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:max-w-7xl lg:mx-auto lg:px-6 lg:py-12 flex items-center justify-center">
        {/* 电脑端：左右分栏布局 | 平板/手机端：单列居中 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full max-w-lg lg:max-w-none">

          {/* Left: Login/Register Card */}
          <motion.div
            id="login-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 w-full"
          >
            <div className="bg-[#3b82f6] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-[#3b82f6] shadow-inner">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">IELTS 智学</h1>
              </div>

              {/* Mode Switch */}
              <div className="flex gap-2 mb-6 sm:mb-8">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all ${
                    mode === 'login'
                      ? 'bg-white text-[#3b82f6] shadow-md'
                      : 'bg-black/10 text-white/60 hover:bg-black/20'
                  }`}
                >
                  登录
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm transition-all ${
                    mode === 'register'
                      ? 'bg-white text-[#3b82f6] shadow-md'
                      : 'bg-black/10 text-white/60 hover:bg-black/20'
                  }`}
                >
                  注册
                </button>
              </div>

              {mode === 'register' && (
                <p className="text-center text-white/70 text-xs sm:text-sm font-medium mb-4 sm:mb-6 -mt-2 sm:-mt-4">
                  加入智学，让每一分努力都有迹可循
                </p>
              )}

              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-6 sm:space-y-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] px-1">账号</label>
                    <input
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/10 border-none rounded-xl sm:rounded-2xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/20 transition-all outline-none text-base"
                      placeholder="请输入账号以找回密码"
                      type="text"
                      value={forgotUsername}
                      onChange={e => setForgotUsername(e.target.value)}
                    />
                  </div>

                  {forgotPasswordResult && (
                    <p className="text-xs sm:text-xs font-bold text-white bg-white/20 py-2 px-4 rounded-xl text-center">{forgotPasswordResult}</p>
                  )}
                </form>
              ) : (
                <form className="space-y-6 sm:space-y-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] px-1">账号凭据</label>
                    <input
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/10 border-none rounded-xl sm:rounded-2xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/20 transition-all outline-none text-base"
                      placeholder="请输入注册账号"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] px-1">安全密码</label>
                    <div className="relative">
                      <input
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/10 border-none rounded-xl sm:rounded-2xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/20 transition-all outline-none text-base"
                        placeholder="请输入您的密码"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        type="button"
                      >
                        <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs sm:text-xs font-bold text-red-100 bg-red-500/30 py-2 px-4 rounded-xl text-center">{error}</p>
                  )}

                  {mode === 'login' && (
                    <div className="flex justify-end px-1">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                      >
                        找回密码
                      </button>
                    </div>
                  )}

                  <button
                    className="w-full py-3 sm:py-5 mt-4 sm:mt-6 bg-white text-[#3b82f6] font-black rounded-xl sm:rounded-2xl shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg group"
                    type="button"
                    onClick={() => mode === 'login' ? handleLogin() : handleRegister(new Event('submit'))}
                  >
                    {isAutoLogin && !autoLoginExpired ? '直接进入学习空间' : mode === 'login' ? '进入学习空间' : '注册账号'}
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right: Content & Cards - 电脑端显示，平板/手机端隐藏 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-7 flex flex-col justify-center gap-8 xl:gap-12"
          >
            <div className="space-y-4 xl:space-y-6">
              <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-sm">开启你的高效备考之路</h2>
              <p className="text-lg xl:text-xl text-white/60 max-w-xl leading-relaxed">打卡、背单词、实时同步学习进度，让每一分钟的努力都清晰可见。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
              {/* Feature 1 */}
              <div
                onClick={() => {
                  setMode('register');
                  setShowForgotPassword(false);
                  const loginForm = document.getElementById('login-form');
                  if (loginForm) {
                    loginForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-[#3b82f6]/40 backdrop-blur-md p-6 xl:p-10 rounded-2xl xl:rounded-[2.5rem] border border-white/5 hover:bg-[#3b82f6]/50 transition-all group cursor-pointer flex flex-col justify-center"
              >
                <div className="mb-4 xl:mb-8 p-2 xl:p-3 bg-white/10 w-fit rounded-xl xl:rounded-xl text-white group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 xl:w-10 xl:h-10" />
                </div>
                <h3 className="text-white font-black text-xl xl:text-2xl mb-1 xl:mb-2">加入雅思智学</h3>
                <p className="text-white/50 text-xs xl:text-sm">支持数据云同步，开启个性化提分</p>
              </div>

              {/* Guest Login */}
              <div
                onClick={() => { loginAsGuest(); navigate('/dashboard'); }}
                className="bg-[#3b82f6]/40 backdrop-blur-md p-6 xl:p-10 rounded-2xl xl:rounded-[2.5rem] border border-white/5 hover:bg-[#3b82f6]/50 transition-all group cursor-pointer flex flex-col justify-center"
              >
                <div className="mb-4 xl:mb-8 p-2 xl:p-3 bg-white/10 w-fit rounded-xl xl:rounded-xl text-white group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 xl:w-10 xl:h-10 -rotate-45" />
                </div>
                <h3 className="text-white font-black text-xl xl:text-2xl mb-1 xl:mb-2">先逛一逛</h3>
                <p className="text-white/50 text-xs xl:text-sm">以访客身份预览 (部分功能受限)</p>
              </div>
            </div>

            {/* Platform Trust */}
            <div className="flex flex-wrap items-center gap-x-8 xl:gap-x-12 gap-y-3 xl:gap-y-4 pt-3 xl:pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5 xl:gap-2 text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-wider xl:tracking-widest">全站 SSL 加密</span>
              </div>
              <div className="flex items-center gap-1.5 xl:gap-2 text-white/40 font-black">
                <Award className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span className="text-[9px] xl:text-[10px] uppercase tracking-wider xl:tracking-widest">学术诚信保障</span>
              </div>
              <div className="flex items-center gap-1.5 xl:gap-2 text-white/40 font-black">
                <TrendingUp className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                <span className="text-[9px] xl:text-[10px] uppercase tracking-wider xl:tracking-widest">大数据精准提分</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Corporate Info Footer */}
      <footer className="absolute bottom-4 sm:bottom-6 lg:bottom-10 w-full flex justify-center pointer-events-none opacity-20">
        <div className="text-[8px] sm:text-[9px] xl:text-[10px] font-black text-white tracking-[0.4em] sm:tracking-[0.5em] xl:tracking-[0.6em] uppercase text-center px-2 sm:px-4">
          IELTS SMART STUDY SYSTEM — OPTIMIZED FOR EXCELLENCE
        </div>
      </footer>

      {/* 记住密码弹窗 */}
      {showRememberPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#3b82f6] p-8 rounded-3xl shadow-2xl border border-white/20 max-w-sm w-full mx-4"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">是否记住密码？</h3>
              <p className="text-white/60 text-sm">下次打开可快速登录，超过24小时需重新输入</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSkipRememberPassword}
                className="flex-1 py-4 bg-black/20 text-white font-black rounded-xl hover:bg-black/30 transition-all"
              >
                不记住
              </button>
              <button
                onClick={handleRememberPassword}
                className="flex-1 py-4 bg-white text-[#3b82f6] font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                记住
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 注册成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#3b82f6] p-8 rounded-3xl shadow-2xl border border-white/20 max-w-sm w-full mx-4"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">注册成功！</h3>
              <p className="text-white/80 text-sm mb-4">你的专属学号已生成：</p>
              <p className="text-2xl font-black text-white mb-6">{studentId}</p>
              <p className="text-white/60 text-sm">请登录开始你的学习之旅吧~</p>
            </div>
            <button
              onClick={handleSuccessModalClose}
              className="w-full py-4 bg-white text-[#3b82f6] font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              确定
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
