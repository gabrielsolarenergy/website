import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Send,
  User,
  Circle,
  MessageSquare,
  Archive,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChatConnection, getToken, API_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

const AdminChatPanel = () => {
  const { user: admin } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [connection, setConnection] = useState<any>(null);
  const [isClientTyping, setIsClientTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/chat/active-threads`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setThreads(data);
    } catch (e) {
      console.error("Eroare thread-uri:", e);
    } finally {
      setIsLoadingThreads(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
    const interval = setInterval(loadThreads, 10000);
    return () => clearInterval(interval);
  }, [loadThreads]);

  const selectRoom = async (thread: any) => {
    setSelectedRoom(thread);
    setMessages([]);
    setOffset(0);
    setHasMore(true);
    setIsLoadingMessages(true);

    try {
      const res = await fetch(
        `${API_URL}/chat/history/${thread.id}?limit=20&offset=0`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      setMessages(data);
      if (data.length < 20) setHasMore(false);

      if (connection) connection.close();
      const conn = createChatConnection(thread.id, getToken()!, (msg) => {
        if (msg.type === "typing") {
          if (msg.user_id === thread.id) setIsClientTyping(msg.is_typing);
        } else {
          setMessages((prev) => [...prev, msg]);
        }
      });
      setConnection(conn);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMessages(false);
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMessages || !selectedRoom) return;
    setIsLoadingMessages(true);
    const newOffset = offset + 20;

    try {
      const res = await fetch(
        `${API_URL}/chat/history/${selectedRoom.id}?limit=20&offset=${newOffset}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      if (data.length < 20) setHasMore(false);
      if (data.length > 0) {
        const currentScrollHeight = chatContainerRef.current?.scrollHeight || 0;
        setMessages((prev) => [...data, ...prev]);
        setOffset(newOffset);
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight - currentScrollHeight;
          }
        }, 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Arhivezi această conversație?")) return;
    try {
      await fetch(`${API_URL}/chat/archive/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSelectedRoom(null);
      loadThreads();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !connection) return;
    connection.send({ type: "message", text: newMessage });
    setNewMessage("");
  };

  const filteredThreads = threads.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl h-[800px] mt-4">
      <div className="w-80 border-r bg-slate-50/50 flex flex-col shrink-0">
        <div className="p-6 border-b bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tighter uppercase">
            Mesaje
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Caută..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoadingThreads ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-slate-300" />
            </div>
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => selectRoom(thread)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center gap-3 transition-all relative text-left",
                  selectedRoom?.id === thread.id
                    ? "bg-[#1a4925] text-white shadow-lg"
                    : "bg-white hover:bg-slate-100"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#1a4925]">
                    {thread.name[0]}
                  </div>
                  {thread.is_online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm truncate">{thread.name}</p>
                    {thread.unread && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[9px] mt-1 opacity-60 flex items-center gap-1",
                      selectedRoom?.id === thread.id
                        ? "text-white"
                        : "text-slate-500"
                    )}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {formatDistanceToNow(new Date(thread.last_message_at), {
                      addSuffix: true,
                      locale: ro,
                    })}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center p-10 opacity-20">
              <MessageSquare className="mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase">
                Niciun chat activ
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10 px-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a4925] text-white flex items-center justify-center font-bold">
                  {selectedRoom.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-none">
                    {selectedRoom.name}
                  </h4>
                  <p className="text-[9px] text-green-500 font-bold mt-1 uppercase">
                    Sesiune Live
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleArchive(selectedRoom.id)}
                className="text-red-500 hover:bg-red-50 rounded-xl gap-2 font-bold text-[10px] uppercase"
              >
                <Archive className="w-3.5 h-3.5" /> Închide Chat
              </Button>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50"
              onScroll={(e) =>
                e.currentTarget.scrollTop === 0 && loadMoreMessages()
              }
            >
              {hasMore && (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin w-4 h-4 text-slate-300" />
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col",
                    m.is_admin ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] p-4 rounded-2xl text-sm shadow-sm relative",
                      m.is_admin
                        ? "bg-[#1a4925] text-white rounded-tr-none"
                        : "bg-white border text-slate-700 rounded-tl-none"
                    )}
                  >
                    {m.text || m.message}
                    <span
                      className={cn(
                        "text-[7px] absolute -bottom-4 whitespace-nowrap opacity-40 font-bold uppercase",
                        m.is_admin ? "right-0" : "left-0"
                      )}
                    >
                      {formatDistanceToNow(new Date(m.created_at), {
                        addSuffix: true,
                        locale: ro,
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-8 border-t bg-white">
              {isClientTyping && (
                <div className="text-[9px] text-[#1a4925] animate-pulse mb-2 ml-2 font-black uppercase">
                  Clientul scrie...
                </div>
              )}
              <div className="flex gap-4 items-center bg-slate-100 p-2 rounded-2xl border border-slate-200 focus-within:border-[#1a4925] transition-all">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    connection?.send({
                      type: "typing",
                      is_typing: e.target.value.length > 0,
                    });
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Scrie răspunsul tău..."
                  className="border-none bg-transparent focus-visible:ring-0 shadow-none text-sm h-12"
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="bg-[#1a4925] hover:bg-[#143a1d] rounded-xl h-12 w-12 shrink-0 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10">
            <MessageSquare className="w-20 h-20 mb-4" />
            <p className="font-black uppercase tracking-widest">
              Selectează o conversație
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPanel;
