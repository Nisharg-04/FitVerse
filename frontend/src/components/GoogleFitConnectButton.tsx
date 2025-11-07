import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Activity, Zap, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.nutrition.read",
  // optional:
  // "https://www.googleapis.com/auth/fitness.body.read",
  // "https://www.googleapis.com/auth/fitness.heart_rate.read",
].join(" ");

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initCodeClient: (config: unknown) => { requestCode: () => void };
        };
      };
    };
  }
}

export default function GoogleFitConnectButton() {
  const codeClientRef = useRef<{ requestCode: () => void } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!window.google) return;
    codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      ux_mode: "popup",
      prompt: "consent",
      callback: async (response: { code?: string; error?: string }) => {
        if (response.error || !response.code) {
          console.error("Google OAuth error", response);
          toast({
            title: "Connection Failed",
            description: "Failed to connect with Google Fit",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/google/exchange`,
            { code: response.code },
            { withCredentials: true }
          );
          setIsConnected(true);
          setIsLoading(false);
          toast({
            title: "Success!",
            description: "Google Fit connected successfully",
          });
        } catch (error) {
          console.error("Failed to exchange code:", error);
          toast({
            title: "Connection Failed",
            description: "Failed to complete the connection",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      },
    });
  }, [toast]);

  const connect = () => {
    setIsLoading(true);
    codeClientRef.current?.requestCode();
  };

  return (
    <motion.button
      onClick={connect}
      disabled={isLoading || isConnected}
      whileHover={{ scale: isConnected ? 1 : 1.02 }}
      whileTap={{ scale: isConnected ? 1 : 0.98 }}
      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
        isConnected
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
          : "bg-gradient-to-r from-primary via-secondary to-success text-white hover:shadow-xl active:shadow-md"
      } ${isLoading ? "opacity-75" : ""} disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-5 h-5" />
          </motion.div>
          <span>Connecting...</span>
        </>
      ) : isConnected ? (
        <>
          <Check className="w-5 h-5" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <Activity className="w-5 h-5" />
          <span>Connect Google Fit</span>
        </>
      )}
    </motion.button>
  );
}
