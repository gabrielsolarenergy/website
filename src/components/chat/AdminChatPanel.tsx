import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  User,
  Circle,
  Search,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChatConnection, getToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ChatRoom {
  id: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  user_id: string;
  name: string;
  text: string;
  is_admin: boolean;
  created_at: string;
}

// Date Mock pentru demo
const mockRooms: ChatRoom[] = [
  {
    id: "user-1",
    userName: "Maria Popescu",
    lastMessage: "Bună ziua, am o întrebare despre panouri...",
    timestamp: "10:30",
    unread: 2,
    isOnline: true,
  },
  {
    id: "user-2",
    userName: "Ion Ionescu",
    lastMessage: "Mulțumesc pentru oferta trimisă!",
    timestamp: "09:15",
    unread: 0,
    isOnline: false,
  },
];

const AdminChatPanel = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [connection, setConnection] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && user) {
      const token = getToken();
      if (!token) return;

      if (connection) {
        connection.close();
      }

      const conn = createChatConnection(
        selectedRoom.id,
        token,
        (msg) => {
          setMessages((prev) => [...prev, msg]);
        },
        (error) => console.error("Chat error:", error),
        () => console.log("Chat disconnected")
      );

      setConnection(conn);

      return () => {
        conn.close();
      };
    }
  }, [selectedRoom, user]);

  const handleSend = () => {
    if (!newMessage.trim() || !connection) return;
    connection.send(newMessage);
    setNewMessage("");
  };

  const filteredRooms = rooms.filter((room) =>
    room.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    /* Înălțimea h-[600px] asigură că panoul de chat se aliniază cu 
       restul elementelor din tab-uri și nu depășește pagina */
    <div className="h-[600px] bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Sidebar: Listă Conversații */}
        <div
          className={cn(
            "border-r border-border flex flex-col bg-muted/5",
            selectedRoom ? "hidden md:flex" : "flex"
          )}
        >
          <div className="p-4 border-b border-border bg-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Conversații active
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Caută client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-all border-b border-border text-left",
                  selectedRoom?.id === room.id &&
                    "bg-muted/80 border-r-4 border-r-primary"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  {room.isOnline && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground truncate">
                      {room.userName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {room.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.lastMessage}
                  </p>
                </div>
                {room.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                    {room.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zona de Mesaje */}
        <div
          className={cn(
            "col-span-2 flex flex-col bg-background/50",
            !selectedRoom ? "hidden md:flex" : "flex"
          )}
        >
          {selectedRoom ? (
            <>
              {/* Header Conversație */}
              <div className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="md:hidden p-2 hover:bg-muted rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    {selectedRoom.isOnline && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {selectedRoom.userName}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedRoom.isOnline ? "Activ acum" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mesaje cu Scroll propriu */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.is_admin ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                        msg.is_admin
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none border border-border"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p
                        className={cn(
                          "text-[9px] mt-1 text-right",
                          msg.is_admin
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
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

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Scrie un mesaj..."
                    className="flex-1 bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-md font-medium text-foreground">
                  Selectează o conversație
                </h3>
                <p className="text-xs">
                  Alege un client din listă pentru a comunica în timp real.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
