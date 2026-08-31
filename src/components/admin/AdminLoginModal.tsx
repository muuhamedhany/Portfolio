import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldAlert, ShieldCheck, X, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

export function AdminLoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, user, isAdmin, logout } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    if (!credentialResponse.credential) {
      setError('No credential received from Google.');
      return;
    }
    setIsVerifying(true);
    try {
      await login(credentialResponse.credential);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Make sure you use the authorized admin account.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed or was closed.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative z-10 w-full max-w-md border-2 border-[var(--pixel-frame)] bg-card p-6 shadow-[6px_6px_0_var(--pixel-shadow)]"
          style={{
            boxShadow:
              'inset 2px 2px 0 var(--pixel-edge-light), inset -2px -2px 0 var(--pixel-edge-dark), 6px 6px 0 var(--pixel-shadow)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-white shadow-[2px_2px_0_var(--pixel-shadow)]">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-2xl tracking-wide text-foreground">ADMIN PORTAL</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  MANAGEMENT CONSOLE
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="flex h-8 w-8 items-center justify-center border border-[var(--pixel-frame)] bg-background text-foreground transition-colors hover:bg-[var(--pixel-active)] hover:text-white cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          {isAdmin && user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-950/20 p-3 text-emerald-400">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <div className="text-xs">
                  <div className="font-mono font-bold uppercase tracking-wider">AUTHENTICATED AS OWNER</div>
                  <div className="font-mono text-[11px] opacity-80">{user.email}</div>
                </div>
              </div>

              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                You are currently logged in with full administrative privileges to create, edit, or delete projects directly on your Neon database.
              </p>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="border-2 border-[var(--pixel-frame)] bg-card px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer"
                >
                  RETURN TO SITE
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="border-2 border-red-500/50 bg-red-950/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-red-400 hover:bg-red-900/40 cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border border-border bg-background/50 p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-to)]">
                  <ShieldAlert className="h-4 w-4" />
                  RESTRICTED ACCESS
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Sign in with your verified Google account (<code className="font-mono text-foreground font-bold">muuhamedhany@gmail.com</code>) to unlock live project creation and editing.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Google Sign-In Button Container */}
              <div className="flex flex-col items-center justify-center py-2">
                {isVerifying ? (
                  <div className="flex items-center gap-2 py-3 font-mono text-xs text-[var(--accent-to)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    VERIFYING ADMIN CREDENTIALS...
                  </div>
                ) : (
                  <div className="p-1 border-2 border-border bg-card shadow-[2px_2px_0_var(--pixel-shadow)]">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="filled_black"
                      shape="rectangular"
                      text="signin_with"
                      size="large"
                      useOneTap={false}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 text-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  POWERED BY NEON SERVERLESS POSTGRES & GOOGLE OAUTH
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
