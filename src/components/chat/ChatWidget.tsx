import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Headphones,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot" | "admin";
  timestamp: Date;
}

type ChatMode = "select" | "bot" | "support";

const quickQuestions = [
  "Ce costă un sistem solar?",
  "Cum funcționează subvențiile?",
  "Cât durează instalarea?",
  "Cum mă pot programa?",
];

const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("pret") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("preț")
  ) {
    return "Sistemele noastre de panouri solare variază între 3.000€ și 25.000€, în funcție de nevoile tale. Dorești o ofertă personalizată gratuită?";
  }
  if (
    lowerMessage.includes("instalar") ||
    lowerMessage.includes("montaj") ||
    lowerMessage.includes("durează")
  ) {
    return "Instalarea durează de obicei între 1 și 3 zile pentru sistemele rezidențiale. Echipa noastră autorizată se ocupă de tot.";
  }
  if (
    lowerMessage.includes("subventie") ||
    lowerMessage.includes("casa verde") ||
    lowerMessage.includes("subvenție")
  ) {
    return "Bună întrebare! România oferă subvenții de până la 90% prin programul Casa Verde. Noi ne ocupăm de documentație.";
  }
  return "Mulțumim pentru întrebare! Dorești să programezi o consultanță gratuită sau să vorbești cu un specialist? Trebuie doar să fii logat în contul tău pentru suport live.";
};

const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
      <Bot className="w-4 h-4 text-primary" />
    </div>
    <div className="bg-white border p-3 rounded-2xl rounded-tl-sm shadow-sm">
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  </div>
);

const ChatWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<ChatMode>("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isMinimized) scrollToBottom();
  }, [messages, isTyping, isMinimized]);

  const initBotChat = () => {
    setMode("bot");
    setMessages([
      {
        id: "1",
        content:
          "Bună! Sunt SolarBot 🤖 Cu ce te pot ajuta astăzi să înveți despre energia solară?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response: Message = {
      id: (Date.now() + 1).toString(),
      content:
        mode === "bot"
          ? getMockResponse(content)
          : "Mulțumesc! Un reprezentant va răspunde în curând.",
      sender: mode === "bot" ? "bot" : "admin",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, response]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-primary rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9999] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300 flex flex-col",
        isMinimized ? "h-16 w-80" : "w-96 h-[550px]"
      )}
    >
      {/* HEADER VERDE PERMANENT */}
      <div className="bg-primary p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 text-white">
          {mode !== "select" && (
            <button
              onClick={() => setMode("select")}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            {mode === "support" ? (
              <Headphones className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">
              {mode === "select"
                ? "Gabriel Solar"
                : mode === "bot"
                ? "SolarBot"
                : "Suport Live"}
            </h3>
            <p className="text-[11px] opacity-90">Disponibil acum</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-white/80">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:text-white p-1"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setMode("select");
              setMessages([]);
            }}
            className="hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* ZONA DE CONȚINUT */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            {mode === "select" ? (
              <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-center text-sm font-medium text-slate-600 mb-2">
                  Cu ce te putem ajuta?
                </p>

                <button
                  onClick={initBotChat}
                  className="w-full p-4 bg-white hover:border-primary border border-slate-200 rounded-xl transition-all flex items-center gap-4 shadow-sm group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Bot className="w-5 h-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-slate-900">
                      Chat cu SolarBot
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Asistență automatizată 24/7
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => isAuthenticated && setMode("support")}
                  className={cn(
                    "w-full p-4 bg-white border border-slate-200 rounded-xl transition-all flex items-center gap-4 shadow-sm group",
                    !isAuthenticated && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    {isAuthenticated ? (
                      <Headphones className="w-5 h-5 text-primary group-hover:text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-slate-900">
                      Suport Live
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isAuthenticated
                        ? "Discută cu un specialist"
                        : "Necesită cont client"}
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 animate-in fade-in duration-300",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                        msg.sender === "user" ? "bg-primary" : "bg-primary/10"
                      )}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl max-w-[80%] text-[13px] shadow-sm font-medium",
                        msg.sender === "user"
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-white border border-slate-100 rounded-tl-none text-slate-800"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* FOOTER (Sugestii doar pt BOT + Input) */}
          {mode !== "select" && (
            <div className="p-4 border-t bg-white shrink-0">
              {/* Sugestiile apar DOAR dacă suntem în modul bot și utilizatorul nu tastează */}
              {mode === "bot" && !inputValue && !isTyping && (
                <div className="flex flex-wrap gap-2 mb-3 animate-in fade-in slide-in-from-bottom-1">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-full transition-all font-bold tracking-tight"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage(inputValue)
                  }
                  placeholder="Scrie un mesaj..."
                  className="bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary h-11 text-sm rounded-xl"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  size="icon"
                  disabled={!inputValue.trim()}
                  className="shrink-0 h-11 w-11 rounded-xl shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWidget;
