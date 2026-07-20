import { useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * AdminLogin
 *
 * Admin sign-in screen for UNC BIDYO. Authenticates against Supabase
 * using email + password and hands the resulting session back to the
 * parent via `onLoginSuccess`.
 *
 * Props:
 *  - onLoginSuccess(session): called with the Supabase session object
 *    after a successful sign-in.
 */
export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors on every new attempt
    setErrorMsg("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg("Please enter both your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || "Unable to sign in. Please try again.");
        return;
      }

      if (data?.session) {
        onLoginSuccess?.(data.session);
      } else {
        setErrorMsg("Sign-in did not return a valid session. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bidyo-crimson px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl sm:p-10">
        {/* Brand accent */}
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-bidyo-crimson">
          ADMIN
        </p>

        {/* Heading */}
        <h1 className="mt-3 text-2xl font-bold text-bidyo-crimsonBlack">
          Log In
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your credentials to access the admin dashboard.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div>
            <label htmlFor="admin-email" className="sr-only">
              Email address
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-bidyo-crimsonBlack placeholder:text-neutral-400 outline-none transition focus:border-bidyo-crimson focus:ring-2 focus:ring-bidyo-crimson/20"
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-bidyo-crimsonBlack placeholder:text-neutral-400 outline-none transition focus:border-bidyo-crimson focus:ring-2 focus:ring-bidyo-crimson/20"
            />
          </div>

          {/* Error alert */}
          {errorMsg && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              {errorMsg}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-bidyo-crimsonBlack px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-bidyo-crimson disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
