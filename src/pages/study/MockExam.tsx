import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Clock, 
  Trophy, 
  ClipboardCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CAMBRIDGE_LIBRARY } from './StudyData';
import { useStudy } from '../../contexts/StudyContext';

export default function MockExamPage() {
  const navigate = useNavigate();
  const { updateModuleProgress } = useStudy();
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    let timer: any;
    if (selectedTest && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [selectedTest, isSubmitted, timeLeft]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    const mockScore = (Math.random() * 2 + 5.5); // Random score between 5.5 and 7.5
    setScore(mockScore);
    updateModuleProgress('mock', 1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!selectedTest) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10 py-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-black font-headline tracking-tighter">真题套卷模考入口</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAMBRIDGE_LIBRARY.map(book => (
            <div key={book.id} className="bg-surface-container-lowest p-8 rounded-[3rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all group border-b-8 border-b-primary/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                  {book.id.replace('c', '')}
                </div>
                <h3 className="font-black text-xl">{book.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {book.tests.map(test => (
                  <button 
                    key={test.id}
                    onClick={() => {
                      setSelectedTest(test);
                      setTimeLeft(3600);
                      setIsSubmitted(false);
                      setAnswers({});
                    }}
                    className="py-4 bg-surface-container-low hover:bg-primary/5 hover:border-primary/30 border border-transparent rounded-2xl text-sm font-bold transition-all"
                  >
                    {test.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-12">
        <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] border border-outline-variant/10 shadow-2xl text-center space-y-10">
          <div className="w-28 h-28 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-14 h-14" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black font-headline tracking-tight">测试已完成！</h2>
            <p className="text-on-surface-variant text-lg font-medium">系统正在为您进行 AI 解析与预测...</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/5">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">预估 Band Score</p>
              <p className="text-6xl font-black text-primary">{score?.toFixed(1)}</p>
            </div>
            <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/5">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">测试用时</p>
              <p className="text-6xl font-black text-on-surface">{formatTime(3600 - timeLeft)}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setSelectedTest(null)} className="flex-1 py-5 bg-primary text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all">重新测试</button>
            <button onClick={() => navigate('/dashboard')} className="flex-1 py-5 bg-surface-container-high text-on-surface rounded-2xl font-black hover:bg-surface-container-highest transition-all">返回控制台</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest flex flex-col">
      <header className="h-24 border-b border-outline-variant/10 px-10 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => setSelectedTest(null)} className="p-3 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div>
            <h2 className="font-black text-2xl">{selectedTest.title} - 实战演练</h2>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">Full Mock Examination</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 px-8 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 shadow-sm animate-pulse">
            <Clock className="w-6 h-6" />
            <span className="font-black font-mono text-2xl">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="px-10 py-3.5 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            结束测试并交卷
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 border-r border-outline-variant/10 p-8 space-y-4 bg-surface-container-low/30">
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(section => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`w-full p-5 rounded-[1.5rem] text-left font-black transition-all flex items-center justify-between group ${currentSection === section ? 'bg-primary text-white shadow-xl translate-x-2' : 'hover:bg-surface-container-low text-on-surface-variant hover:translate-x-1'}`}
            >
              <span className="capitalize">{section}</span>
              <ShieldCheck className={`w-5 h-5 ${currentSection === section ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-12 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-surface-container-low/20 p-8 rounded-[2rem] border border-outline-variant/5">
              <h3 className="text-4xl font-black font-headline capitalize mb-4">{currentSection} Module</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                {currentSection === 'listening' && "Listen to the recording carefully and answer the following questions. Each question is worth 1 point."}
                {currentSection === 'reading' && "Read the academic passage carefully. Pay attention to keywords and synonyms."}
                {currentSection === 'writing' && "Task 1 or Task 2. Maintain academic vocabulary and correct grammatical structure."}
                {currentSection === 'speaking' && "This is a recorded simulation. Please answer the prompts naturally."}
              </p>
            </div>

            <div className="space-y-8 pb-20">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8">
                  <p className="font-black text-xl text-on-surface flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">0{i}</span>
                    According to the text, what is the main contributing factor to the observed phenomenon?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A. Climatic shifts', 'B. Human interference', 'C. Natural selection', 'D. Genetic mutations'].map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setAnswers(prev => ({ ...prev, [`${currentSection}-${i}`]: opt }))}
                        className={`p-5 rounded-2xl border-2 text-left text-sm font-bold transition-all flex items-center gap-4 ${answers[`${currentSection}-${i}`] === opt ? 'bg-primary/5 border-primary text-primary' : 'bg-surface-container-low/20 border-transparent hover:border-primary/20'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[`${currentSection}-${i}`] === opt ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                          {answers[`${currentSection}-${i}`] === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      {/* Bottom Floating Stats Bar */}
      <div className="bg-white border-t border-outline-variant/10 p-6 flex items-center justify-center gap-12 shadow-2xl z-20">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">已答题数:</span>
          <span className="text-xl font-black text-on-surface">{Object.keys(answers).length}/20</span>
        </div>
        <div className="w-px h-8 bg-outline-variant/20" />
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">当前进度:</span>
          <span className="text-xl font-black text-on-surface">{Math.round((Object.keys(answers).length / 20) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
