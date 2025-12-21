import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Zap,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    name: "Echipa Instalare",
    avatar: "EI",
    lastMessage: "Vom ajunge mâine la ora 9",
    time: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Suport Clienți",
    avatar: "SC",
    lastMessage: "Garanția a fost activată",
    time: "Ieri",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Consultant Vânzări",
    avatar: "CV",
    lastMessage: "Iată oferta actualizată",
    time: "Luni",
    unread: 0,
    online: true,
  },
];

const mockMessages = [
  {
    id: "1",
    senderId: "team",
    content: "Bună ziua! Suntem echipa de instalare pentru proiectul dvs.",
    time: "09:00",
  },
  {
    id: "2",
    senderId: "user",
    content: "Bună! Mă bucur să aud de voi. Când va fi instalarea?",
    time: "09:15",
  },
  {
    id: "3",
    senderId: "team",
    content:
      "Am programat instalarea pentru mâine. Echipa noastră va ajunge la ora 9:00.",
    time: "09:20",
  },
  {
    id: "4",
    senderId: "team",
    content:
      "Vă rugăm să vă asigurați că zona de instalare este accesibilă.",
    time: "09:21",
  },
  {
    id: "5",
    senderId: "user",
    content: "Perfect, voi pregăti totul. Cât durează instalarea?",
    time: "09:30",
  },
  {
    id: "6",
    senderId: "team",
    content:
      "Instalarea durează de obicei 1-2 zile. Pentru sistemul dvs. de 8.5kW, estimăm că vom termina într-o zi.",
    time: "10:00",
  },
  {
    id: "7",
    senderId: "team",
    content: "Vom ajunge mâine la ora 9. Ne vedem atunci!",
    time: "10:30",
  },
];

const Messages = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(
    mockConversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "user",
      content: messageInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conv: typeof mockConversations[0]) => {
    setSelectedConversation(conv);
    setShowConversationList(false);
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Zap },
    { name: "Documente", href: "/dashboard/documents", icon: FileText },
    { name: "Programări", href: "/dashboard/appointments", icon: Calendar },
    { name: "Mesaje", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Profil", href: "/dashboard/profile", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        Deconectare
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Sun className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span>Gabriel Solar</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg hidden sm:block">
                  Gabriel Solar Energy
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground">
                {user?.first_name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <SidebarContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-10rem)]">
              <div className="flex h-full">
                {/* Conversations List */}
                <div
                  className={cn(
                    "border-r border-border flex-shrink-0 flex flex-col",
                    "w-full md:w-80",
                    !showConversationList && "hidden md:flex"
                  )}
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Conversații
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Caută mesaje..." className="pl-9" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {mockConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={cn(
                          "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                          selectedConversation?.id === conv.id && "bg-muted/50"
                        )}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground">
                            {conv.avatar}
                          </div>
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {conv.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conv.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                            {conv.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div
                  className={cn(
                    "flex-1 flex flex-col min-w-0",
                    showConversationList && "hidden md:flex"
                  )}
                >
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowConversationList(true)}
                            className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div className="relative">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground">
                              {selectedConversation.avatar}
                            </div>
                            {selectedConversation.online && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {selectedConversation.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {selectedConversation.online ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              message.senderId === "user"
                                ? "justify-end"
                                : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl",
                                message.senderId === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-muted rounded-bl-sm"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={cn(
                                  "text-xs mt-1",
                                  message.senderId === "user"
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                          <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Scrie un mesaj..."
                            className="flex-1"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Selectează o conversație</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
