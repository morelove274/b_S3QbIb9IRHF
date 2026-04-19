import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  joinDate: string;
  avatar: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  isGuest: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => { success: boolean; studentId?: string };
  loginAsGuest: () => void;
  logout: () => void;
  getPassword: (username: string) => string | null;
  rememberUsername: (username: string) => void;
  getRememberedUsername: () => string | null;
  rememberPassword: (username: string, password: string) => void;
  getRememberedPasswordData: () => { username: string; password: string; salt: string; timestamp: number } | null;
  clearRememberedPassword: () => void;
}

const defaultProfile: UserProfile = {
  name: "樱岛麻衣",
  email: "mai.sakurajima@example.com",
  studentId: "IELTS-2023-0882",
  joinDate: "2023年9月12日",
  avatar: "https://picsum.photos/seed/avatar/200/200"
};

// 简单的加盐哈希函数
const hashPassword = (password: string): { hash: string; salt: string } => {
  const salt = Math.random().toString(36).substring(2, 15);
  const hash = btoa(password + salt);
  return { hash, salt };
};

// 验证密码
const verifyPassword = (password: string, hash: string, salt: string): boolean => {
  return btoa(password + salt) === hash;
};

// 生成学号
const generateStudentId = (): string => {
  const today = new Date();
  const dateStr = today.getFullYear().toString() + 
                 String(today.getMonth() + 1).padStart(2, '0') + 
                 String(today.getDate()).padStart(2, '0');
  
  // 获取当天注册用户数
  const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
  const todayKey = dateStr;
  const count = (registrations[todayKey] || 0) + 1;
  registrations[todayKey] = count;
  localStorage.setItem('registrations', JSON.stringify(registrations));
  
  return `IELTS-${dateStr}-${String(count).padStart(4, '0')}`;
};

// 补生成学号（用于老用户）
const generateMissingStudentId = (): string => {
  const today = new Date();
  const dateStr = today.getFullYear().toString() + 
                 String(today.getMonth() + 1).padStart(2, '0') + 
                 String(today.getDate()).padStart(2, '0');
  
  // 获取当天注册用户数
  const registrations = JSON.parse(localStorage.getItem('registrations') || '{}');
  const todayKey = dateStr;
  const count = (registrations[todayKey] || 0) + 1;
  registrations[todayKey] = count;
  localStorage.setItem('registrations', JSON.stringify(registrations));
  
  return `IELTS-${dateStr}-${String(count).padStart(4, '0')}`;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('is_logged_in') === 'true');
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('is_guest') === 'true');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 补生成学号（如果没有）
        if (!parsed.studentId || parsed.studentId === 'IELTS-2023-0882') {
          parsed.studentId = generateMissingStudentId();
          parsed.joinDate = new Date().toISOString().split('T')[0];
          localStorage.setItem('user_profile', JSON.stringify(parsed));
        }
        return { ...defaultProfile, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    return defaultProfile;
  });

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const register = (username: string, password: string): { success: boolean; studentId?: string } => {
    // 检查账号是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      return { success: false };
    }

    // 生成学号
    const studentId = generateStudentId();
    const joinDate = new Date().toISOString().split('T')[0];

    // 加密密码
    const { hash, salt } = hashPassword(password);
    
    // 保存用户数据
    users[username] = { 
      hash, 
      salt, 
      password, 
      studentId, 
      joinDate 
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // 更新用户资料
    updateProfile({ 
      name: username, 
      studentId, 
      joinDate 
    });
    
    return { success: true, studentId };
  };

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (!user) {
      return false;
    }

    // 验证密码
    if (!verifyPassword(password, user.hash, user.salt)) {
      return false;
    }

    setIsLoggedIn(true);
    setIsGuest(false);
    
    // 补生成学号（如果没有）
    if (!user.studentId) {
      user.studentId = generateMissingStudentId();
      user.joinDate = user.joinDate || new Date().toISOString().split('T')[0];
      users[username] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    updateProfile({ 
      name: username, 
      studentId: user.studentId, 
      joinDate: user.joinDate 
    });
    
    localStorage.setItem('is_logged_in', 'true');
    localStorage.removeItem('is_guest');
    
    return true;
  };

  const loginAsGuest = () => {
    setIsLoggedIn(true);
    setIsGuest(true);
    updateProfile({ name: "访客用户" });
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('is_guest', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('is_guest');
  };

  const getPassword = (username: string): string | null => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username]?.password || null;
  };

  const rememberUsername = (username: string) => {
    localStorage.setItem('remembered_username', username);
  };

  const getRememberedUsername = (): string | null => {
    return localStorage.getItem('remembered_username');
  };

  const rememberPassword = (username: string, password: string) => {
    const { hash, salt } = hashPassword(password);
    const data = {
      username,
      password: hash,
      salt,
      timestamp: Date.now()
    };
    localStorage.setItem('remembered_password', JSON.stringify(data));
  };

  const getRememberedPasswordData = (): { username: string; password: string; salt: string; timestamp: number } | null => {
    const data = localStorage.getItem('remembered_password');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  const clearRememberedPassword = () => {
    localStorage.removeItem('remembered_password');
  };

  return (
    <UserContext.Provider value={{
      profile, 
      updateProfile, 
      isLoggedIn, 
      isGuest, 
      login, 
      register, 
      loginAsGuest, 
      logout,
      getPassword,
      rememberUsername,
      getRememberedUsername,
      rememberPassword,
      getRememberedPasswordData,
      clearRememberedPassword
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
