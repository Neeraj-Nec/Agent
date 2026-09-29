import type { AgentMetadata } from "../../types/api";
import { Icon } from "../../components/ui/Icon";

interface AgentsPageProps {
  agents: AgentMetadata[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

export function AgentsPage({ agents, loading, error, onRetry }: AgentsPageProps) {
  return (
    <section className="section-page">
      <div className="page-heading-row">
        <div><div className="eyebrow">WORKSPACE CAPABILITIES</div><h1>Agent directory</h1><p className="page-description">Choose the right research workflow for the question you are exploring.</p></div>
        <span className="directory-count">{agents.length} registered</span>
      </div>
      {error && <div className="page-alert"><Icon name="alert" size={17} /><span>{error}</span><button onClick={onRetry}>Retry</button></div>}
      {loading ? <div className="agent-loading"><span className="loading-spinner" />Loading registered agents?</div> :
        agents.length ? (
          <div className="agent-card-grid">
            {agents.map((agent, index) => (
              <article className="agent-directory-card" key={agent.agent_id}>
                <div className={"agent-card-art agent-art-" + (index % 3)}><span className="agent-art-orb"><Icon name="sparkle" size={21} /></span><span className="agent-art-grid" /></div>
                <div className="agent-card-body">
                  <div className="agent-title-line"><h2>{agent.name}</h2><span className="registered-pill"><i />{agent.status}</span></div>
                  <p>{agent.description}</p>
                  <div className="capability-list">{agent.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
                  <div className="agent-card-foot"><span>v{agent.version}</span><span className="agent-id">{agent.agent_id}</span></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="agents-empty-state">
            <div className="agent-empty-art"><span className="agent-empty-ring ring-one" /><span className="agent-empty-ring ring-two" /><span className="agent-empty-core"><Icon name="sparkle" size={24} /></span><i className="orbit-dot orbit-dot-one" /><i className="orbit-dot orbit-dot-two" /></div>
            <span className="eyebrow">YOUR WORKFLOWS, IN ONE PLACE</span>
            <h2>Your agent directory is ready.</h2>
            <p>Once an agent is registered by the backend, it will appear here with its capabilities and version. Your RAG workflow can live alongside other research agents in this same workspace.</p>
            <div className="empty-agent-capabilities">
              <span><Icon name="library" size={15} />Document-grounded research</span>
              <span><Icon name="agents" size={15} />More agent types later</span>
            </div>
            {!error && <span className="empty-agent-note">No agents are currently registered by the API.</span>}
          </div>
        )}
    </section>
  );
}
