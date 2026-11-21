import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HardHat, Lock, Mail, User, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("owner@civilcorp.com");
  const [password, setPassword] = useState("••••••••••••");
  const [fullName, setFullName] = useState("Alexander Vance");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <HardHat className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            CIVIL<span className="text-amber-400">PULSE</span> ERP
          </h1>
          <p className="text-xs text-slate-400">
            Construction & Civil Engineering Management SaaS Platform
          </p>
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
          <CardHeader className="pb-3 text-center border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white">
              {mode === "login" && "Sign In to Your Workspace"}
              {mode === "register" && "Create Construction Enterprise"}
              {mode === "forgot" && "Reset Your Credentials"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {mode === "login" && "Enter your corporate credentials to access active sites"}
              {mode === "register" && "Start your 14-day full platform enterprise trial"}
              {mode === "forgot" && "We will send secure reset instructions to your verified email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === "register" && (
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Corporate Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
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
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 text-xs mt-2"
              >
                {mode === "login" && "Access Enterprise Platform"}
                {mode === "register" && "Initialize Company"}
                {mode === "forgot" && "Send Reset Link"}
              </Button>

              <div className="pt-2 text-center text-slate-400 text-[11px]">
                {mode === "login" && (
                  <p>
                    Don't have an enterprise account?{" "}
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
                    Already have credentials?{" "}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
