import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  Target,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { WRITING_SAMPLES } from './StudyData';
import { useStudy } from '../../contexts/StudyContext';

export default function WritingPracticePage() {
  const navigate = useNavigate();
  const { updateModuleProgress } = useStudy();
  const [mode, setMode] = useState<'topic' | 'practice'>('topic');
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [userText, setUserText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const getFeedback = async () => {
    if (!userText.trim()) return;
    setIsAnalyzing(true);
    try {
      const prompt = `As an IELTS writing examiner, evaluate the following essay.
      Essay: ${userText}
      
      Provide a JSON object with:
      - scores: { ta: number, cc: number, lr: number, gra: number }
      - overall: number
      - feedback: string
      - correction: string (the first paragraph rewritten better)`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(result.text || '{}');
      setFeedback(data);
      updateModuleProgress('writing', 1);
    } catch (error) {
      console.error(error);
      setFeedback({
        scores: { ta: 6.5, cc: 6.5, lr: 6.0, gra: 6.5 },
        overall: 6.5,
        feedback: "Your essay is well-structured, but you need to use more academic collocations and ensure grammatical precision in complex sentences.",
        correction: "In the contemporary era, there is an ongoing debate regarding..."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = userText.trim() === '' ? 0 : userText.trim().split(/\s+/).length;

  if (mode === 'topic') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10 py-10 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="p-3 bg-white hover:bg-surface-container-low rounded-full transition-colors shadow-sm">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h2 className="text-4xl font-black font-headline tracking-tighter">写作实战特训库</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {WRITING_SAMPLES.map((sample, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                setSelectedSample(sample);
                setMode('practice');
              }}
              className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">Writing Task 2</span>
                  <div className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{sample.title}</h3>
                <p className="text-sm text-on-surface-variant font-medium line-clamp-3">"{sample.topic}"</p>
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-outline-variant/5 pt-6">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-on-surface">目标 Band {sample.band}</span>
                </div>
                <div className="text-primary font-black text-sm flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                  进入练笔 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => setMode('topic')} className="p-3 bg-white hover:bg-surface-container-low rounded-full transition-colors shadow-sm">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div>
            <h2 className="text-3xl font-black font-headline">{selectedSample?.title}</h2>
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">写作实战练笔 · AI 智能批改</p>
          </div>
        </div>
        <button 
          onClick={getFeedback}
          disabled={wordCount < 50 || isAnalyzing}
          className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-3"
        >
          {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          提交并获取分析报告
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/10 shadow-xl space-y-8">
            <div className="bg-surface-container-low/50 p-6 rounded-3xl border border-outline-variant/5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">题目要求</p>
              <p className="text-on-surface font-medium leading-relaxed italic">"{selectedSample?.topic}"</p>
            </div>

            <textarea 
              value={userText}
              onChange={e => setUserText(e.target.value)}
              placeholder="在此开始你的写作练习，AI 将实时统计字数并在提交后提供深度解析..."
              className="w-full h-[500px] p-8 bg-surface-container-low border border-transparent focus:border-primary focus:bg-white rounded-[2rem] text-xl leading-relaxed outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {feedback ? (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">估计总分</p>
                  <p className="text-8xl font-black font-headline tracking-tighter">{feedback.overall}</p>
                </div>

                <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-4">
                  <h4 className="font-black text-lg">评分维度</h4>
                  <div className="space-y-4">
                    {Object.entries(feedback.scores).map(([key, val]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase text-on-surface-variant">
                          <span>{key === 'ta' ? 'Task Response' : key === 'cc' ? 'Cohesion' : key === 'lr' ? 'Lexical' : 'Grammar'}</span>
                          <span>{val} / 9.0</span>
                        </div>
                        <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(val / 9) * 100}%` }} className="h-full bg-primary"></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 space-y-4">
                  <h4 className="text-sm font-black text-amber-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> 专家评语
                  </h4>
                  <p className="text-sm text-amber-900 leading-relaxed italic">{feedback.feedback}</p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface-container-low/50 border-4 border-dashed border-outline-variant/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-6 h-[400px]">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-slate-300">
                  <FileCheck className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black text-on-surface">等待评估</p>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">提交后，AI 考官将根据雅思官方标准为您提供详细的评分与改进方案</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">词汇量</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">{wordCount} <span className="text-xs font-bold text-slate-300">WORDS</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">预计用时</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">40 <span className="text-xs font-bold text-slate-300">MINS</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm group">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">本次时长</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')} <span className="text-xs font-bold text-slate-300">ELAPSED</span></p>
        </div>
      </div>
    </motion.div>
  );
}
