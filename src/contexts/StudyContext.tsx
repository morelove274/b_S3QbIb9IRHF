import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModuleProgress {
  id: string;
  progress: number;
  total: string;
  completedCount: number;
  totalCount: number;
}

interface StudyState {
  overallProgress: number;
  studyDays: number;
  streak: number;
  masteredWords: number;
  mockAverage: number;
  wrongQuestionsCount: number;
  newVocabCount: number;
  dailyGoals: {
    id: string;
    title: string;
    desc: string;
    completed: boolean;
  }[];
  modules: ModuleProgress[];
  weeklyActivity: number[];
  mockScores: { date: string, score: number }[];
  badges: { id: string, name: string, icon: string, unlocked: boolean }[];
  lastCheckInDate: string | null;
}

interface StudyContextType {
  state: StudyState;
  completeGoal: (id: string) => void;
  updateModuleProgress: (id: string, increment: number) => void;
  updateFocusTime: (minutes: number) => void;
  addMasteredWord: () => void;
  checkIn: () => void;
}

const INITIAL_STATE: StudyState = {
  overallProgress: 0,
  studyDays: 1,
  streak: 0,
  masteredWords: 0,
  mockAverage: 0,
  wrongQuestionsCount: 0,
  newVocabCount: 0,
  dailyGoals: [
    { id: 'g1', title: 'Cambridge IELTS C18 - Test 2', desc: '模考练习 · 建议用时 60min', completed: false },
    { id: 'g2', title: 'Core 1500 Vocab', desc: '单词复习 · 第 1 组', completed: false },
    { id: 'g3', title: 'Writing Task 2 Practice', desc: '练习一篇大作文', completed: false },
  ],
  modules: [
    { id: 'library', progress: 0, total: '0/72 套', completedCount: 0, totalCount: 72 },
    { id: 'vocab', progress: 0, total: '0/1500 词', completedCount: 0, totalCount: 1500 },
    { id: 'listening', progress: 0, total: '0/30 单元', completedCount: 0, totalCount: 30 },
    { id: 'reading', progress: 0, total: '0/55 章', completedCount: 0, totalCount: 55 },
    { id: 'writing', progress: 0, total: '0/20 篇', completedCount: 0, totalCount: 20 },
    { id: 'speaking', progress: 0, total: '0/50 话题', completedCount: 0, totalCount: 50 },
    { id: 'mock', progress: 0, total: '0/10 套', completedCount: 0, totalCount: 10 },
    { id: 'review', progress: 0, total: '0/20 处弱项', completedCount: 0, totalCount: 20 },
  ],
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  mockScores: [
    { date: '04-10', score: 5.5 },
    { date: '04-12', score: 6.0 },
    { date: '04-14', score: 6.5 },
    { date: '04-16', score: 7.0 },
  ],
  badges: [
    { id: 'b1', name: '初露锋芒', icon: '🌟', unlocked: true },
    { id: 'b2', name: '单词达人', icon: '📚', unlocked: false },
    { id: 'b3', name: '模考战神', icon: '⚔️', unlocked: false },
    { id: 'b4', name: '提分狂人', icon: '📈', unlocked: false },
  ],
  lastCheckInDate: null
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyState>(() => {
    const saved = localStorage.getItem('ielts_study_state');
    let baseState = INITIAL_STATE;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Deep merge or at least top-level merge to ensure all arrays exist
        baseState = { ...INITIAL_STATE, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved study state', e);
      }
    }
    
    // Calculate study days automatically
    let startDateStr = localStorage.getItem('ielts_start_date');
    if (!startDateStr) {
      startDateStr = new Date().toISOString();
      localStorage.setItem('ielts_start_date', startDateStr);
    }
    
    const startDate = new Date(startDateStr);
    const today = new Date();
    // Reset hours to compare only dates
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return { ...baseState, studyDays: diffDays };
  });

  useEffect(() => {
    localStorage.setItem('ielts_study_state', JSON.stringify(state));
  }, [state]);

  const completeGoal = (id: string) => {
    setState(prev => {
      const newGoals = prev.dailyGoals.map(g => g.id === id ? { ...g, completed: true } : g);
      const completedCount = newGoals.filter(g => g.completed).length;
      const newProgress = Math.min(100, Math.round((completedCount / newGoals.length) * 100));
      
      return {
        ...prev,
        dailyGoals: newGoals,
        // Update overall progress slightly based on goal completion
        overallProgress: Math.min(100, prev.overallProgress + 1)
      };
    });
  };

  const updateModuleProgress = (id: string, increment: number) => {
    setState(prev => {
      const newModules = prev.modules.map(m => {
        if (m.id === id) {
          const newCount = Math.min(m.totalCount, m.completedCount + increment);
          const newProg = Math.round((newCount / m.totalCount) * 100);
          return { ...m, completedCount: newCount, progress: newProg, total: `${newCount}/${m.totalCount} ${m.id === 'library' ? '套' : m.id === 'vocab' ? '词' : '单元'}` };
        }
        return m;
      });

      // Recalculate overall progress
      const totalProg = newModules.reduce((acc, m) => acc + m.progress, 0);
      const avgProg = Math.round(totalProg / newModules.length);

      return {
        ...prev,
        modules: newModules,
        overallProgress: avgProg
      };
    });
  };

  const updateFocusTime = (minutes: number) => {
    setState(prev => {
      const today = new Date().getDay(); // 0-6
      const newWeeklyActivity = [...prev.weeklyActivity];
      newWeeklyActivity[today] = (newWeeklyActivity[today] || 0) + minutes;
      
      return {
        ...prev,
        weeklyActivity: newWeeklyActivity
      };
    });
  };

  const addMasteredWord = () => {
    setState(prev => ({
      ...prev,
      masteredWords: prev.masteredWords + 1
    }));
    updateModuleProgress('vocab', 1);
  };

  const checkIn = () => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      if (prev.lastCheckInDate === today) return prev;
      return {
        ...prev,
        streak: prev.streak + 1,
        lastCheckInDate: today
      };
    });
  };

  return (
    <StudyContext.Provider value={{ state, completeGoal, updateModuleProgress, updateFocusTime, addMasteredWord, checkIn }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
