import { create } from "zustand";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  role: MessageRole;
  content: string;
};

type ChatState = {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] }))
}));
