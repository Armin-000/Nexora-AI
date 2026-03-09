import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Prism from "prismjs";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// Prism languages
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

import SettingsModal from "./components/settingsModal";
import AdminPanel from "./components/AdminPanel";
import Sidebar from "./components/Sidebar";
import DocumentSidebar from "./components/DocumentSidebar";
import { useChat } from "./hooks/useChat";

/* ────────────────────────────────────────────────────────────
 * UI Types
 * ──────────────────────────────────────────────────────────── */

interface Segment {
  type: "text" | "code";
  content: string;
  lang?: string;
  key: string;
}

/* ────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────── */

const resolveLanguage = (raw?: string) => {
  const lang = (raw || "").toLowerCase();

  if (lang === "js" || lang === "javascript") return "javascript";
  if (lang === "ts" || lang === "typescript") return "typescript";
  if (lang === "tsx") return "tsx";
  if (lang === "jsx") return "jsx";
  if (lang === "html" || lang === "markup") return "markup";
  if (lang === "css") return "css";

  return "javascript";
};

const parseMessageContent = (content: string, messageId: number): Segment[] => {
  const segments: Segment[] = [];
  const codeRegex = /```([^\s`]+)?\s*\r?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = codeRegex.exec(content)) !== null) {
    const [fullMatch, langRaw, codeRaw] = match;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    if (matchStart > lastIndex) {
      const textPart = content.slice(lastIndex);
      const beforeMatch = textPart.slice(0, matchStart - lastIndex);
      const normalized = beforeMatch.replace(/\n{3,}/g, "\n\n");

      if (normalized.trim().length > 0) {
        segments.push({
          type: "text",
          content: normalized,
          key: `${messageId}-text-${blockIndex}`,
        });
      }
    }

    const lang = (langRaw || "").trim() || "code";
    const code = (codeRaw || "").replace(/\s+$/, "");

    segments.push({
      type: "code",
      content: code,
      lang,
      key: `${messageId}-code-${blockIndex}`,
    });

    lastIndex = matchEnd;
    blockIndex += 1;
  }

  if (lastIndex < content.length) {
    const textPart = content.slice(lastIndex);
    const normalized = textPart.replace(/\n{3,}/g, "\n\n");

    if (normalized.trim().length > 0) {
      segments.push({
        type: "text",
        content: normalized,
        key: `${messageId}-text-end`,
      });
    }
  }

  if (segments.length === 0) {
    segments.push({
      type: "text",
      content,
      key: `${messageId}-text-only`,
    });
  }

  return segments;
};

/* ────────────────────────────────────────────────────────────
 * Subcomponents
 * ──────────────────────────────────────────────────────────── */

interface CodeBlockProps {
  segment: Segment;
  copiedBlockId: string | null;
  onCopy: (blockId: string, code: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  segment: seg,
  copiedBlockId,
  onCopy,
}) => {
  const lang = resolveLanguage(seg.lang);

  const highlighted = Prism.highlight(
    seg.content,
    Prism.languages[lang] || Prism.languages.javascript,
    lang
  );

  const isCopied = copiedBlockId === seg.key;

  return (
    <div className="code-block">
      <div className="code-header">
        <div className="code-title">
          <span className="code-dot red" />
          <span className="code-dot yellow" />
          <span className="code-dot green" />
          <span className="code-lang">{(seg.lang || "code").toUpperCase()}</span>
        </div>

        <button
          type="button"
          className={`code-copy-btn message-copy-btn ${isCopied ? "copied" : ""}`}
          onClick={() => onCopy(seg.key, seg.content)}
          aria-label="Kopiraj ovaj kod"
        >
          {isCopied ? (
            <span className="message-copy-check">✓</span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="code-body">
        <pre className={`language-${lang}`}>
          <code
            className={`language-${lang}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────── */

const App: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  const chatUserKey = useMemo(() => {
    return authUser ? String(authUser.id) : null;
  }, [authUser]);

  const {
    modelName,
    messages,
    conversations,
    activeConversationId,
    isLoading,
    error,
    handleSend,
    handleStop,
    createNewChat,
    selectConversation,
    deleteConversation,
    hasHydrated,
  } = useChat(chatUserKey);

  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [hasForcedFreshChat, setHasForcedFreshChat] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerMode, setIsDrawerMode] = useState(false);

  const [isDocumentSidebarOpen, setIsDocumentSidebarOpen] = useState(false);
  const [isDocumentDrawerMode, setIsDocumentDrawerMode] = useState(false);

  const handleOpenLeftSidebar = useCallback(() => {
  if (isDrawerMode || isDocumentDrawerMode) {
    setIsDocumentSidebarOpen(false);
  }

  setIsSidebarOpen(true);
}, [isDrawerMode, isDocumentDrawerMode]);

const handleToggleLeftSidebar = useCallback(() => {
  setIsSidebarOpen((prev) => {
    const next = !prev;

    if (next && (isDrawerMode || isDocumentDrawerMode)) {
      setIsDocumentSidebarOpen(false);
    }

    return next;
  });
}, [isDrawerMode, isDocumentDrawerMode]);

const handleOpenRightSidebar = useCallback(() => {
  if (isDrawerMode || isDocumentDrawerMode) {
    setIsSidebarOpen(false);
  }

  setIsDocumentSidebarOpen(true);
}, [isDrawerMode, isDocumentDrawerMode]);

const handleToggleRightSidebar = useCallback(() => {
  setIsDocumentSidebarOpen((prev) => {
    const next = !prev;

    if (next && (isDrawerMode || isDocumentDrawerMode)) {
      setIsSidebarOpen(false);
    }

    return next;
  });
}, [isDrawerMode, isDocumentDrawerMode]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const freshLoginAppliedRef = useRef<string | null>(null);

  const visibleMessages = messages;
  const lastMessageId = visibleMessages[visibleMessages.length - 1]?.id;

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("nexora_theme", next);
      return next;
    });
  }, []);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const handleLogout = () => {
    if (authUser) {
      sessionStorage.setItem(`nexora_force_fresh_login_chat_${authUser.id}`, "1");
      localStorage.removeItem(`nexora_active_conversation_${authUser.id}`);
      setHasForcedFreshChat(false);
      logout();
    }

    navigate("/");
  };

  const handleNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const stored = localStorage.getItem("nexora_theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1450px)");
    const apply = () => {
      setIsDrawerMode(mq.matches);
      setIsDocumentDrawerMode(mq.matches);
    };

    apply();

    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    } else {
      // @ts-ignore
      mq.addListener(apply);
      return () => {
        // @ts-ignore
        mq.removeListener(apply);
      };
    }
  }, []);

  useEffect(() => {
    if (!authUser) {
      freshLoginAppliedRef.current = null;
      setHasForcedFreshChat(false);
      return;
    }

    if (!hasHydrated) return;
    if (hasForcedFreshChat) return;

    const userId = String(authUser.id);
    const forceKey = `nexora_force_fresh_login_chat_${userId}`;
    const shouldOpenFreshChat = sessionStorage.getItem(forceKey) === "1";

    if (shouldOpenFreshChat && freshLoginAppliedRef.current !== userId) {
      createNewChat();
      localStorage.removeItem(`nexora_active_conversation_${userId}`);
      sessionStorage.removeItem(forceKey);
      freshLoginAppliedRef.current = userId;
      setHasForcedFreshChat(true);
      return;
    }

    freshLoginAppliedRef.current = userId;
  }, [authUser, hasHydrated, hasForcedFreshChat, createNewChat]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSend(input);
        setInput("");
      }
    }
  };

  const handleCopyBlock = useCallback(async (blockId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlockId(blockId);
      setTimeout(() => setCopiedBlockId(null), 1500);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleCopyMessage = useCallback(
    async (messageId: number, content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 1500);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const showAdmin = authUser?.role === "admin";

  return (
    <div className={`app-root ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        isDrawerMode={isDrawerMode}
        onOpen={handleOpenLeftSidebar}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={handleToggleLeftSidebar}
        onNewChat={handleNewChat}
        onOpenSettings={openSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogout={handleLogout}
        showAdmin={showAdmin}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
      />

      <div className="chat-shell">
        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-main">
              <div className="topbar-title">NEXORA</div>

              <div className="topbar-subtitle">
                <span className="sub-label">Model</span>
                <span className="mono sub-model">{modelName}</span>
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Promijeni temu"
            />

            {showAdmin && (
              <button
                type="button"
                className="admin-btn"
                onClick={() => setIsAdminOpen(true)}
                aria-label="Admin panel"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7"></path>
                </svg>
              </button>
            )}
          </div>
        </header>

        <div className="chat-body">
          <main className="chat-main">
            <div className="messages">
              {visibleMessages.length === 0 && (
                <div className="empty-state">
                  <p>Spreman sam. Napiši pitanje ili zalijepi svoj kod.</p>
                  <ul>
                    <li>Napiši mi primjer HTML stranice za prodaju automobila.</li>
                    <li>Optimiziraj ovaj JavaScript kod.</li>
                    <li>Objasni mi ovaj TSX kod koji šaljem.</li>
                  </ul>
                </div>
              )}

              {visibleMessages.map((msg) => {
                const isUser = msg.role === "user";
                const isAssistant = msg.role === "assistant";
                const isLastAssistant = isAssistant && msg.id === lastMessageId;

                const segments: Segment[] = isAssistant
                  ? parseMessageContent(msg.content, msg.id)
                  : [
                      {
                        type: "text",
                        content: msg.content,
                        key: `${msg.id}-user-text`,
                      },
                    ];

                const showInlineTyping =
                  isLastAssistant && isLoading && msg.content.length === 0;

                return (
                  <div
                    key={msg.id}
                    className={`message-row ${isUser ? "user-row" : "assistant-row"}`}
                  >
                    <div className={`avatar ${isUser ? "avatar-user" : "avatar-bot"}`}>
                      {isUser ? "TY" : "</>"}
                    </div>

                    <div className={`bubble ${isUser ? "bubble-user" : "bubble-assistant"}`}>
                      <div className="bubble-header">
                        <span className="role-label">{isUser ? "Ti" : "Nexora"}</span>

                        {isAssistant && msg.content.length > 0 && (
                          <button
                            type="button"
                            className={`message-copy-btn ${
                              copiedMessageId === msg.id ? "copied" : ""
                            }`}
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            aria-label="Kopiraj cijeli odgovor"
                          >
                            {copiedMessageId === msg.id ? (
                              <span className="message-copy-check">✓</span>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="bubble-content">
                        {showInlineTyping ? (
                          <div className="typing-inline">
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                          </div>
                        ) : (
                          segments.map((seg) =>
                            seg.type === "text" ? (
                              <div className="segment-text" key={seg.key}>
                                <ReactMarkdown
                                  components={{
                                    p: (props) => (
                                      <p style={{ whiteSpace: "pre-wrap" }} {...props} />
                                    ),
                                    li: (props) => (
                                      <li style={{ whiteSpace: "pre-wrap" }} {...props} />
                                    ),
                                  }}
                                >
                                  {seg.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <CodeBlock
                                key={seg.key}
                                segment={seg}
                                copiedBlockId={copiedBlockId}
                                onCopy={handleCopyBlock}
                              />
                            )
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </main>

          <form
            className="input-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && input.trim()) {
                handleSend(input);
                setInput("");
              }
            }}
          >
            <div className="input-inner">
              <div className="input-main">
                <textarea
                  className="chat-input"
                  placeholder="Napiši pitanje ili zalijepi svoj kod ovdje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                />

                <div className="input-hint">Enter = pošalji · Shift+Enter = novi red</div>
              </div>

              <div className="input-actions">
                <button
                  type="submit"
                  className="send-btn"
                  aria-label={isLoading ? "Stop generation" : "Send message"}
                  disabled={!input.trim() && !isLoading}
                  onClick={(e) => {
                    if (isLoading) {
                      e.preventDefault();
                      handleStop();
                    }
                  }}
                >
                  <span className="send-icon" aria-hidden="true">
                    {isLoading ? (
                      <span className="send-spinner" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.4 20.6L21 12 3.4 3.4 3 10l12 2-12 2z" />
                      </svg>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  className="mic-btn"
                  aria-label="Voice input"
                  title="Voice input"
                >
                  <span className="mic-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0" />
                      <path d="M12 17v4" />
                      <path d="M8 21h8" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} user={authUser} />

        <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

        {error && <div className="error-banner">{error}</div>}
      </div>

      <DocumentSidebar
        isOpen={isDocumentSidebarOpen}
        isDrawerMode={isDocumentDrawerMode}
        onOpen={handleOpenRightSidebar}
        onClose={() => setIsDocumentSidebarOpen(false)}
        onToggle={handleToggleRightSidebar}
        documents={[]}
        activeDocumentId={null}
        onSelectDocument={(id) => console.log("Select document:", id)}
        onDeleteDocument={(id) => console.log("Delete document:", id)}
      />
    </div>
  );
};

export default App;