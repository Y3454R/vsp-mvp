"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCases, Case } from "@/lib/api";
import { Activity, BookOpen, Brain, ArrowRight } from "lucide-react";

export default function Home() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getAllCases();
        setCases(data);
      } catch (err) {
        setError("Failed to load cases. Make sure the backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleStartCase = (caseId: string) => {
    router.push(`/chat?caseId=${caseId}`);
  };

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Activity className="w-12 h-12 text-primary-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              VSP Chatbot
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practice your psychiatric interviewing skills with AI-powered
            virtual mental health patients
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <BookOpen className="w-10 h-10 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Realistic Cases
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice with diverse mental health cases based on real
              psychiatric presentations
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <Brain className="w-10 h-10 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Natural conversations powered by advanced AI language models
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <Activity className="w-10 h-10 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instant Feedback
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get detailed evaluation and feedback on your interview technique
            </p>
          </div>
        </div>

        {/* Cases */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Available Cases
          </h2>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && cases.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-center py-8">
              No cases available. Check your backend configuration.
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleStartCase(caseItem.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {caseItem.patient_name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      caseItem.difficulty_level
                    )}`}
                  >
                    {caseItem.difficulty_level}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {caseItem.age} year old {caseItem.gender}
                </p>
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-4">
                  Chief Complaint: {caseItem.chief_complaint}
                </p>
                <button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCase(caseItem.id);
                  }}
                >
                  Start Interview
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
