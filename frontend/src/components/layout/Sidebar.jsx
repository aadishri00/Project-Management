import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle2,
  Home,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../utils/cn.js";
import logoUrl from "../../assest/logo.png";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/users", label: "Team", icon: Users, roles: ["admin", "manager"] },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export default function Sidebar({ open, onClose }) {
  const { hasRole } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-0 h-screen w-72 shrink-0 border-r border-brand-100/80 bg-white/90 backdrop-blur-xl flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 px-5 flex items-center justify-between border-b border-brand-100/80">
          <div className="flex min-w-0 items-center">
            <img
              src={logoUrl}
              alt="Tasksprint"
              className="h-12 w-44 object-contain object-left"
            />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {items.map((item) => {
            if (item.roles && !hasRole(...item.roles)) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-brand-600 text-white shadow-[0_14px_30px_-18px_rgba(13,148,136,0.9)]"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-800"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-100/80">
          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Pro tip</p>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Use filters and the Kanban board to track work-in-progress at a glance.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
