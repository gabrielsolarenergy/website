import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Headphones,
  ArrowLeft,
  Minimize2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createChatConnection, getToken, API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

const ChatWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<"select" | "bot" | "support">("select");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [connection, setConnection] = useState<any>(null);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRemoteTyping, isOpen]);

  useEffect(() => {
    if (mode === "support" && isAuthenticated && user) {
      // 1. Încărcare istoric (folosim ruta de bază fără offset pentru început)
      const fetchHistory = async () => {
        try {
          const res = await fetch(
            `${API_URL}/chat/history/${user.id}?limit=50&offset=0`,
            {
              headers: { Authorization: `Bearer ${getToken()}` },
            }
          );
          const data = await res.json();

          if (Array.isArray(data)) {
            setMessages(data); // Backend-ul returnează deja formatul corect
          }
        } catch (e) {
          console.error("Eroare la încărcarea istoricului:", e);
        }
      };

      fetchHistory();

      // 2. Conectare WebSocket
      const conn = createChatConnection(
        user.id,
        getToken()!,
        (msg) => {
          if (msg.type === "typing") {
            // Verificăm dacă altcineva scrie (adminul)
            if (msg.user_id !== String(user.id))
              setIsRemoteTyping(msg.is_typing);
          } else {
            setMessages((prev) => {
              // Prevenim duplicatele dacă mesajul vine prin WS imediat după fetch
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        },
        () => {},
        () => setConnection(null)
      );
      setConnection(conn);
      return () => conn.close();
    }
  }, [mode, isAuthenticated, user]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (connection) {
      connection.send({ type: "typing", is_typing: val.length > 0 });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        connection.send({ type: "typing", is_typing: false });
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !connection) return;
    connection.send({ type: "message", text: inputValue });
    setInputValue("");
  };

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#1a4925] rounded-full shadow-2xl text-white flex items-center justify-center z-50 hover:scale-110 transition-all"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50 transition-all duration-300",
        isMinimized ? "h-20" : "h-[600px]"
      )}
    >
      <div className="bg-[#1a4925] p-5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          {mode !== "select" && (
            <button
              onClick={() => setMode("select")}
              className="hover:bg-white/20 p-1.5 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-bold text-sm">Suport Gabriel Solar</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {mode === "select" ? (
              <div className="space-y-4 pt-10">
                <Button
                  className="w-full h-16 justify-start gap-4"
                  variant="outline"
                  onClick={() => setMode("bot")}
                >
                  <Bot /> Chat Bot AI
                </Button>
                <Button
                  className="w-full h-16 justify-start gap-4 font-bold"
                  variant="outline"
                  disabled={!isAuthenticated}
                  onClick={() => setMode("support")}
                >
                  <Headphones /> Specialist Live
                </Button>
                {!isAuthenticated && (
                  <div className="flex items-center gap-2 justify-center p-4 bg-red-50 rounded-xl">
                    <Lock className="w-3 h-3 text-red-500" />
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                      Autentifică-te pentru suport live
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      m.is_admin ? "items-start" : "ml-auto items-end"
                    )}
                  >
                    <span className="text-[8px] font-black uppercase opacity-20 mb-1 px-1">
                      {m.is_admin ? "Echipă Gabriel Solar" : "Tu"}
                    </span>
                    <div
                      className={cn(
                        "p-4 rounded-2xl text-sm font-medium shadow-sm",
                        m.is_admin
                          ? "bg-white border rounded-tl-none"
                          : "bg-[#1a4925] text-white rounded-tr-none"
                      )}
                    >
                      {m.text || m.message}
                    </div>
                  </div>
                ))}
                {isRemoteTyping && (
                  <div className="text-[10px] font-bold text-[#1a4925] animate-pulse italic px-2">
                    Echipa Gabriel Solar scrie...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          {mode !== "select" && (
            <div className="p-5 border-t bg-white">
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Scrie un mesaj..."
                  className="border-none bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="rounded-xl h-10 w-10 shrink-0 bg-[#1a4925]"
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
