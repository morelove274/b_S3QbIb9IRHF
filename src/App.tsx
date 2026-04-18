/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudyCenter from './pages/StudyCenter';
import AISpeaking from './pages/study/AISpeaking';
import MockExam from './pages/study/MockExam';
import Vocabulary from './pages/study/Vocabulary';
import WritingPractice from './pages/study/WritingPractice';
import MovieGallery from './pages/MovieGallery';
import Stats from './pages/Stats';
import { UserProvider, useUser } from './context/UserContext';
import { StudyProvider } from './contexts/StudyContext';

import React, { useState, useRef } from 'react';
import { Camera, Mail, User, Hash, Calendar, Save, CheckCircle2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function Profile() {
  const { profile, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile(tempProfile);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface">个人主页</h1>
          <p className="text-on-surface-variant mt-2">管理您的个人信息与账户设置</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => {
              setTempProfile(profile);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold rounded-xl transition-all border border-outline-variant/20"
          >
            <Edit2 className="w-4 h-4" /> 编辑资料
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 bg-surface-container-low text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-all"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:scale-105 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" /> 保存修改
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-primary/5 transition-all group-hover:ring-primary/10">
                <img
                  alt="用户头像"
                  className="w-full h-full object-cover"
                  src={isEditing ? tempProfile.avatar : profile.avatar}
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-black font-headline text-on-surface">{isEditing ? tempProfile.name : profile.name}</h2>
              <p className="text-sm font-bold text-primary bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block">
                雅思目标 8.5 分
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-[2rem] text-white shadow-xl">
            <h3 className="font-bold mb-2">备考状态</h3>
            <p className="text-xs opacity-80 leading-relaxed">
              您已连续打卡 12 天，继续保持！
            </p>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[68%]"></div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8">
            <h3 className="text-xl font-black font-headline flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> 基本信息
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">昵称</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? tempProfile.name : profile.name}
                    onChange={e => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">邮箱地址</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email"
                    disabled={!isEditing}
                    value={isEditing ? tempProfile.email : profile.email}
                    onChange={e => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">学号</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? tempProfile.studentId : profile.studentId}
                    onChange={e => setTempProfile(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">加入时间</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? tempProfile.joinDate : profile.joinDate}
                    onChange={e => setTempProfile(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/10">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">账户安全提示</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    为了保障您的学习数据安全，建议定期更新密码并绑定手机号。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold">个人资料已成功保存！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useUser();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="study-center" element={<StudyCenter />} />
          <Route path="study/speaking" element={<AISpeaking />} />
          <Route path="study/mock" element={<MockExam />} />
          <Route path="study/vocab" element={<Vocabulary />} />
          <Route path="study/writing" element={<WritingPractice />} />
          <Route path="gallery" element={<MovieGallery />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <StudyProvider>
        <AppRoutes />
      </StudyProvider>
    </UserProvider>
  );
}
