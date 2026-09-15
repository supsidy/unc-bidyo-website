import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

/**
 * AdminPortal
 *
 * Top-level controller for the '/admin' route in UNC BIDYO. Owns the
 * Supabase session state and decides which screen to render:
 *  - No session yet / signed out  -> AdminLogin
 *  - Active session                -> AdminDashboard
 *
 * Always starts logged out: any existing session is cleared on page
 * load/refresh, so admins must sign in every time. Also stays in sync
 * with Supabase auth events (e.g. token expiry, sign-out from another
 * tab) once signed in.
 */
export default function AdminPortal() {
  const [session, setSession] = useState(null);
  // Distinguishes "we haven't checked yet" from "we checked and there's
  // no session", so we don't flash the login screen before we know.
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Always start logged out: instead of restoring any existing
    // session on mount, sign out of it so the admin must sign in
    // again every time the page is loaded/refreshed.
    supabase.auth.signOut().finally(() => {
      if (!isMounted) return;
      setSession(null);
      setCheckingSession(false);
    });

    // Keep session state in sync with auth events (sign-out, token
    // refresh, expiry, sign-in from elsewhere, etc.).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Avoid flashing the login form while we're still checking for an
  // existing session.
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bidyo-crimson">
        <p className="text-sm font-medium text-white/70">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLoginSuccess={setSession} />;
  }

  return <AdminDashboard session={session} onLogout={() => setSession(null)} />;
}
