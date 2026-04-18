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
  login: (username: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const defaultProfile: UserProfile = {
  name: "樱岛麻衣",
  email: "mai.sakurajima@example.com",
  studentId: "IELTS-2023-0882",
  joinDate: "2023年9月12日",
  avatar: "https://picsum.photos/seed/avatar/200/200"
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

  const login = (username: string) => {
    setIsLoggedIn(true);
    setIsGuest(false);
    updateProfile({ name: username });
    localStorage.setItem('is_logged_in', 'true');
    localStorage.removeItem('is_guest');
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

  return (
    <UserContext.Provider value={{ profile, updateProfile, isLoggedIn, isGuest, login, loginAsGuest, logout }}>
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
