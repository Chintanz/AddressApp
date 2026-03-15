import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Network,
  RefreshCw,
  History,
  ChevronLeft,
  ChevronRight,
  Shield,
  Fingerprint,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/Profile", label: "Master Profile", icon: User },
  { path: "/Entities", label: "Entity Registry", icon: Network },
  { path: "/SyncEngine", label: "Sync Engine", icon: RefreshCw },
  { path: "/SyncHistory", label: "Sync History", icon: History },
];

export default function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/50 flex flex-col transition-all duration-300 ease-out ${
          collapsed ? "w-20" : "w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center px-4 py-2 border-b border-slate-800/50 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-semibold text-white tracking-tight">SyncShield</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Orchestration Engine</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="px-3 py-3 border-b border-slate-800/50">
            <div className="relative text-slate-300">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search nav"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search entities..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500/15 text-blue-300 shadow-sm shadow-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-blue-300" : "text-slate-300"}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800/50 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-xs"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              E2EE Vault Active
            </div>
            <p className="text-[10px] text-slate-400 mt-1">256-bit AES encryption</p>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:pl-0">
        <header className="h-16 border-b border-slate-800/50 flex items-center px-4 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-300 mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="text-xs text-slate-300 font-medium">Secure Profile Broadcast</div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /></span>
            System Operational
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
