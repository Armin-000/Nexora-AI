import React from "react";

interface DocumentItem {
  id: string;
  name: string;
  meta?: string;
}

interface DocumentSidebarProps {
  isOpen: boolean;
  isDrawerMode: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  documents?: DocumentItem[];
  activeDocumentId?: string | null;
  onSelectDocument?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  isOpen,
  isDrawerMode,
  onOpen,
  onClose,
  onToggle,
  documents = [],
  activeDocumentId = null,
  onSelectDocument,
  onDeleteDocument,
}) => {
  const sidebarClass = [
    "nx-doc-sidebar",
    isOpen ? "is-open" : "is-closed",
    isDrawerMode ? "is-drawer" : "is-desktop",
  ].join(" ");

  return (
    <>
      {isDrawerMode && (
        <button
          type="button"
          className={`nx-doc-wave ${isOpen ? "is-open" : "is-closed"}`}
          onClick={isOpen ? onClose : onOpen}
          aria-label={isOpen ? "Zatvori document sidebar" : "Otvori document sidebar"}
        />
      )}

      <div
        className={`nx-doc-overlay ${isOpen && isDrawerMode ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={sidebarClass} aria-label="Document sidebar">
        <div className="nx-doc-sidebar__top">
          <button
            type="button"
            className="nx-doc-sidebar__toggle"
            onClick={onToggle}
            aria-label={isOpen ? "Zatvori document sidebar" : "Otvori document sidebar"}
            title={isOpen ? "Zatvori" : "Otvori"}
          >
            <span className="nx-doc-sidebar__icon" aria-hidden="true">
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
                {isOpen ? (
                  <>
                    <path d="M9 18l6-6-6-6" />
                  </>
                ) : (
                  <>
                    <path d="M15 18l-6-6 6-6" />
                  </>
                )}
              </svg>
            </span>

            <span className="nx-doc-sidebar__label">Dokumenti</span>
          </button>
        </div>

        <div className="nx-doc-sidebar__middle">
          <button
            type="button"
            className="nx-doc-sidebar__item"
            aria-label="Pretraga dokumenata"
            title="Pretraga dokumenata"
          >
            <span className="nx-doc-sidebar__icon" aria-hidden="true">
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
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>

            <span className="nx-doc-sidebar__label">Pretraga</span>
          </button>

          <button
            type="button"
            className="nx-doc-sidebar__item"
            aria-label="Dodaj dokument"
            title="Dodaj dokument"
          >
            <span className="nx-doc-sidebar__icon" aria-hidden="true">
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
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </span>

            <span className="nx-doc-sidebar__label">Dodaj dokument</span>
          </button>

          <button
            type="button"
            className="nx-doc-sidebar__item"
            aria-label="Ispis dokumenata"
            title="Ispis dokumenata"
          >
            <span className="nx-doc-sidebar__icon" aria-hidden="true">
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
                <path d="M6 9V4h12v5" />
                <rect x="6" y="14" width="12" height="6" rx="1.5" />
                <path d="M6 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
              </svg>
            </span>

            <span className="nx-doc-sidebar__label">Ispis</span>
          </button>

          <div className="nx-doc-sidebar__history">
            <div className="nx-doc-sidebar__historyTitle">Spremljeni dokumenti</div>

            <div className="nx-doc-sidebar__historyList">
              {documents.length === 0 ? (
                <div className="nx-doc-sidebar__historyEmpty">
                  Nema spremljenih dokumenata.
                </div>
              ) : (
                documents.map((doc) => {
                  const isActive = activeDocumentId === doc.id;

                  return (
                    <div
                      key={doc.id}
                      className={`nx-doc-sidebar__historyItem ${
                        isActive ? "is-active" : ""
                      }`}
                    >
                      <div className="nx-doc-sidebar__historyInner">
                        <button
                          type="button"
                          className="nx-doc-sidebar__historyMain"
                          onClick={() => onSelectDocument?.(doc.id)}
                        >
                          <div className="nx-doc-sidebar__historyRow">
                            <div className="nx-doc-sidebar__historyText">{doc.name}</div>

                            {doc.meta && (
                              <div className="nx-doc-sidebar__historyMeta">{doc.meta}</div>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          className="nx-doc-sidebar__historyDelete"
                          onClick={() => onDeleteDocument?.(doc.id)}
                          aria-label={`Obriši dokument ${doc.name}`}
                          title="Obriši dokument"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DocumentSidebar;