import React, { useState, useRef, useEffect } from "react";
import { Dumbbell, X, Send, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FitnessAIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "💪 Hey there! I'm FitVerse AI, your friendly fitness buddy! 😊 I'm here to help you with workouts, nutrition tips, meal planning, fitness advice, and all things health-related. Whether you're just getting started or crushing your goals, I've got you covered! 🎯\n\nFeel free to ask me anything like:\n• 'What's a good workout for beginners?'\n• 'How much protein do I need?'\n• 'Can you suggest a meal plan?'\n• 'What exercises target my abs?'\n\nLet's get fit together! 🚀",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatName] = useState("FitVerse AI");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare chat history in the format expected by backend
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the chatbot API
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatbot/chat`,
        {
          message: inputValue,
          history: history,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data?.data?.reply) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: unknown) {
      console.error("Chat error:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
          : "Failed to get response. Please try again.";

      toast({
        title: "Error",
        description: errorMessage || "Failed to send message",
        variant: "destructive",
      });

      // Add error message to chat
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "❌ Sorry! I encountered an error. Please check your question and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-gradient-to-b from-background to-background/95 rounded-2xl shadow-2xl border border-primary/20 flex flex-col overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{chatName}</h3>
                  <p className="text-xs text-white/80">Always online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                title="Close chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 p-4 bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about fitness, nutrition, workouts..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border/50 focus:border-primary focus:outline-none text-sm placeholder-muted-foreground disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg font-bold text-white transition-all ${
          isOpen
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-gradient-to-r from-primary to-secondary hover:shadow-xl"
        }`}
        title={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Dumbbell className="w-6 h-6" />}
      </motion.button>

      {/* Notification Badge */}
      {!isOpen && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background"
        />
      )}
    </div>
  );
};

export default FitnessAIChatbot;
