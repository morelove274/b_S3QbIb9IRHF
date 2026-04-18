import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  Circle,
  Search,
  Mic,
  ClipboardCheck,
  History,
  Trophy,
  Download,
  Flame,
  Award,
  ExternalLink,
  Bot,
  SpellCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useStudy } from '../contexts/StudyContext';
import { VOCAB_DATA, CAMBRIDGE_LIBRARY, WRITING_SAMPLES, SPEAKING_TOPICS } from './study/StudyData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const { state, completeGoal, checkIn } = useStudy();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const firstName = profile.name.split(' ')[0];

  const activityData = [
    { name: 'Mon', hours: 1.5, progress: 10 },
    { name: 'Tue', hours: 2.3, progress: 15 },
    { name: 'Wed', hours: 1.8, progress: 12 },
    { name: 'Thu', hours: 3.0, progress: 20 },
    { name: 'Fri', hours: 2.5, progress: 18 },
    { name: 'Sat', hours: 4.2, progress: 30 },
    { name: 'Sun', hours: 3.5, progress: 25 },
  ];

  const radarData = (state.modules || []).map(m => ({
    subject: m.id === 'listening' ? '听力' : 
             m.id === 'reading' ? '阅读' : 
             m.id === 'writing' ? '写作' : 
             m.id === 'speaking' ? '口语' : 
             m.id === 'vocab' ? '词汇' : '模考',
    A: m.progress || 0,
    fullMark: 100,
  }));

  const searchResults = searchQuery ? [
    ...VOCAB_DATA.filter(v => v.word.toLowerCase().includes(searchQuery.toLowerCase())).map(v => ({ type: '词汇', title: v.word, desc: v.zh })),
    ...CAMBRIDGE_LIBRARY.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ type: '真题', title: c.title, desc: '剑桥雅思真题集' })),
    ...WRITING_SAMPLES.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).map(s => ({ type: '范文', title: s.title, desc: `Band ${s.band}` })),
    ...SPEAKING_TOPICS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ type: '口语', title: t.title, desc: t.part })),
  ].slice(0, 5) : [];

  const handleExportReport = () => {
    const report = {
      user: profile.name,
      studyDays: state.studyDays,
      overallProgress: state.overallProgress,
      masteredWords: state.masteredWords,
      mockAverage: state.mockAverage,
      date: new Date().toLocaleDateString()
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IELTS_Study_Report_${profile.name}.json`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface mb-2">
            早安，{firstName}！
          </h1>
          <p className="text-on-surface-variant font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 今天是你的备考第 {state.studyDays} 天，保持专注。
          </p>
        </motion.div>

        <div className="relative w-full md:w-96">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="搜索真题/词汇/范文/口语素材..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <AnimatePresence>
            {showSearchResults && searchQuery && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSearchResults(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 z-20 overflow-hidden"
                >
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-outline-variant/10">
                      {searchResults.map((result, i) => (
                        <button key={i} className="w-full px-6 py-4 text-left hover:bg-surface-container-low transition-colors flex items-center justify-between group">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">{result.type}</span>
                            <p className="font-bold text-on-surface">{result.title}</p>
                            <p className="text-xs text-on-surface-variant">{result.desc}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-on-surface-variant text-sm italic">
                      未找到相关资源
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Access Area */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Bot, label: 'AI 口语教练', color: 'bg-blue-50 text-blue-600', link: '/study/speaking' },
          { icon: ClipboardCheck, label: '真题模考', color: 'bg-purple-50 text-purple-600', link: '/study/mock' },
          { icon: SpellCheck, label: '单词背诵', color: 'bg-amber-50 text-amber-600', link: '/study/vocab' },
          { icon: FileText, label: '写作练笔', color: 'bg-green-50 text-green-600', link: '/study/writing' },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -4 }}
            onClick={() => navigate(item.link)}
            className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all group"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className="w-7 h-7" />
            </div>
            <span className="font-black text-sm text-on-surface">{item.label}</span>
          </motion.button>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Stats & Trends */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Main Progress Card */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-black font-headline mb-2">整体备考进度</h2>
                  <p className="text-on-surface-variant text-sm font-bold">目标分数: 8.0 · 预计达成时间: 6月15日</p>
                </div>
                <button 
                  onClick={handleExportReport}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-full transition-colors"
                >
                  <Download className="w-4 h-4" /> 导出学习报告
                </button>
              </div>

              <div className="flex items-end gap-6 mb-8">
                <span className="text-7xl font-black font-headline tracking-tighter text-primary">{state.overallProgress}%</span>
                <div className="pb-3">
                  <span className="text-green-600 font-bold flex items-center gap-1 text-sm bg-green-50 px-3 py-1 rounded-full">
                    <ArrowUpRight className="w-4 h-4" /> 本周 {state.overallProgress > 0 ? `+${Math.round(state.overallProgress / 2)}%` : '开始起航'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-surface-container-high h-4 rounded-full mb-10 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${state.overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-primary h-full rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                ></motion.div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">听力</p>
                  <p className="text-xl font-black">{state.modules?.find(m => m.id === 'listening')?.progress ? (4 + (state.modules.find(m => m.id === 'listening')!.progress / 20)).toFixed(1) : '0.0'}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">阅读</p>
                  <p className="text-xl font-black">{state.modules?.find(m => m.id === 'reading')?.progress ? (4 + (state.modules.find(m => m.id === 'reading')!.progress / 20)).toFixed(1) : '0.0'}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">写作</p>
                  <p className="text-xl font-black">{state.modules?.find(m => m.id === 'writing')?.progress ? (4 + (state.modules.find(m => m.id === 'writing')!.progress / 20)).toFixed(1) : '0.0'}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-2xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">口语</p>
                  <p className="text-xl font-black">{state.modules?.find(m => m.id === 'speaking')?.progress ? (4 + (state.modules.find(m => m.id === 'speaking')!.progress / 20)).toFixed(1) : '0.0'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
              <h3 className="text-lg font-black font-headline mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> 近7天学习趋势
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 800 }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
              <h3 className="text-lg font-black font-headline mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> 能力模型分布
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.05)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700 }} />
                    <Radar name="进度" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Score Curve */}
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
            <h3 className="text-lg font-black font-headline mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" /> 历次模考提分曲线
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={state.mockScores || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[0, 9]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={4} dot={{ r: 6, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Side Cards */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Streak & Check-in */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span className="font-black text-xl">连续打卡 {state.streak} 天</span>
                </div>
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <p className="text-blue-100 text-sm mb-8 font-medium">自律即自由，目标就在眼前。保持专注，你将在这个月看到质的飞跃。</p>
              <button 
                onClick={checkIn}
                className="w-full py-4 bg-white text-primary rounded-2xl font-black shadow-lg hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                立即打卡签到
              </button>
            </div>
          </div>

          {/* Quick Links: Wrong Questions & Vocab */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">错题本</p>
              <p className="text-2xl font-black">{state.wrongQuestionsCount}</p>
            </button>
            <button className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">生词本</p>
              <p className="text-2xl font-black">{state.newVocabCount}</p>
            </button>
          </div>

          {/* Badges System */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-black font-headline mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" /> 学习成就
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {(state.badges || []).map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${
                    badge.unlocked 
                    ? 'bg-surface-container-low border-primary/20' 
                    : 'bg-surface-container-lowest border-outline-variant/10 opacity-40 grayscale'
                  }`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Goals Side Card */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black font-headline flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" /> 今日任务
              </h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {(state.dailyGoals || []).filter(g => g.completed).length}/{(state.dailyGoals || []).length}
              </span>
            </div>

            <div className="space-y-4">
              {(state.dailyGoals || []).map((goal) => (
                <button 
                  key={goal.id}
                  onClick={() => !goal.completed && completeGoal(goal.id)}
                  disabled={goal.completed}
                  className={`w-full p-5 rounded-2xl border transition-all text-left flex items-start gap-4 ${
                    goal.completed 
                    ? 'bg-green-50 border-green-100 opacity-60' 
                    : 'bg-surface-container-low border-outline-variant/5 hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <div className={`mt-1 ${goal.completed ? 'text-green-600' : 'text-slate-300'}`}>
                    {goal.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm mb-1 ${goal.completed ? 'line-through text-green-800' : 'text-on-surface'}`}>
                      {goal.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
