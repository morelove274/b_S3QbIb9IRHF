import { Bell, Search, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { profile } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-[0_10px_30px_-10px_rgba(0,88,188,0.15)] h-16 flex justify-between items-center px-8">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent font-headline tracking-tight">
          雅思坚持助手
        </span>
        <div className="hidden md:flex gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'
              }`
            }
          >
            控制台
          </NavLink>
          <NavLink
            to="/study-center"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'
              }`
            }
          >
            学习中心
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'
              }`
            }
          >
            电影画廊
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'
              }`
            }
          >
            统计数据
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 w-64"
            placeholder="搜索资源..."
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <NavLink to="/profile" className="flex items-center gap-3 pl-2 border-l border-outline-variant/30 hover:opacity-80 transition-opacity">
          <span className="text-sm font-bold font-headline text-on-surface">{profile.name}</span>
          <img
            alt="用户头像"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            src={profile.avatar}
            referrerPolicy="no-referrer"
          />
        </NavLink>
      </div>
    </nav>
  );
}
