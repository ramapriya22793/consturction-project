import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  Shield,
  Sparkles,
  HardHat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Company info
  const [companyName, setCompanyName] = useState("Apex Civil Infrastructures Ltd");
  const [companyType, setCompanyType] = useState("General Contracting & Heavy Civil");
  const [gstNumber, setGstNumber] = useState("27AABCA1234F1Z8");
  const [companyAddress, setCompanyAddress] = useState("Level 12, Tower B, Business Bay, Metro Hub");
  const [contactPhone, setContactPhone] = useState("+91 22 4500 8900");
  const [companyEmail, setCompanyEmail] = useState("operations@apexcivil.com");

  // Step 2: Project info
  const [projName, setProjName] = useState("Apex Coastal Expressway Flyover");
  const [projType, setProjType] = useState("Infrastructure");
  const [location, setLocation] = useState("North Coastal Highway Corridor");
  const [budget, setBudget] = useState(24000000);
  const [startDate, setStartDate] = useState("2026-03-01");
  const [completionDate, setCompletionDate] = useState("2028-06-30");

  // Step 3: Invites
  const [invites, setInvites] = useState([
    { name: "Marcus Miller", email: "marcus@apexcivil.com", role: "Site Engineer" },
    { name: "Devraj Patel", email: "devraj@apexcivil.com", role: "Site Supervisor" },
    { name: "Anita Deshmukh", email: "anita@apexcivil.com", role: "Accountant" },
  ]);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
          <Sparkles className="h-4 w-4" /> Company Onboarding Wizard
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Initialize Your Construction Enterprise
        </h1>
        <p className="text-xs text-slate-500">
          Configure company profile, establish your first capital site, and provision role-based accounts.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0"></div>
        {[
          { step: 1, label: "1. Company Profile" },
          { step: 2, label: "2. Initial Project" },
          { step: 3, label: "3. Team Provisioning" },
          { step: 4, label: "4. Launch Platform" },
        ].map((item) => (
          <div key={item.step} className="flex flex-col items-center bg-white px-2 z-10">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                currentStep >= item.step
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-100 text-slate-500 border border-slate-300"
              }`}
            >
              {currentStep > item.step ? <CheckCircle2 className="h-5 w-5" /> : item.step}
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6 shadow-xl border-slate-200">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 1: Enterprise Company Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Company Name</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Company Type</label>
                <input
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">GST / Tax Identification Number</label>
                <input
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Corporate Email</label>
                <input
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Headquarters Address</label>
              <input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setCurrentStep(2)} className="flex items-center gap-1.5 text-xs">
                Next: Configure Project <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 2: Setup Initial Construction Project</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">First Project Name</label>
                <input
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Project Type</label>
                <select
                  value={projType}
                  onChange={(e) => setProjType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Budget ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Expected Completion</label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Site Location & Corridor</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="text-xs">
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} className="flex items-center gap-1.5 text-xs">
                Next: Invite Team <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 3: Provision Key Construction Team Roles</h3>
            <p className="text-slate-500">
              Invitations will be dispatched with pre-configured Role-Based Access Control (RBAC) permissions.
            </p>

            <div className="space-y-2">
              {invites.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span className="text-slate-400 text-[11px] block">{u.email}</span>
                  </div>
                  <Badge variant="outline" className="font-bold text-blue-700 text-[10px]">
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="text-xs">
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                Complete Setup <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Setup Complete & Platform Ready!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {companyName} has been initialized with {projName} and RBAC user credentials configured.
              </p>
            </div>
            <Link to="/">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-6 py-2">
                Launch Executive Dashboard
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};
