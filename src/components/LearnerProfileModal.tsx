import { useState } from "react";
import { CourseModule, courseModules } from "@/data/courseData";
import {
  X,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Mail,
  BarChart3,
  FileText,
  ShieldCheck,
  CheckSquare,
  Square,
  TrendingUp,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Cell,
} from "recharts";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  completedCount: number;
  completedModules: number[];
  quizScores: { [moduleId: number]: { score: number; total: number } };
  averageQuizScore: number;
  status: "Completed" | "In Progress";
  moduleTimestamps?: { [moduleId: number]: string };
}

interface LearnerProfileModalProps {
  user: UserSummary | null;
  onClose: () => void;
  onToggleModuleCompletion?: (userId: string, moduleId: number, completed: boolean) => Promise<void>;
  isUpdatingModule?: boolean;
}

export default function LearnerProfileModal({
  user,
  onClose,
  onToggleModuleCompletion,
  isUpdatingModule = false,
}: LearnerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"transcript" | "certificate" | "analytics" | "audit">("transcript");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "L";

  const isFullComplete = user.completedCount === courseModules.length;
  const certificateId = `SLC-2026-${user.id.slice(0, 8).toUpperCase()}`;
  const isAdmin = user.email.toLowerCase().includes("admin") || user.email === "brucemabasa4@gmail.com";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportProfileJson = () => {
    const data = JSON.stringify(user, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learner-profile-${user.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Profile Exported",
      description: `Downloaded JSON dossier for ${user.name}.`,
    });
  };

  // Prepare chart data for Analytics tab
  const quizChartData = courseModules.map((m) => {
    const q = user.quizScores[m.id];
    const score = q && q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;
    const hasAttempt = Boolean(q);
    return {
      moduleName: `M${m.id}`,
      fullName: m.title,
      score: hasAttempt ? score : 0,
      hasAttempt,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-neutral-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="learner-profile-title"
    >
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Profile Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pr-8">
            {/* Avatar Initials */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-md border-2 border-white dark:border-neutral-800">
                {initials}
              </div>
              {isFullComplete && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-neutral-900"
                  title="Certified Graduate"
                >
                  <Award className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Identity & Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2
                  id="learner-profile-title"
                  className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight truncate"
                >
                  {user.name}
                </h2>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Administrator
                  </span>
                ) : isFullComplete ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Certified Graduate
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Clock className="w-3 h-3" />
                    Active Learner
                  </span>
                )}
              </div>

              {/* Email & Copy */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium truncate"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {user.email}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, "Email")}
                  className="p-1 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  title="Copy email"
                >
                  {copiedField === "Email" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/60 px-2 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3 shrink-0" />
                  Enrolled:{" "}
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(user.id, "User UID")}
                  className="flex items-center gap-1 bg-neutral-200/50 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-2 py-0.5 rounded-md font-mono text-[10px] transition-colors"
                  title="Click to copy UID"
                >
                  UID: {user.id.slice(0, 8)}...
                  {copiedField === "User UID" ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-5">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Course Progress
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                  {user.completedCount} / {courseModules.length}
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  ({Math.round((user.completedCount / courseModules.length) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(user.completedCount / courseModules.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Average Quiz Score
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-base sm:text-lg font-black ${
                    user.averageQuizScore >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : user.averageQuizScore >= 50
                      ? "text-amber-500 dark:text-amber-400"
                      : user.averageQuizScore > 0
                      ? "text-destructive"
                      : "text-neutral-400"
                  }`}
                >
                  {user.averageQuizScore > 0 ? `${user.averageQuizScore}%` : "No Attempts"}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-2 truncate">
                {user.averageQuizScore >= 80 ? "Passing with Distinction" : user.averageQuizScore > 0 ? "Satisfactory" : "Pending Quizzes"}
              </p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Certificate Status
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isFullComplete ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {isFullComplete ? "Issued & Verified" : `${courseModules.length - user.completedCount} modules left`}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-2 font-mono truncate">
                {isFullComplete ? certificateId : "Incomplete"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 bg-white dark:bg-neutral-900 overflow-x-auto shrink-0">
          {[
            { id: "transcript", label: "Module Transcript", icon: FileText },
            { id: "certificate", label: "Certificate & Award", icon: Award },
            { id: "analytics", label: "Score Analytics", icon: BarChart3 },
            { id: "audit", label: "Administrative Dossier", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CURRICULUM TRANSCRIPT */}
          {activeTab === "transcript" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Curriculum Progress & Quizzes
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Review and manage module clearance states and quiz results for this learner.
                  </p>
                </div>
                {onToggleModuleCompletion && (
                  <span className="text-[11px] text-neutral-400 hidden sm:inline-block">
                    Click checkboxes to toggle module completion
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {courseModules.map((module) => {
                  const isCompleted = user.completedModules.includes(module.id);
                  const quiz = user.quizScores[module.id];
                  const timestamp = user.moduleTimestamps?.[module.id];

                  return (
                    <div
                      key={module.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCompleted
                          ? "bg-white dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-800 shadow-2xs"
                          : "bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200/50 dark:border-neutral-800/50 opacity-80"
                      }`}
                    >
                      {/* Left: Checkbox, Module icon, Title */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        {onToggleModuleCompletion && (
                          <button
                            type="button"
                            onClick={() => onToggleModuleCompletion(user.id, module.id, !isCompleted)}
                            disabled={isUpdatingModule}
                            className="mt-0.5 sm:mt-0 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                            title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                          >
                            {isCompleted ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                            )}
                          </button>
                        )}

                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-800"
                          }`}
                        >
                          M{module.id}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                              {module.title}
                            </p>
                            {isCompleted && (
                              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                            {module.subtitle}
                          </p>
                          {timestamp && (
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              Completed: {new Date(timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Quiz Assessment Pill */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                        {module.quiz ? (
                          quiz ? (
                            <div className="text-right">
                              <div className="flex items-center sm:justify-end gap-1.5">
                                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                  Score: {quiz.score}/{quiz.total}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                    quiz.score / quiz.total >= 0.8
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : quiz.score / quiz.total >= 0.5
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : "bg-destructive/10 text-destructive"
                                  }`}
                                >
                                  {Math.round((quiz.score / quiz.total) * 100)}%
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-400 block mt-0.5">
                                Knowledge Check Passed
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                              Quiz Not Attempted
                            </span>
                          )
                        ) : (
                          <span className="text-[11px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 px-2 py-1 rounded-md">
                            No Quiz Required
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATE & AWARD */}
          {activeTab === "certificate" && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-blue-950/20 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                        Certificate of Achievement
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Storyline Coder Kit: Coding Basics for Instructional Designers
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isFullComplete
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {isFullComplete ? "Verified & Certified" : "Pending Completion"}
                  </span>
                </div>

                <div className="py-6 text-center space-y-2">
                  <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                    Awarded To
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 dark:text-white tracking-tight">
                    {user.name}
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                    For successfully mastering HTML5, modern CSS layouts, JavaScript functions, and Articulate Storyline JS APIs.
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/40">
                    <span className="text-neutral-500 dark:text-neutral-400">Credential ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(certificateId, "Credential ID")}
                      className="font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      {certificateId}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/40">
                    <span className="text-neutral-500 dark:text-neutral-400">Completion Status:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {isFullComplete ? "All 7 Modules Complete" : `${user.completedCount} of 7 Completed`}
                    </span>
                  </div>
                </div>
              </div>

              {!isFullComplete && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Learner has {courseModules.length - user.completedCount} remaining module(s) to clear before certification is issued.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCORE ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs">
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Module Assessment Scores (% Correct)
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Performance distribution across all course quizzes.
                  </p>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quizChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="moduleName" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="p-2 rounded-lg bg-neutral-900 text-white text-xs shadow-md">
                                <p className="font-bold">{data.fullName}</p>
                                <p className="text-neutral-300">
                                  {data.hasAttempt ? `Score: ${data.score}%` : "No quiz attempt recorded"}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {quizChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              !entry.hasAttempt
                                ? "#94a3b8"
                                : entry.score >= 80
                                ? "#10b981"
                                : entry.score >= 50
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistical Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Quizzes Taken</span>
                  <span className="text-base font-extrabold text-neutral-800 dark:text-white">
                    {Object.keys(user.quizScores).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Avg Grade</span>
                  <span className="text-base font-extrabold text-neutral-800 dark:text-white">
                    {user.averageQuizScore > 0 ? `${user.averageQuizScore}%` : "—"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Passed (&gt;=50%)</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {Object.values(user.quizScores).filter((q) => q.score / q.total >= 0.5).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">100% Scores</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {Object.values(user.quizScores).filter((q) => q.score === q.total).length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMINISTRATIVE DOSSIER */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Firestore Document Records
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                    <span className="text-neutral-500">Firestore Profile ID:</span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[200px] sm:max-w-none">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                    <span className="text-neutral-500">Registered Display Name:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                    <span className="text-neutral-500">Account Creation Timestamp:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {user.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                    <span className="text-neutral-500">Progress Documents Logged:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {user.completedModules.length} record(s)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExportProfileJson}
                    className="text-xs flex items-center gap-1.5 h-8"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Full JSON Dossier
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(JSON.stringify(user, null, 2), "Raw JSON")}
                    className="text-xs flex items-center gap-1.5 h-8"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Raw Profile JSON
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/40 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Learner UID: {user.id.slice(0, 12)}...
          </span>
          <Button
            onClick={onClose}
            size="sm"
            className="h-9 px-4 text-xs font-semibold"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
