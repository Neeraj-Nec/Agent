import { getApiBaseUrl } from "../../services/api/client";
import { Icon } from "../../components/ui/Icon";

interface SettingsPageProps {
  apiState: "checking" | "connected" | "offline";
  onRetry: () => void;
}

export function SettingsPage({ apiState, onRetry }: SettingsPageProps) {
  return (
    <section className="section-page settings-page">
      <div className="page-heading-row">
        <div><div className="eyebrow">PREFERENCES</div><h1>Workspace settings</h1><p className="page-description">Manage the connections and defaults for your research workspace.</p></div>
      </div>
      <div className="settings-layout">
        <nav className="settings-nav"><button className="settings-nav-active"><Icon name="workspace" size={16} />General</button><button><Icon name="shield" size={16} />Privacy & access</button><button><Icon name="database" size={16} />Data & storage</button></nav>
        <div className="settings-content">
          <div className="settings-section-head"><div><h2>General</h2><p>Workspace identity and service connections.</p></div></div>
          <div className="settings-card">
            <div className="settings-row"><div className="settings-row-icon"><Icon name="workspace" size={17} /></div><div className="settings-row-copy"><strong>Workspace name</strong><span>AI Research Workspace</span></div><button className="small-outline-button" disabled>Personal workspace</button></div>
            <div className="settings-row"><div className="settings-row-icon"><Icon name="database" size={17} /></div><div className="settings-row-copy"><strong>Backend API</strong><span>{getApiBaseUrl()}</span></div><span className={"connection-badge connection-" + apiState}><i />{apiState === "connected" ? "Connected" : apiState === "checking" ? "Checking" : "Offline"}</span></div>
            <div className="settings-row"><div className="settings-row-icon"><Icon name="agents" size={17} /></div><div className="settings-row-copy"><strong>Agent execution</strong><span>Agent workflows are not configured yet.</span></div><span className="settings-tag">Not configured</span></div>
          </div>
          <div className="settings-section-head data-head"><div><h2>Data & privacy</h2><p>Understand how workspace data is handled in this development build.</p></div></div>
          <div className="settings-info-card"><span className="settings-info-icon"><Icon name="shield" size={18} /></span><div><strong>Development storage</strong><p>Session and document metadata are stored in PostgreSQL. Uploaded file contents use local disk storage. Authentication and production object storage are not configured.</p></div></div>
          {apiState === "offline" && <button className="text-link retry-link" onClick={onRetry}><Icon name="refresh" size={15} />Retry API connection</button>}
        </div>
      </div>
    </section>
  );
}
