import { useState, type FormEvent } from "react";
import type { AgentMetadata, WorkspaceDocument } from "../../types/api";
import { sendChat } from "../../services/api/client";
import { Icon } from "../../components/ui/Icon";

interface WorkspacePageProps {
  agents: AgentMetadata[];
  documents: WorkspaceDocument[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onOpenDocuments: () => void;
  sessionId: string | null;
}

const suggestions = [
  { label: "Synthesize my sources", prompt: "Synthesize the key ideas across my uploaded sources." },
  { label: "Compare perspectives", prompt: "Compare the main perspectives represented in my sources." },
  { label: "Find supporting evidence", prompt: "Find evidence in my sources for this research question: " },
];

export function WorkspacePage({
  agents, documents, selectedAgentId, onSelectAgent, onOpenDocuments, sessionId,
}: WorkspacePageProps) {
  const [prompt, setPrompt] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || !selectedAgentId || working) return;
    setWorking(true);
    setError("");
    try {
      await sendChat(text, selectedAgentId, sessionId ?? undefined);
      setPrompt("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The request could not be completed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="workspace-grid">
      <section className="workspace-main-column">
        <div className="workspace-heading">
          <div className="eyebrow"><span className="eyebrow-mark"><Icon name="sparkle" size={13} /></span> YOUR RESEARCH DESK</div>
          <h1>Make sense of<br /><span>what you know.</span></h1>
          <p className="workspace-intro">Ask a question, bring your sources, and build a clearer picture of the evidence.</p>
        </div>

        <div className="agent-toolbar">
          <div className="agent-select-label"><span className="agent-select-icon"><Icon name="agents" size={15} /></span><span>Research with</span></div>
          {agents.length > 0 ? (
            <select value={selectedAgentId} onChange={(event) => onSelectAgent(event.target.value)} aria-label="Choose an agent">
              {agents.map((agent) => <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>)}
            </select>
          ) : (
            <span className="agent-preview-name">RAG research workflow</span>
          )}
          <span className="agent-preview-badge">{agents.length > 0 ? "READY" : "PREVIEW"}</span>
        </div>

        {agents.length === 0 && (
          <div className="inline-notice">
            <span className="notice-dot" />
            <span>The workspace UI is ready. Register a backend agent to enable research conversations.</span>
            <button onClick={onOpenDocuments}>Add sources <Icon name="chevron" size={14} /></button>
          </div>
        )}

        <div className="prompt-label">START WITH A QUESTION</div>
        <form className="composer-card" onSubmit={submit}>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="What would you like to explore?"
            rows={3}
            aria-label="Research question"
          />
          <div className="composer-footer">
            <div className="composer-context">
              <button type="button" className="context-pill" onClick={onOpenDocuments}>
                <Icon name="library" size={14} />
                <span>{documents.length ? documents.length + " sources" : "Add sources"}</span>
                <Icon name="plus" size={13} />
              </button>
              <span className="composer-hint">Answers will use selected sources when RAG is connected.</span>
            </div>
            <button className="send-button" type="submit" disabled={!prompt.trim() || !selectedAgentId || working} aria-label="Send research question">
              {working ? <span className="send-spinner" /> : <Icon name="arrow-up" size={17} />}
            </button>
          </div>
        </form>
        {error && <div className="request-error"><Icon name="alert" size={16} /><span>{error}</span></div>}

        <div className="suggestion-heading"><span>IDEAS TO GET YOU STARTED</span><span className="suggestion-line" /></div>
        <div className="suggestion-grid">
          {suggestions.map((item, index) => (
            <button key={item.label} className="suggestion-card" onClick={() => setPrompt(item.prompt)}>
              <span className={"suggestion-icon suggestion-icon-" + index}><Icon name={index === 0 ? "file" : index === 1 ? "filter" : "search"} size={17} /></span>
              <span>{item.label}</span><Icon name="chevron" size={14} className="suggestion-arrow" />
            </button>
          ))}
        </div>

        <div className="pipeline-card">
          <div className="pipeline-topline"><span className="pipeline-kicker">HOW GROUNDED RESEARCH WILL WORK</span><span className="planned-label">WORKFLOW PREVIEW</span></div>
          <div className="pipeline-steps">
            <div className="pipeline-step"><span className="pipeline-step-number">01</span><span className="pipeline-step-icon"><Icon name="library" size={16} /></span><div><strong>Retrieve</strong><small>Find relevant passages</small></div></div>
            <span className="pipeline-connector" />
            <div className="pipeline-step"><span className="pipeline-step-number">02</span><span className="pipeline-step-icon"><Icon name="filter" size={16} /></span><div><strong>Review</strong><small>Rank useful evidence</small></div></div>
            <span className="pipeline-connector" />
            <div className="pipeline-step"><span className="pipeline-step-number">03</span><span className="pipeline-step-icon"><Icon name="sparkle" size={16} /></span><div><strong>Respond</strong><small>Answer with sources</small></div></div>
          </div>
        </div>
      </section>

      <aside className="workspace-side-column">
        <div className="side-panel-heading"><div><span className="eyebrow">RESEARCH CONTEXT</span><h2>Your source shelf</h2></div><button className="subtle-icon-button" onClick={onOpenDocuments} aria-label="Open sources"><Icon name="external" size={16} /></button></div>
        <button className="source-summary-card" onClick={onOpenDocuments}>
          <span className="source-summary-icon"><Icon name="library" size={18} /></span>
          <span className="source-summary-copy"><strong>My documents</strong><small>{documents.length} {documents.length === 1 ? "source" : "sources"} available</small></span>
          <Icon name="chevron" size={15} />
        </button>
        {documents.length > 0 ? (
          <div className="source-mini-list">
            {documents.slice(0, 3).map((document) => (
              <div className="source-mini-row" key={document.id}><span className="document-type-icon"><Icon name="file" size={15} /></span><span>{document.file_name}</span></div>
            ))}
            {documents.length > 3 && <button className="text-link" onClick={onOpenDocuments}>View all {documents.length} sources</button>}
          </div>
        ) : (
          <div className="source-empty">
            <div className="empty-stack"><span /><span /><span><Icon name="plus" size={14} /></span></div>
            <strong>Your library starts here</strong>
            <p>Upload papers, notes, and reports to make them available for grounded research.</p>
            <button className="outline-button" onClick={onOpenDocuments}><Icon name="upload" size={15} /> Add source files</button>
          </div>
        )}

        <div className="side-divider" />
        <div className="side-panel-heading compact-heading"><div><span className="eyebrow">RETRIEVAL SETTINGS</span><h2>Source scope</h2></div></div>
        <button className="scope-selector" onClick={onOpenDocuments}>
          <span className="scope-icon"><Icon name="database" size={16} /></span><span><strong>All documents</strong><small>Use the whole source shelf</small></span><Icon name="chevron" size={15} />
        </button>
        <div className="scope-footnote"><Icon name="shield" size={14} /><span>Sources are saved to this workspace.</span></div>

        <div className="research-note">
          <span className="research-note-icon"><Icon name="sparkle" size={16} /></span>
          <div><strong>Built for careful research</strong><p>Keep answers connected to the material you provide.</p></div>
        </div>
      </aside>
    </div>
  );
}
