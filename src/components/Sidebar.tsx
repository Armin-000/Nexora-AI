import React, { useCallback, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

type SidebarConversation = {
  id: string;
  title: string;
  updatedAt: string;
};

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  isDrawerMode: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  activeConversationId: string | null;
  conversations: SidebarConversation[];
  showAdmin?: boolean;
}

interface SidebarActionItem {
  key: string;
  label: string;
  onClick: () => void;
  icon: ReactNode;
}

interface SidebarButtonProps {
  label: string;
  onClick?: () => void;
  icon: ReactNode;
  className?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  onClick,
  icon,
  className = "",
  title,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
    >
      <span className="nx-sidebar__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="nx-sidebar__label">{label}</span>
    </button>
  );
};

const LayoutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.57 0 1.11.24 1.51.67A2 2 0 1 1 19.4 15z" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const ImpressumIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H14L19 8V19C19 20.1046 18.1046 21 17 21H8C6.89543 21 6 20.1046 6 19V5C6 3.89543 6.89543 3 8 3Z" />
    <path d="M14 3V8H19" />
    <path d="M9 12H15" />
    <path d="M9 16H13" />
  </svg>
);

const PrivacyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3L19 6V11C19 15.4183 16.134 19.2167 12 21C7.866 19.2167 5 15.4183 5 11V6L12 3Z" />
    <path d="M9.5 12L11.2 13.7L14.8 10.3" />
  </svg>
);

const formatConversationTime = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
  });
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isDrawerMode,
  onOpen,
  onClose,
  onToggle,
  onNewChat,
  onOpenSettings,
  onOpenAdmin,
  onLogout,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
  conversations,
  showAdmin = false,
}) => {
  const closeSidebar = useCallback(() => {
    onClose();
  }, [onClose]);

  const closeOnDrawer = useCallback(
    (action: () => void) => {
      action();
      if (isDrawerMode) {
        onClose();
      }
    },
    [isDrawerMode, onClose]
  );

  const toggleSidebar = useCallback(() => {
    if (isDrawerMode) {
      if (isOpen) onClose();
      else onOpen();
      return;
    }

    onToggle();
  }, [isDrawerMode, isOpen, onClose, onOpen, onToggle]);

  useEffect(() => {
    if (!isDrawerMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerMode, closeSidebar]);

  const overlayOpen = isDrawerMode && isOpen;

  const actionItems: SidebarActionItem[] = [
    {
      key: "new-chat",
      label: "New Chat",
      onClick: () => closeOnDrawer(onNewChat),
      icon: <PencilIcon />,
    },
    {
      key: "settings",
      label: "Settings",
      onClick: () => closeOnDrawer(onOpenSettings),
      icon: <SettingsIcon />,
    },
    ...(showAdmin
      ? [
          {
            key: "admin",
            label: "Admin",
            onClick: () => closeOnDrawer(onOpenAdmin),
            icon: <AdminIcon />,
          },
        ]
      : []),
  ];

  const sidebarClassName = [
    "nx-sidebar",
    isDrawerMode ? "is-drawer" : "is-desktop",
    isOpen ? "is-open" : "is-closed",
  ].join(" ");

  const waveClassName = `nx-wave ${isOpen ? "is-open" : "is-closed"}`;

  return (
    <>
      <div
        className={`nx-sb-overlay ${overlayOpen ? "is-open" : ""}`}
        onClick={closeSidebar}
        aria-hidden={!overlayOpen}
      />

      {isDrawerMode && (
        <button
          type="button"
          className={waveClassName}
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        />
      )}

      <aside className={sidebarClassName} aria-label="Sidebar">
        <div className="nx-sidebar__top">
          <SidebarButton
            className="nx-sidebar__toggle"
            label={isOpen ? "Close sidebar" : "Open sidebar"}
            title={isOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            icon={<LayoutIcon />}
          />
        </div>

        <div className="nx-sidebar__middle">
          {actionItems.map((item) => (
            <SidebarButton
              key={item.key}
              className="nx-sidebar__item"
              label={item.label}
              onClick={item.onClick}
              icon={item.icon}
            />
          ))}

          <div className="nx-sidebar__history" aria-hidden={!isOpen}>
            <div className="nx-sidebar__historyTitle">Conversation History</div>

            {conversations.length === 0 ? (
              <div className="nx-sidebar__historyEmpty">No conversations yet.</div>
            ) : (
              <div className="nx-sidebar__historyList">
                {conversations.map((conversation) => {
                  const isActive = conversation.id === activeConversationId;

                  return (
                    <div
                      key={conversation.id}
                      className={`nx-sidebar__historyItem ${isActive ? "is-active" : ""}`}
                      title={conversation.title}
                    >
                      <div
                        className="nx-sidebar__historyMain"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          closeOnDrawer(() => onSelectConversation(conversation.id))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            closeOnDrawer(() => onSelectConversation(conversation.id));
                          }
                        }}
                      >
                        <div className="nx-sidebar__historyRow">
                          <span className="nx-sidebar__historyText">
                            {conversation.title}
                          </span>

                          <button
                            type="button"
                            className="nx-sidebar__historyDelete"
                            aria-label="Obriši razgovor"
                            title="Obriši razgovor"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        <span className="nx-sidebar__historyMeta">
                          {formatConversationTime(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="nx-sidebar__bottom">
          <div className="nx-sidebar__legal">
            <Link
              to="/impressum"
              state={{ from: "/chat" }}
              className="nx-sidebar__item nx-sidebar__legalLink"
              aria-label="Impressum"
              title="Impressum"
              onClick={() => {
                if (isDrawerMode) onClose();
              }}
            >
              <span className="nx-sidebar__icon" aria-hidden="true">
                <ImpressumIcon />
              </span>
              <span className="nx-sidebar__label">Impressum</span>
            </Link>

            <Link
              to="/privacy-policy"
              state={{ from: "/chat" }}
              className="nx-sidebar__item nx-sidebar__legalLink"
              aria-label="Privacy Policy"
              title="Privacy Policy"
              onClick={() => {
                if (isDrawerMode) onClose();
              }}
            >
              <span className="nx-sidebar__icon" aria-hidden="true">
                <PrivacyIcon />
              </span>
              <span className="nx-sidebar__label">Privacy Policy</span>
            </Link>
          </div>

          <SidebarButton
            className="nx-sidebar__item"
            label="Logout"
            onClick={() => closeOnDrawer(onLogout)}
            icon={<LogoutIcon />}
          />

          <div className="nx-sidebar__avatar" aria-hidden="true">
            <span className="nx-sidebar__avatarSlot">
              <span className="nx-sidebar__avatarCircle">AR</span>
            </span>
            <span className="nx-sidebar__label">Armin</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;