import { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { courseModules } from "@/data/courseData";
import LearnerProfileModal, { UserSummary } from "./LearnerProfileModal";
import {
  Users,
  User,
  BookOpen,
  Award,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  Database,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  onBackToCourse: () => void;
  adminEmail: string;
  onMenuOpen?: () => void;
}

interface Profile {
  id: string;
  display_name?: string | null;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CourseProgressRecord {
  id?: string;
  user_id: string;
  module_id: number;
  completed: boolean;
  completed_at?: string | null;
  quiz_score?: number | null;
  quiz_total?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Fallback / Demo data in case Supabase is empty
const demoProfiles = [
  { id: "demo-1", display_name: "Sarah Jenkins | sarah.j@example.com", created_at: "2026-07-10T14:22:00Z" },
  { id: "demo-2", display_name: "David Koko | david.koko@example.com", created_at: "2026-07-12T09:15:00Z" },
  { id: "demo-3", display_name: "Bruce Mabasa | brucemabasa4@gmail.com", created_at: "2026-07-01T08:00:00Z" },
  { id: "demo-4", display_name: "Lerato Mokoena | lerato.m@example.com", created_at: "2026-07-15T11:45:00Z" },
  { id: "demo-5", display_name: "John Miller | john.miller@example.com", created_at: "2026-07-16T16:30:00Z" },
  { id: "demo-6", display_name: "Emily Watson | emily.w@example.com", created_at: "2026-07-17T02:10:00Z" },
];

const demoProgress = [
  // Sarah Jenkins - completed all
  { user_id: "demo-1", module_id: 1, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-1", module_id: 2, completed: true, quiz_score: 2, quiz_total: 3 },
  { user_id: "demo-1", module_id: 3, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-1", module_id: 4, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-1", module_id: 5, completed: true, quiz_score: 2, quiz_total: 3 },
  { user_id: "demo-1", module_id: 6, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-1", module_id: 7, completed: true, quiz_score: null, quiz_total: null },

  // David Koko - in progress (completed 4 modules)
  { user_id: "demo-2", module_id: 1, completed: true, quiz_score: 2, quiz_total: 3 },
  { user_id: "demo-2", module_id: 2, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-2", module_id: 3, completed: true, quiz_score: 1, quiz_total: 3 },
  { user_id: "demo-2", module_id: 4, completed: true, quiz_score: 2, quiz_total: 3 },

  // Bruce Mabasa (Admin as user) - completed all with high scores
  { user_id: "demo-3", module_id: 1, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 2, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 3, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 4, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 5, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 6, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-3", module_id: 7, completed: true, quiz_score: null, quiz_total: null },

  // Lerato Mokoena - completed 2 modules
  { user_id: "demo-4", module_id: 1, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-4", module_id: 2, completed: true, quiz_score: 2, quiz_total: 3 },

  // John Miller - completed 5 modules
  { user_id: "demo-5", module_id: 1, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-5", module_id: 2, completed: true, quiz_score: 1, quiz_total: 3 },
  { user_id: "demo-5", module_id: 3, completed: true, quiz_score: 2, quiz_total: 3 },
  { user_id: "demo-5", module_id: 4, completed: true, quiz_score: 3, quiz_total: 3 },
  { user_id: "demo-5", module_id: 5, completed: true, quiz_score: 2, quiz_total: 3 },

  // Emily Watson - completed 1 module
  { user_id: "demo-6", module_id: 1, completed: true, quiz_score: 2, quiz_total: 3 },
];

export default function AdminDashboard({ onBackToCourse, adminEmail, onMenuOpen }: AdminDashboardProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [progress, setProgress] = useState<CourseProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "In Progress">("All");
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "progress" | "score">("progress");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [useTestData, setUseTestData] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const profilesSnap = await getDocs(collection(db, "profiles"));
      const profilesData = profilesSnap.docs.map(doc => doc.data() as Profile);

      const progressSnap = await getDocs(collection(db, "course_progress"));
      const progressData = progressSnap.docs.map(doc => doc.data() as CourseProgressRecord);

      setProfiles(profilesData || []);
      setProgress(progressData || []);
      setUseTestData(false);
    } catch (err: unknown) {
      console.warn("Failed to load live data, falling back to demo data.", err);
      setProfiles(demoProfiles);
      setProgress(demoProgress);
      setUseTestData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleDemoData = () => {
    if (useTestData) {
      // Try live data
      loadData();
    } else {
      setProfiles(demoProfiles);
      setProgress(demoProgress);
      setUseTestData(true);
      toast({
        title: "Switched to Demo/Sandbox Data",
        description: "You are now viewing pre-populated user accounts and progress trends.",
      });
    }
  };

  const [isUpdatingModule, setIsUpdatingModule] = useState(false);

  const handleToggleModuleCompletion = async (userId: string, moduleId: number, completed: boolean) => {
    setIsUpdatingModule(true);
    try {
      const progressId = `${userId}_${moduleId}`;
      const progressRef = doc(db, "course_progress", progressId);
      const timestamp = completed ? new Date().toISOString() : null;

      await setDoc(
        progressRef,
        {
          user_id: userId,
          module_id: moduleId,
          completed,
          completed_at: timestamp,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      // Update local progress state
      setProgress((prev) => {
        const existingIndex = prev.findIndex((p) => p.user_id === userId && p.module_id === moduleId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            completed,
            completed_at: timestamp,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              user_id: userId,
              module_id: moduleId,
              completed,
              completed_at: timestamp,
            },
          ];
        }
      });

      // Update selectedUser if currently open
      setSelectedUser((prev) => {
        if (!prev || prev.id !== userId) return prev;
        const newCompleted = completed
          ? Array.from(new Set([...prev.completedModules, moduleId]))
          : prev.completedModules.filter((id) => id !== moduleId);
        const newTimestamps = { ...(prev.moduleTimestamps || {}) };
        if (completed && timestamp) {
          newTimestamps[moduleId] = timestamp;
        } else {
          delete newTimestamps[moduleId];
        }
        return {
          ...prev,
          completedModules: newCompleted,
          completedCount: newCompleted.length,
          status: newCompleted.length >= courseModules.length ? "Completed" : "In Progress",
          moduleTimestamps: newTimestamps,
        };
      });

      toast({
        title: "Learner Record Updated",
        description: `Module ${moduleId} marked as ${completed ? "Completed" : "Incomplete"}.`,
      });
    } catch (err) {
      console.error("Error updating learner progress:", err);
      toast({
        title: "Update Failed",
        description: "Could not write changes to database.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingModule(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("is_admin");
      localStorage.removeItem("guest_name");
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Compile user summaries
  const userSummaries: UserSummary[] = profiles.map((p) => {
    const parts = (p.display_name || "").split(" | ");
    const name = parts[0] || "Unnamed Student";
    const email = parts[1] || p.email || "No email";

    const userProgress = progress.filter((pr) => pr.user_id === p.id && pr.completed);
    const completedModulesList = userProgress.map((pr) => pr.module_id);
    const completedCount = completedModulesList.length;

    const quizScores: { [moduleId: number]: { score: number; total: number } } = {};
    const moduleTimestamps: { [moduleId: number]: string } = {};
    let totalQuizScore = 0;
    let quizCount = 0;

    userProgress.forEach((pr) => {
      if (pr.completed_at) {
        moduleTimestamps[pr.module_id] = pr.completed_at;
      }
      if (pr.quiz_score !== null && pr.quiz_total !== null) {
        quizScores[pr.module_id] = {
          score: pr.quiz_score,
          total: pr.quiz_total,
        };
        const percent = pr.quiz_total > 0 ? (pr.quiz_score / pr.quiz_total) * 100 : 0;
        totalQuizScore += percent;
        quizCount++;
      }
    });

    const averageQuizScore = quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0;
    const status = completedCount >= courseModules.length ? "Completed" : "In Progress";

    return {
      id: p.id,
      name,
      email,
      createdAt: p.created_at || new Date().toISOString(),
      completedCount,
      completedModules: completedModulesList,
      quizScores,
      averageQuizScore,
      status,
      moduleTimestamps,
    };
  });

  // Overall calculations
  const totalUsersCount = userSummaries.length;
  const completedUsersCount = userSummaries.filter((u) => u.status === "Completed").length;
  const completionRate = totalUsersCount > 0 ? Math.round((completedUsersCount / totalUsersCount) * 100) : 0;

  let overallQuizScoreSum = 0;
  let activeQuizzesCount = 0;
  userSummaries.forEach((u) => {
    if (u.averageQuizScore > 0) {
      overallQuizScoreSum += u.averageQuizScore;
      activeQuizzesCount++;
    }
  });
  const averageOverallQuizScore = activeQuizzesCount > 0 ? Math.round(overallQuizScoreSum / activeQuizzesCount) : 0;

  const totalModulesCompletedAcrossAll = userSummaries.reduce((acc, curr) => acc + curr.completedCount, 0);

  // Sorting and Filtering
  const filteredUsers = userSummaries
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (statusFilter === "All") return matchSearch;
      return matchSearch && u.status === statusFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "progress") {
        comparison = a.completedCount - b.completedCount;
      } else if (sortBy === "score") {
        comparison = a.averageQuizScore - b.averageQuizScore;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: "name" | "progress" | "score") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Chart data calculations
  // 1. Completion Rate per Module
  const moduleCompletionData = courseModules.map((m) => {
    const completedCount = userSummaries.filter((u) => u.completedModules.includes(m.id)).length;
    const ratePercent = totalUsersCount > 0 ? Math.round((completedCount / totalUsersCount) * 100) : 0;
    return {
      name: `M${m.id}`,
      title: m.title,
      "Completed Users": completedCount,
      "Completion Rate (%)": ratePercent,
    };
  });

  // 2. Average Quiz Scores per Module
  const quizScoresData = courseModules
    .filter((m) => !!m.quiz)
    .map((m) => {
      let totalScorePercent = 0;
      let count = 0;

      userSummaries.forEach((u) => {
        const quiz = u.quizScores[m.id];
        if (quiz && quiz.total > 0) {
          totalScorePercent += (quiz.score / quiz.total) * 100;
          count++;
        }
      });

      return {
        name: `M${m.id}`,
        title: m.title,
        "Average Score (%)": count > 0 ? Math.round(totalScorePercent / count) : 0,
      };
    });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 overflow-y-auto">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-20 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {onMenuOpen && (
              <button
                onClick={onMenuOpen}
                className="lg:hidden w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Open course navigation menu"
              >
                <Menu className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              </button>
            )}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
                Admin Command Center
              </h1>
              <p className="text-[10px] md:text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest truncate">
                Instructor Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onBackToCourse}
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 font-semibold text-xs border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Course View</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8 animate-fade-in">
        {/* Banner with controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-transparent border border-blue-200/40 dark:border-blue-900/30 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Live Class Overview
              </p>
            </div>
            <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
              Logged in as Admin: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{adminEmail}</span>
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <Button
              onClick={handleToggleDemoData}
              variant="outline"
              size="sm"
              className={`h-9 text-xs font-semibold rounded-lg ${
                useTestData
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800"
              }`}
            >
              {useTestData ? "Showing Sandbox Data (Click to reload Live)" : "Load Sandbox Demo Data"}
            </Button>

            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="h-9 gap-1 text-xs font-semibold"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Total Students
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {totalUsersCount}
            </p>
            <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Registered learners
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Completion Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {completionRate}%
            </p>
            <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {completedUsersCount} / {totalUsersCount} graduated
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Total Modules Finished
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {totalModulesCompletedAcrossAll}
            </p>
            <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Completed learning segments
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Avg Quiz Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {averageOverallQuizScore}%
            </p>
            <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Overall understanding score
            </p>
          </div>
        </div>

        {/* Visual Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Module Completion Bar Chart */}
          <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Module Completion Rate
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Percentage of all registered students who have marked each module as completed.
            </p>
            <div className="h-64 sm:h-72 w-full">
              {totalUsersCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#888888", fontSize: 11, fontWeight: 500 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fill: "#888888", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                      }}
                      labelFormatter={(value, name) => {
                        const m = courseModules.find((x) => `M${x.id}` === value);
                        return m ? `Module ${m.id}: ${m.title}` : value;
                      }}
                    />
                    <Bar dataKey="Completion Rate (%)" fill="#2563eb" radius={[4, 4, 0, 0]}>
                      {moduleCompletionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "rgb(37, 99, 235)" : "rgb(59, 130, 246)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Quiz Success Rate Line Chart */}
          <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Quiz Performance Trend
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Average score percentage for the knowledge check at the end of each module.
            </p>
            <div className="h-64 sm:h-72 w-full">
              {quizScoresData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quizScoresData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#888888", fontSize: 11, fontWeight: 500 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fill: "#888888", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "12px",
                      }}
                      labelFormatter={(value) => {
                        const m = courseModules.find((x) => `M${x.id}` === value);
                        return m ? `Module ${m.id}: ${m.title}` : value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Average Score (%)"
                      stroke="#10b981"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Users Table / List section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm overflow-hidden">
          {/* Controls bar */}
          <div className="p-5 md:p-6 border-b border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                Registered Learner Records
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Monitor and review learner status, module completions, and final quiz assessments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-neutral-800 dark:text-white"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                {(["All", "Completed", "In Progress"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === opt
                        ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-neutral-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-neutral-400" />
                <p className="text-sm">Syncing with secure server databases...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">No matches found</p>
                <p className="text-xs">Try adjusting your search filters or add Sandbox Demo Data.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 dark:bg-neutral-900/50 text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase border-b border-neutral-100 dark:border-neutral-800 tracking-wider">
                    <th
                      className="py-4 px-6 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors select-none"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Learner Profile
                        {sortBy === "name" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center">Registration</th>
                    <th
                      className="py-4 px-6 text-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors select-none"
                      onClick={() => handleSort("progress")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Completed Modules
                        {sortBy === "progress" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="py-4 px-6">Module Checklist</th>
                    <th
                      className="py-4 px-6 text-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors select-none"
                      onClick={() => handleSort("score")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Avg Quiz Score
                        {sortBy === "score" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Individual Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs sm:text-sm">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="text-left group flex items-center gap-2.5 hover:opacity-90 transition-opacity"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                              {user.email}
                            </div>
                          </div>
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 text-center text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center justify-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Completed Modules count */}
                      <td className="py-4 px-6 text-center font-bold text-neutral-800 dark:text-white">
                        <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
                          {user.completedCount} / 7
                        </span>
                      </td>

                      {/* Visual Modules tracker */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                            const completed = user.completedModules.includes(num);
                            return (
                              <div
                                key={num}
                                className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                  completed
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border border-transparent"
                                }`}
                                title={`Module ${num}: ${completed ? "Completed" : "Not Finished"}`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Quiz Scores */}
                      <td className="py-4 px-6 text-center">
                        {user.averageQuizScore > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              user.averageQuizScore >= 80
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : user.averageQuizScore >= 50
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {user.averageQuizScore}%
                          </span>
                        ) : (
                          <span className="text-neutral-400 dark:text-neutral-600">—</span>
                        )}
                      </td>

                      {/* Completion status */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {user.status === "Completed" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          )}
                          {user.status}
                        </span>
                      </td>

                      {/* View Profile Button */}
                      <td className="py-4 px-6 text-right">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          size="sm"
                          className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 rounded-lg text-xs shadow-2xs transition-all"
                          id={`view-profile-btn-${user.id}`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Individual Learner Profile Modal */}
      <LearnerProfileModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleModuleCompletion={handleToggleModuleCompletion}
        isUpdatingModule={isUpdatingModule}
      />
    </div>
  );
}
