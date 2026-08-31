import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGoogleLogin } from '@react-oauth/google';
import { X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/lib/context/AdminAuthContext';

/* ─── Official Google 'G' Logo (Vector) ─── */
function GoogleGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function AdminLoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, user, isAdmin, logout } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Google OAuth Popup Hook
  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setIsVerifying(true);
      try {
        await login(tokenResponse.access_token, true);
      } catch (err: any) {
        setError(err.message || 'Access denied: account is not authorized.');
      } finally {
        setIsVerifying(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed.');
    },
  });

  if (!isLoginModalOpen) return null;

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
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Wrapper (V1 Compact Pixel HUD Keycard) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ type: 'spring', stiffness: 480, damping: 32 }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex items-center gap-2 border-2 border-red-500/70 bg-red-950/90 p-2.5 font-mono text-[11px] text-red-300 shadow-[3px_3px_0_rgba(0,0,0,0.8)]"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span className="leading-snug">{error}</span>
            </motion.div>
          )}

          {/* Authenticated State */}
          {isAdmin && user ? (
            <div
              className="border-2 border-[var(--pixel-frame)] bg-card p-5 text-center shadow-[5px_5px_0_var(--pixel-shadow)] select-none"
              style={{
                boxShadow:
                  'inset 2px 2px 0 var(--pixel-edge-light), inset -2px -2px 0 var(--pixel-edge-dark), 5px 5px 0 var(--pixel-shadow)',
              }}
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border-2 border-emerald-500/60 bg-emerald-950/40 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl tracking-wide text-foreground">AUTHENTICATED</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                ADMIN PRIVILEGES ACTIVE
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="border-2 border-[var(--pixel-frame)] bg-background px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-[var(--pixel-active)] hover:text-white transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="border-2 border-red-500/50 bg-red-950/40 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          ) : (
            /* V1 Compact Pixel HUD Keycard */
            <div
              className="relative border-2 border-[var(--pixel-frame)] bg-card p-5 shadow-[5px_5px_0_var(--pixel-shadow)] select-none"
              style={{
                boxShadow:
                  'inset 2px 2px 0 var(--pixel-edge-light), inset -2px -2px 0 var(--pixel-edge-dark), 5px 5px 0 var(--pixel-shadow)',
              }}
            >
              {/* Single Clean Google Sign-In Action */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => googleLoginTrigger()}
                  disabled={isVerifying}
                  className="group relative flex w-full items-center justify-center gap-3 border-2 border-[var(--pixel-frame)] bg-background p-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-[3px_3px_0_var(--pixel-shadow)] hover:border-[var(--accent-to)] hover:bg-[var(--pixel-active)] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_transparent] transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-to)] group-hover:text-white" />
                      <span>VERIFYING...</span>
                    </>
                  ) : (
                    <>
                      <GoogleGlyph className="h-4 w-4 shrink-0" />
                      <span>SIGN IN WITH GOOGLE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
