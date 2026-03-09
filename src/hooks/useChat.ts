import { useState, useCallback, useEffect, useMemo } from "react";
import { Message, Role, OllamaChunk } from "../types";

const MODEL_NAME = "mistral-small:24b";

const SYSTEM_PROMPT = [
  "You are Nexora, a precise and friendly coding assistant.",
  "Always answer in Croatian when possible, unless the user asks for another language.",
  "Give clear and concise explanations, without unnecessary repetition.",
  "When you show code, use Markdown code blocks (```lang ... ```), and briefly explain what the code does.",
  "If the user question is unclear, ask one short follow-up question.",
  "If you are not sure about something, say so and explain the most likely options instead of inventing facts.",
].join("\n");

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

const buildConversationTitle = (text: string) => {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "New Chat";
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;
};

const createConversationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const createEmptyConversation = (): Conversation => {
  const now = new Date().toISOString();

  return {
    id: createConversationId(),
    title: "New Chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
};

export function useChat(userKey: string | null) {
  const safeUserKey = userKey ? String(userKey).trim() : "";

  const STORAGE_KEY = safeUserKey
    ? `nexora_conversations_${safeUserKey}`
    : null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draftConversation, setDraftConversation] = useState<Conversation | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    setConversations([]);
    setActiveConversationId(null);
    setDraftConversation(null);
    setHasHydrated(false);
    setError(null);

    const freshDraft = createEmptyConversation();

    if (!STORAGE_KEY) {
      setDraftConversation(freshDraft);
      setActiveConversationId(freshDraft.id);
      setHasHydrated(true);
      return;
    }

    try {
      const savedConversations = localStorage.getItem(STORAGE_KEY);

      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);

        if (Array.isArray(parsed)) {
          setConversations(parsed);
        }
      }
    } catch (err) {
      console.error("Greška pri učitavanju conversation history:", err);
    }

    setDraftConversation(freshDraft);
    setActiveConversationId(freshDraft.id);
    setHasHydrated(true);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!hasHydrated || !STORAGE_KEY) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations, hasHydrated, STORAGE_KEY]);

  const activeConversation = useMemo(() => {
    if (draftConversation && draftConversation.id === activeConversationId) {
      return draftConversation;
    }

    return conversations.find((c) => c.id === activeConversationId) ?? null;
  }, [conversations, activeConversationId, draftConversation]);

  const messages = activeConversation?.messages ?? [];

  const createNewChat = useCallback(() => {
    if (isLoading) return;

    const freshDraft = createEmptyConversation();
    setDraftConversation(freshDraft);
    setActiveConversationId(freshDraft.id);
    setError(null);
  }, [isLoading]);

  const selectConversation = useCallback(
    (conversationId: string) => {
      if (isLoading && conversationId !== activeConversationId) return;

      const selectedSavedConversation = conversations.find((c) => c.id === conversationId);

      if (selectedSavedConversation) {
        setDraftConversation(null);
        setActiveConversationId(conversationId);
        setError(null);
        return;
      }

      if (draftConversation && draftConversation.id === conversationId) {
        setActiveConversationId(conversationId);
        setError(null);
      }
    },
    [isLoading, activeConversationId, conversations, draftConversation]
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      if (isLoading) return;

      const isDraft = draftConversation?.id === conversationId;
      const existsInSaved = conversations.some((c) => c.id === conversationId);

      if (isDraft) {
        const freshDraft = createEmptyConversation();
        setDraftConversation(freshDraft);
        setActiveConversationId(freshDraft.id);
        setError(null);
        return;
      }

      if (!existsInSaved) return;

      const remaining = conversations.filter((c) => c.id !== conversationId);
      setConversations(remaining);
      setError(null);

      if (activeConversationId !== conversationId) return;

      const freshDraft = createEmptyConversation();
      setDraftConversation(freshDraft);
      setActiveConversationId(freshDraft.id);
    },
    [isLoading, draftConversation, conversations, activeConversationId]
  );

  const handleSend = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed || isLoading || !hasHydrated) return;

      setError(null);

      const userMsgId = Date.now();
      const assistantId = userMsgId + 1;
      const now = new Date().toISOString();

      const userMsg: Message = {
        id: userMsgId,
        role: "user",
        content: trimmed,
      };

      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      let targetConversationId: string;
      let baseMessages: Message[];

      const isUsingDraft =
        !!draftConversation && activeConversationId === draftConversation.id;

      if (isUsingDraft) {
        const promotedConversation: Conversation = {
          ...draftConversation,
          title: buildConversationTitle(trimmed),
          updatedAt: now,
          messages: [userMsg, assistantMsg],
        };

        targetConversationId = promotedConversation.id;
        baseMessages = [userMsg];

        setConversations((prev) => [promotedConversation, ...prev]);
        setDraftConversation(null);
        setActiveConversationId(promotedConversation.id);
      } else {
        const targetConversation = conversations.find(
          (c) => c.id === activeConversationId
        );

        if (!targetConversation) {
          setError("Aktivni razgovor nije pronađen.");
          return;
        }

        targetConversationId = targetConversation.id;
        baseMessages = [...targetConversation.messages, userMsg];

        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation.id !== targetConversationId) return conversation;

            return {
              ...conversation,
              title:
                conversation.messages.length === 0
                  ? buildConversationTitle(trimmed)
                  : conversation.title,
              updatedAt: now,
              messages: [...baseMessages, assistantMsg],
            };
          })
        );
      }

      const controller = new AbortController();
      setAbortController(controller);
      setIsLoading(true);

      try {
        const payload = {
          model: MODEL_NAME,
          stream: true,
          messages: [
            { role: "system" as Role, content: SYSTEM_PROMPT },
            ...baseMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        };

        const res = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Greška na serveru: ${res.status} ${res.statusText}`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("Browser ne podržava stream čitanje odgovora.");
        }

        const decoder = new TextDecoder();
        let doneStreaming = false;

        while (!doneStreaming) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.trim().length > 0);

          for (const line of lines) {
            let data: OllamaChunk;

            try {
              data = JSON.parse(line);
            } catch {
              continue;
            }

            const token = data?.message?.content ?? "";
            const isDone = data?.done ?? false;

            if (token) {
              setConversations((prev) =>
                prev.map((conversation) => {
                  if (conversation.id !== targetConversationId) return conversation;

                  return {
                    ...conversation,
                    updatedAt: new Date().toISOString(),
                    messages: conversation.messages.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + token }
                        : m
                    ),
                  };
                })
              );
            }

            if (isDone) {
              doneStreaming = true;
              break;
            }
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error(err);
          setError(
            err?.message ??
              "Dogodila se greška pri spajanju na Ollama API. Je li Ollama pokrenut?"
          );

          setConversations((prev) =>
            prev.map((conversation) => {
              if (conversation.id !== targetConversationId) return conversation;

              return {
                ...conversation,
                updatedAt: new Date().toISOString(),
                messages: conversation.messages.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: "Dogodila se greška pri dohvaćanju odgovora iz Ollame.",
                      }
                    : m
                ),
              };
            })
          );
        }
      } finally {
        setIsLoading(false);
        setAbortController(null);
      }
    },
    [activeConversationId, conversations, draftConversation, hasHydrated, isLoading]
  );

  const handleStop = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
  }, [abortController]);

  const sidebarConversations = useMemo(() => {
    if (draftConversation) {
      return [draftConversation, ...conversations];
    }

    return conversations;
  }, [draftConversation, conversations]);

  return {
    modelName: MODEL_NAME,
    messages,
    conversations: sidebarConversations,
    activeConversationId,
    isLoading,
    error,
    handleSend,
    handleStop,
    createNewChat,
    selectConversation,
    deleteConversation,
    hasHydrated,
  };
}