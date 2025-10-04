"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  evaluateConversation,
  getCase,
  EvaluationResult,
  Case,
  ChatMessage,
} from "@/lib/api";
import Loader from "../chat/components/Loader";
import {
  ArrowLeft,
  Home,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const caseId = searchParams.get("caseId");

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !caseId) {
      router.push("/");
      return;
    }

    const fetchEvaluation = async () => {
      try {
        // Get case data
        const caseResponse = await getCase(caseId);
        setCaseData(caseResponse);

        // Get messages from session storage (if available)
        // In a real app, you'd fetch this from the backend
        const storedMessages = sessionStorage.getItem(`messages_${sessionId}`);
        let messages: ChatMessage[] = [];

        if (storedMessages) {
          messages = JSON.parse(storedMessages);
        } else {
          // Fallback: create dummy messages for evaluation
          messages = [
            {
              role: "user",
              content: "Hello, can you tell me about your symptoms?",
            },
            {
              role: "assistant",
              content: "I have been experiencing chest pain.",
            },
          ];
        }

        // Evaluate conversation
        const result = await evaluateConversation(sessionId, caseId, messages);
        setEvaluation(result);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load evaluation");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [sessionId, caseId, router]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !evaluation || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg">
          <p className="font-medium">
            {error || "Failed to load evaluation results"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-red-800 dark:text-red-100 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const scores = evaluation.scores;
  const criteriaNames = {
    rapport_building: "Rapport Building & Therapeutic Alliance",
    active_listening_empathy: "Active Listening & Empathy",
    psychiatric_history: "Psychiatric History Taking",
    risk_assessment: "Risk Assessment",
    biopsychosocial_assessment: "Biopsychosocial Assessment",
    communication_skills: "Communication Skills",
    cultural_sensitivity: "Cultural Sensitivity & Respect",
    interview_structure: "Interview Structure & Completeness",
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cases
          </button>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Interview Evaluation
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Case: {caseData.patient_name} ({caseData.chief_complaint})
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-1">
                  {scores.overall_score.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Detailed Scores
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(criteriaNames).map(([key, label]) => {
              const score = scores[key as keyof typeof scores];
              return (
                <div
                  key={key}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {label}
                    </span>
                    <span
                      className={`text-2xl font-bold ${getScoreColor(score)}`}
                    >
                      {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getScoreBackground(
                        score
                      )}`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Strengths
            </h2>
          </div>
          <ul className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-600 mr-2">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-yellow-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Areas for Improvement
            </h2>
          </div>
          <ul className="space-y-2">
            {evaluation.areas_for_improvement.map((area, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="text-yellow-600 mr-2">→</span>
                {area}
              </li>
            ))}
          </ul>
        </div>

        {/* Feedback */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detailed Feedback
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {evaluation.feedback}
          </p>
        </div>

        {/* Conversation Metrics (CureFun Paper Methodology) */}
        {evaluation.metrics && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Conversation Analytics
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Non-scoring metrics based on CureFun paper methodology
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Information Density
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {(evaluation.metrics.information_density * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Medical terminology usage in conversation
                </p>
              </div>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Emotional Tendency
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {evaluation.metrics.emotional_tendency > 0 ? "+" : ""}
                    {evaluation.metrics.emotional_tendency.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Friendliness and empathy in communication (-1 to +1)
                </p>
              </div>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Avg Response Length
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {evaluation.metrics.response_length.toFixed(0)} words
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average length of your questions/responses
                </p>
              </div>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Interview Length
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    {evaluation.metrics.turn_number} turns
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total conversational exchanges
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Try Another Case
          </button>
          <button
            onClick={() => router.push(`/chat?caseId=${caseId}`)}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retry This Case
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
