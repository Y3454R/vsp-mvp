"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getCase, sendMessage, Case, ChatMessage } from "@/lib/api";
import MessageBubble from "./components/MessageBubble";
import Loader from "./components/Loader";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [sessionId] = useState(() => uuidv4());
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseId) {
      router.push("/");
      return;
    }

    const fetchCase = async () => {
      try {
        const data = await getCase(caseId);
        setCaseData(data);

        // Add initial greeting from patient
        const greeting: ChatMessage = {
          role: "assistant",
          content: `Hello, I'm ${
            data.patient_name
          }. I'm here today because ${data.chief_complaint.toLowerCase()}. How can I help you understand my situation?`,
        };
        setMessages([greeting]);
      } catch (err) {
        setError("Failed to load case data");
        console.error(err);
      }
    };

    fetchCase();
  }, [caseId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Save messages to sessionStorage for evaluation
    if (messages.length > 0) {
      sessionStorage.setItem(`messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !caseId || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendMessage({
        session_id: sessionId,
        case_id: caseId,
        message: userMessage.content,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = () => {
    if (messages.length <= 1) {
      alert("Please have a conversation before ending the interview.");
      return;
    }

    router.push(`/results?sessionId=${sessionId}&caseId=${caseId}`);
  };

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cases
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interview with {caseData.patient_name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {caseData.age} year old {caseData.gender} •{" "}
                {caseData.chief_complaint}
              </p>
            </div>
            <button
              onClick={handleEndInterview}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              End Interview
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              patientName={caseData.patient_name}
            />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
                <Loader size="sm" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-t border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">{error}</div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question or response..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
