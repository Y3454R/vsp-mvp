import { ChatMessage } from "@/lib/api";
import { User, Stethoscope } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  patientName: string;
}

export default function MessageBubble({
  message,
  patientName,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-3 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary-600 text-white" : "bg-green-600 text-white"
          }`}
        >
          {isUser ? (
            <User className="w-6 h-6" />
          ) : (
            <Stethoscope className="w-6 h-6" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {isUser ? "You (Student)" : patientName}
          </div>
          <div
            className={`rounded-lg p-4 ${
              isUser
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
