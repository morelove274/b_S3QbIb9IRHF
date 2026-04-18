import { LayoutDashboard, School, Film, BarChart3, TrendingUp, Rocket, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 flex-col p-4 space-y-6 bg-slate-50/80 backdrop-blur-xl bg-gradient-to-r from-blue-50 to-transparent pt-24">
      <div className="px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>控制台</span>
        </NavLink>
        <NavLink
          to="/study-center"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
            }`
          }
        >
          <School className="w-5 h-5" />
          <span>学习中心</span>
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
            }`
          }
        >
          <Film className="w-5 h-5" />
          <span>电影画廊</span>
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
            }`
          }
        >
          <BarChart3 className="w-5 h-5" />
          <span>统计数据</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-1'
            }`
          }
        >
          <TrendingUp className="w-5 h-5" />
          <span>个人主页</span>
        </NavLink>
      </div>
      <div className="mt-auto p-4">
        <NavLink 
          to="/study-center?autoStart=true"
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all mb-4"
        >
          <Rocket className="w-4 h-4" />
          开始每日专注
        </NavLink>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-headline tracking-wide text-sm text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
