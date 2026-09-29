import type { PropsWithChildren } from "react";
import type { WorkspaceSession } from "../../types/api";
import { Icon, type IconName } from "../ui/Icon";

export type WorkspaceView = "workspace" | "documents" | "agents" | "settings";

interface AppShellProps extends PropsWithChildren {
  view: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  sessions: WorkspaceSession[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (session: WorkspaceSession) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  apiState: "checking" | "connected" | "offline";
}

const navigation: { id: WorkspaceView; label: string; icon: IconName }[] = [
  { id: "workspace", label: "Research workspace", icon: "workspace" },
  { id: "documents", label: "Source library", icon: "library" },
  { id: "agents", label: "Agent directory", icon: "agents" },
];

export function AppShell({
  children, view, onViewChange, sessions, activeSessionId,
  onNewSession, onSelectSession, sidebarOpen, onToggleSidebar, apiState,
}: AppShellProps) {
  const currentLabel = navigation.find((item) => item.id === view)?.label ?? "Settings";
  return (
    <div className="app-frame">
      <button className={"mobile-scrim " + (sidebarOpen ? "is-visible" : "")} aria-label="Close navigation" onClick={onToggleSidebar} />
      <aside className={"sidebar " + (sidebarOpen ? "sidebar-open" : "")}>
        <div className="brand-row">
          <div className="brand-mark"><Icon name="sparkle" size={19} /></div>
          <div className="brand-copy"><strong>Research</strong><span>WORKSPACE</span></div>
          <button className="icon-button sidebar-close" onClick={onToggleSidebar} aria-label="Close menu"><Icon name="close" /></button>
        </div>

        <button className="workspace-switcher">
          <span className="workspace-avatar">N</span>
          <span className="workspace-switcher-copy"><strong>My workspace</strong><small>Personal space</small></span>
          <Icon name="chevron" size={15} className="rotate-90" />
        </button>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button key={item.id} className={"nav-item " + (view === item.id ? "nav-item-active" : "")}
              onClick={() => { onViewChange(item.id); if (sidebarOpen) onToggleSidebar(); }}>
              <Icon name={item.icon} size={17} /><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-section-heading">
          <span>RECENT RESEARCH</span>
          <button className="subtle-icon-button" onClick={onNewSession} aria-label="New research session" title="New session"><Icon name="plus" size={16} /></button>
        </div>
        <div className="recent-list">
          {sessions.slice(0, 7).map((session) => (
            <button key={session.id} className={"recent-item " + (activeSessionId === session.id ? "recent-item-active" : "")}
              onClick={() => onSelectSession(session)} title={session.title ?? "Untitled session"}>
              <Icon name="message" size={15} /><span>{session.title || "Untitled research"}</span>
            </button>
          ))}
          {sessions.length === 0 && <p className="sidebar-empty">Your research sessions will appear here.</p>}
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-bottom-card">
          <div className="sidebar-bottom-icon"><Icon name="database" size={17} /></div>
          <div><strong>Bring your sources</strong><span>Ground research in your documents.</span></div>
          <button className="sidebar-card-arrow" onClick={() => onViewChange("documents")} aria-label="Open source library"><Icon name="chevron" size={15} /></button>
        </div>
        <button className={"nav-item settings-link " + (view === "settings" ? "nav-item-active" : "")} onClick={() => onViewChange("settings")}>
          <Icon name="settings" size={17} /><span>Settings</span>
        </button>
        <div className="profile-row">
          <div className="profile-avatar">RW</div>
          <div className="profile-copy"><strong>Workspace member</strong><span>Personal workspace</span></div>
          <button className="subtle-icon-button" aria-label="Account options"><Icon name="more" size={17} /></button>
        </div>
      </aside>

      <div className="main-frame">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onToggleSidebar}><Icon name="menu" /></button>
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{currentLabel}</strong></div>
          <div className="topbar-actions">
            <div className={"api-status api-" + apiState}><span className="status-dot" /> API {apiState}</div>
            <div className="topbar-divider" />
            <button className="help-button" onClick={() => onViewChange("settings")}>Help & feedback</button>
            <div className="profile-avatar profile-avatar-small">RW</div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

