"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CopilotChat({ userName, matchCount }: { userName: string; matchCount: number }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${userName}! I found ${matchCount} programs for you. Ask me anything about your matches!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage, type: "general" }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex-1 overflow-y-auto rounded-lg bg-gray-50 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 rounded-lg p-3 text-sm ${
              msg.role === "assistant"
                ? "bg-blue-100"
                : "ml-8 bg-white"
            }`}
          >
            <p
              className={`font-medium ${
                msg.role === "assistant" ? "text-blue-900" : "text-gray-900"
              }`}
            >
              {msg.role === "assistant" ? "Copilot" : "You"}
            </p>
            <p
              className={`mt-1 whitespace-pre-wrap ${
                msg.role === "assistant" ? "text-blue-800" : "text-gray-800"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="mb-3 rounded-lg bg-blue-100 p-3 text-sm">
            <p className="font-medium text-blue-900">Copilot</p>
            <p className="mt-1 text-blue-800">Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about programs, documents, or deadlines..."
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </form>
    </div>
  );
}

