import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch {
      setError("Could not continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo / Brand */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-amber-400">Coach</span>
            <span className="text-white/90">Metrics</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm md:text-base font-light tracking-wide">
          Daily KPI tracking for digital product coaches
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-50" />

          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white/90">
              {flow === "signIn" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/40 text-sm mb-8">
              {flow === "signIn"
                ? "Sign in to access your dashboard"
                : "Start tracking your coaching KPIs"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-sm md:text-base"
                  placeholder="coach@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-sm md:text-base"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 md:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 text-sm md:text-base"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  flow === "signIn" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="mt-6 w-full py-3.5 bg-white/[0.03] border border-white/[0.08] text-white/70 font-medium rounded-xl hover:bg-white/[0.06] hover:border-white/[0.12] transition-all disabled:opacity-50 text-sm md:text-base"
            >
              Continue as Guest
            </button>

            <p className="mt-8 text-center text-sm text-white/40">
              {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="ml-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {flow === "signIn" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-white/20 text-xs">
          Requested by <a href="https://x.com/michaelonsol" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">@michaelonsol</a> · Built by <a href="https://x.com/clonkbot" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">@clonkbot</a>
        </p>
      </footer>
    </div>
  );
}
