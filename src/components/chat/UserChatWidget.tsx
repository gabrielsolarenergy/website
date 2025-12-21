import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChatConnection, getToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  user_id: string;
  name: string;
  text: string;
  is_admin: boolean;
  created_at: string;
}

export const UserChatWidget = () => {
  // Extragem starea de autentificare și datele userului
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Deschide conexiunea WebSocket doar dacă chat-ul este deschis ȘI userul este logat
  useEffect(() => {
    if (isOpen && isAuthenticated && user && !connectionRef.current) {
      setIsConnecting(true);
      const token = getToken();

      if (!token) {
        setIsConnecting(false);
        return;
      }

      // Conectare la camera proprie (room_user_id în backend va fi user.id)
      const conn = createChatConnection(
        user.id,
        token,
        (msg) => {
          setMessages((prev) => [...prev, msg]);
        },
        (error) => {
          console.error("Chat error:", error);
          setIsConnected(false);
        },
        () => {
          setIsConnected(false);
          connectionRef.current = null;
        }
      );

      connectionRef.current = conn;
      setIsConnected(true);
      setIsConnecting(false);
    }

    // Închidem conexiunea când widget-ul se închide pentru a economisi resurse
    return () => {
      if (connectionRef.current && !isOpen) {
        connectionRef.current.close();
        connectionRef.current = null;
      }
    };
  }, [isOpen, isAuthenticated, user]);

  const handleSend = () => {
    if (!newMessage.trim() || !connectionRef.current) return;

    // Trimitem mesajul prin WebSocket (Backend-ul îl va salva în DB)
    connectionRef.current.send(newMessage);
    setNewMessage("");
  };

  // --- GARDA DE SECURITATE ---
  // Dacă utilizatorul NU este logat, componenta nu randează absolut nimic
  if (!isAuthenticated) return null;

  // Varianta când chat-ul este închis (doar butonul plutitor)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
        {/* Notificare pentru mesaje noi de la admin */}
        {messages.some((m) => m.is_admin) && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">
            !
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[55] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300 flex flex-col",
        isMinimized ? "w-80 h-14" : "w-96 h-[500px]"
      )}
    >
      {/* Header-ul Chat-ului */}
      <div className="bg-primary p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground text-sm">
              Suport Gabriel Solar
            </h3>
            <p className="text-[10px] text-primary-foreground/80">
              {isConnected
                ? "● Online"
                : isConnecting
                ? "Se conectează..."
                : "Deconectat"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Zona de Mesaje */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {isConnecting && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {!isConnecting && messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Cum te putem ajuta?</p>
                <p className="text-xs opacity-60">
                  Echipa noastră este aici pentru tine.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.is_admin
                    ? "justify-start"
                    : "justify-end flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    msg.is_admin
                      ? "bg-white border border-border rounded-bl-none text-foreground"
                      : "bg-primary text-primary-foreground rounded-br-none"
                  )}
                >
                  <p>{msg.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1 text-right",
                      msg.is_admin
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    )}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Zona de Input */}
          <div className="p-4 border-t border-border bg-card shrink-0">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrie un mesaj..."
                className="flex-1 text-sm"
                disabled={!isConnected}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={!newMessage.trim() || !isConnected}
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserChatWidget;
