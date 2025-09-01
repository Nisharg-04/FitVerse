import { useEffect, useRef } from "react";
import axios from "axios";

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
    google: any;
  }
}

export default function GoogleFitConnectButton() {
  const codeClientRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google) return;
    codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      ux_mode: "popup",
      // Ensures a refresh_token is issued the first time:
      prompt: "consent",
      // Receive the authorization code in a callback (no redirect page needed)
      callback: async (response: { code?: string; error?: string }) => {
        if (response.error || !response.code) {
          console.error("Google OAuth error", response);
          return;
        }
        // Send auth code to your backend to exchange for tokens
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/google/exchange`,
          { code: response.code },
          { withCredentials: true } // if your backend sets auth cookies
        );
        // optionally trigger a re-fetch of user/fitness data in your app state
      },
    });
  }, []);

  const connect = () => {
    codeClientRef.current?.requestCode();
  };

  return (
    <button onClick={connect} className="px-4 py-2 rounded bg-black text-white">
      Connect Google Fit
    </button>
  );
}
