import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  Zap,
  BookOpen,
  Headphones,
  Edit,
  Mic,
  Clock,
  ChevronRight,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStudy } from '../contexts/StudyContext';

export default function Stats() {
  const { state } = useStudy();

  const stats = [
    { label: '累计学习天数', value: state.studyDays, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '已掌握词汇', value: state.masteredWords, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { label: '模考平均分', value: state.mockAverage, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '本周活跃度', value: '92%', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const maxActivity = Math.max(...state.weeklyActivity, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight text-on-surface mb-2">学习统计</h1>
          <p className="text-on-surface-variant font-medium">数据驱动进步，见证你的每一分成长。</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
          <Download className="w-4 h-4" /> 下载分析报告
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-on-surface">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Activity Chart */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black font-headline flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" /> 本周学习时长 (min)
              </h3>
              <div className="flex gap-2">
                {['周', '月', '年'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${t === '周' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between h-64 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${((state.weeklyActivity?.[i] || 0) / maxActivity) * 100}%` }}
                      className="w-full bg-primary/20 rounded-t-xl group-hover:bg-primary/40 transition-colors relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {state.weeklyActivity?.[i] || 0}m
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Analysis */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 h-full">
            <h3 className="text-xl font-black font-headline mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" /> 技能维度分析
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Listening', value: 75, icon: Headphones, color: 'bg-blue-500' },
                { label: 'Reading', value: 85, icon: BookOpen, color: 'bg-green-500' },
                { label: 'Writing', value: 60, icon: Edit, color: 'bg-amber-500' },
                { label: 'Speaking', value: 55, icon: Mic, color: 'bg-purple-500' },
              ].map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <skill.icon className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-sm font-bold">{skill.label}</span>
                    </div>
                    <span className="text-xs font-black text-primary">{skill.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      className={`h-full ${skill.color} rounded-full`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">AI 备考建议</p>
              <p className="text-sm text-on-surface leading-relaxed">
                你的阅读表现优异，但<span className="font-bold">写作</span>和<span className="font-bold">口语</span>仍有提升空间。建议增加 Task 2 的论证练习。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-10">
        <h3 className="text-2xl font-black font-headline mb-8 flex items-center gap-2">
          <Award className="w-8 h-8 text-amber-500" /> 获得成就
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: '早起鸟', desc: '连续 7 天 8点前开始学习', icon: '🌅', unlocked: true },
            { name: '词汇达人', desc: '掌握 500 个核心词汇', icon: '📚', unlocked: false },
            { name: '模考先锋', desc: '完成 5 套全真模考', icon: '📝', unlocked: true },
            { name: '写作能手', desc: '大作文获得 7.0 以上', icon: '✍️', unlocked: false },
            { name: '听力满分', desc: '听力练习获得满分', icon: '🎧', unlocked: false },
            { name: '坚持不懈', desc: '学习时长累计 100 小时', icon: '🔥', unlocked: true },
          ].map((badge, i) => (
            <div key={i} className={`p-6 rounded-3xl border flex flex-col items-center text-center gap-3 transition-all ${badge.unlocked ? 'bg-surface-container-lowest border-outline-variant/10 shadow-sm' : 'bg-surface-container-low border-transparent grayscale opacity-40'}`}>
              <span className="text-4xl">{badge.icon}</span>
              <p className="text-sm font-black">{badge.name}</p>
              <p className="text-[10px] text-on-surface-variant leading-tight">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
