import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HardHat,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Building2,
  Briefcase,
  Layers,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useConstructionStore } from "../store/useConstructionStore";
import { DEMO_ACCOUNTS, DemoAccount } from "../mockData/demoAccounts";
import { UserRole } from "../types";
import { toast } from "sonner";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, loginAsDemoRole } = useConstructionStore();

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("owner@civilpulse.com");
  const [password, setPassword] = useState("OwnerPassword123!");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("BUILDER_OWNER");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = loginWithCredentials(email, password);
    if (result.success) {
      toast.success("Signed in successfully!");
      navigate("/");
    } else {
      setErrorMessage(result.error || "Authentication failed.");
      toast.error(result.error || "Authentication failed.");
    }
  };

  const handleDemoRoleLogin = (account: DemoAccount) => {
    loginAsDemoRole(account.role);
    toast.success(`Logged in as ${account.name} (${account.roleLabel})`);
    navigate("/");
  };

  const handleAutoFill = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
    setErrorMessage(null);
    toast.info(`Filled credentials for ${account.roleLabel}`);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl w-full mx-auto pb-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <HardHat className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white">
                CIVIL<span className="text-amber-400">PULSE</span>
              </span>
              <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-400 uppercase tracking-wider border border-amber-400/20">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Access Control</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Need quick access?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoRoleLogin(DEMO_ACCOUNTS[0])}
            className="text-xs border-slate-700 bg-slate-900/80 text-amber-400 hover:bg-slate-800 hover:text-amber-300"
          >
            ⚡ Quick Owner Login
          </Button>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive 1-Click Role Accounts */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Multi-Role RBAC Authentication</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Select a Role to Sign In Instantly
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Experience the tailor-made dashboard, permission boundaries, and operational tools designed specifically for each civil engineering stakeholder.
              </p>
            </div>

            {/* Role Accounts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-200 shadow-md flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-white truncate">
                          {acc.name}
                        </span>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase border ${acc.badgeColor}`}
                        >
                          {acc.roleLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {acc.roleTitle}
                      </p>
                    </div>
                  </div>

                  {/* Credentials pill */}
                  <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-2 text-[11px] font-mono text-slate-300 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Email:</span>
                      <span className="text-slate-300 font-bold select-all truncate ml-1">{acc.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px]">Password:</span>
                      <span className="text-amber-400 font-bold select-all">{acc.password}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAutoFill(acc)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold text-center transition-colors"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoRoleLogin(acc)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold text-center shadow-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <span>1-Click In</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Corporate Credentials Form */}
          <div className="lg:col-span-5">
            <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-md">
              <CardHeader className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-amber-400" />
                    <span>
                      {mode === "login" && "Sign In with Credentials"}
                      {mode === "register" && "Create Construction Enterprise"}
                      {mode === "forgot" && "Reset Enterprise Password"}
                    </span>
                  </CardTitle>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                    256-Bit SSL
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  {mode === "login" && "Enter your corporate credentials or click any demo role on the left."}
                  {mode === "register" && "Setup a new company workspace with multi-site management."}
                  {mode === "forgot" && "Receive an email with a secure password reset token."}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-5">
                {errorMessage && (
                  <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
                    <Info className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
                  {mode === "register" && (
                    <>
                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Full Legal Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alexander Vance"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-300 block mb-1">
                          Construction Company Name
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apex Infrastructure Ltd."
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Corporate Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="you@civilpulse.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {mode !== "forgot" && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-300">Password</label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => setMode("forgot")}
                            className="text-[11px] text-amber-400 hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2.5 text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all mt-2"
                  >
                    {mode === "login" && "Sign In to CivilPulse Platform"}
                    {mode === "register" && "Create Company & Continue Setup"}
                    {mode === "forgot" && "Send Reset Link"}
                  </Button>

                  <div className="pt-2 text-center text-slate-400 text-[11px]">
                    {mode === "login" && (
                      <p>
                        New company joining CivilPulse?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("register")}
                          className="text-amber-400 font-bold hover:underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    )}
                    {mode !== "login" && (
                      <p>
                        Already registered?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-amber-400 font-bold hover:underline"
                        >
                          Back to Sign In
                        </button>
                      </p>
                    )}
                  </div>
                </form>

                {/* Security verification pill */}
                <div className="mt-5 rounded-xl bg-slate-950/60 border border-slate-800 p-3 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Role-Based Permissions Enforced</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Logging in sets access permissions, site restrictions, approval rights, and executive dashboards automatically.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto pt-4 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 CivilPulse ERP Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-300">Dashboard</Link>
          <span className="text-slate-700">•</span>
          <Link to="/onboarding" className="hover:text-slate-300">Onboarding</Link>
          <span className="text-slate-700">•</span>
          <a href="#" className="hover:text-slate-300">Security & Privacy</a>
        </div>
      </footer>
    </div>
  );
};
