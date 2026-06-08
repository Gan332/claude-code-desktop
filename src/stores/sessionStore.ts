import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Session {
  id: string;
  projectPath: string;
  projectName: string;
  status: "running" | "paused" | "stopped" | "error";
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface SessionState {
  sessions: Session[];
  activeSessionId: string | null;
  isLoading: boolean;

  createSession: (projectPath: string) => Promise<void>;
  sendMessage: (sessionId: string, content: string) => Promise<void>;
  setActiveSession: (id: string) => void;
  loadSessions: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, _get) => ({
  sessions: [],
  activeSessionId: null,
  isLoading: false,

  createSession: async (projectPath: string) => {
    set({ isLoading: true });
    try {
      const session = await invoke<Session>("create_session", {
        request: { projectPath },
      });
      set((state) => ({
        sessions: [...state.sessions, session],
        activeSessionId: session.id,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to create session:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  sendMessage: async (sessionId: string, content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      ),
    }));

    try {
      const assistantMessage = await invoke<Message>("send_message", {
        sessionId,
        content,
      });
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, assistantMessage] }
            : s
        ),
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  setActiveSession: (id: string) => {
    set({ activeSessionId: id });
  },

  loadSessions: async () => {
    set({ isLoading: true });
    try {
      const sessions = await invoke<Session[]>("list_sessions");
      set({ sessions, isLoading: false });
    } catch (error) {
      console.error("Failed to load sessions:", error);
      set({ isLoading: false });
    }
  },
}));
