import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, RefreshCw, LogOut, ShieldCheck, Database, Check } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';
import { useProjects } from '@/lib/context/ProjectsContext';

export function AdminActionBar() {
  const { isAdmin, user, logout } = useAdminAuth();
  const { openCreateDrawer, refreshProjects, isLoading } = useProjects();
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isAdmin || !user) return null;

  const handleSync = async () => {
    await refreshProjects();
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  return (
    <motion.aside
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      aria-label="Admin controls"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-between gap-3 border-2 border-[var(--pixel-frame)] bg-card px-4 py-2 shadow-[4px_4px_0_var(--pixel-shadow)] max-w-2xl w-[92vw] sm:w-auto"
      style={{
        boxShadow:
          'inset 1.5px 1.5px 0 var(--pixel-edge-light), inset -1.5px -1.5px 0 var(--pixel-edge-dark), 4px 4px 0 var(--pixel-shadow)',
      }}
    >
      {/* Left: Identity Badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <ShieldCheck className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
            <span>ADMIN MODE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="font-mono text-[9px] text-muted-foreground truncate max-w-[150px]">
            {user.email}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Sync Button */}
        <button
          type="button"
          onClick={handleSync}
          disabled={isLoading}
          className="flex items-center gap-1.5 border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-[var(--pixel-frame)] transition-colors cursor-pointer disabled:opacity-50"
          title="Sync with Neon database"
        >
          {syncSuccess ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">SYNCED</span>
            </>
          ) : (
            <>
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">SYNC DB</span>
            </>
          )}
        </button>

        {/* New Project Button */}
        <button
          type="button"
          onClick={openCreateDrawer}
          className="flex items-center gap-1.5 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_var(--pixel-shadow)] hover:brightness-110 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>NEW PROJECT</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex h-7 w-7 items-center justify-center border border-border bg-background text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
          title="Logout from Admin"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.aside>
  );
}
