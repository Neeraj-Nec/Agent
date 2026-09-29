import { useCallback, useEffect, useState } from "react";
import { AppShell, type WorkspaceView } from "../components/layout/AppShell";
import { AgentsPage } from "../features/agents/AgentsPage";
import { DocumentsPage } from "../features/documents/DocumentsPage";
import { WorkspacePage } from "../features/chat/WorkspacePage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { createSession, getHealth, listAgents, listDocuments, listSessions } from "../services/api/client";
import type { AgentMetadata, WorkspaceDocument, WorkspaceSession } from "../types/api";

type ApiState = "checking" | "connected" | "offline";

export function AppRouter() {
  const [view, setView] = useState<WorkspaceView>("workspace");
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState("");
  const [sessions, setSessions] = useState<WorkspaceSession[]>([]);
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshHealth = useCallback(async () => {
    setApiState("checking");
    try {
      await getHealth();
      setApiState("connected");
    } catch {
      setApiState("offline");
    }
  }, []);

  const refreshAgents = useCallback(async () => {
    setAgentsLoading(true);
    setAgentsError("");
    try {
      const result = await listAgents();
      setAgents(result);
      setSelectedAgentId((current) => current || result[0]?.agent_id || "");
    } catch (reason) {
      setAgentsError(reason instanceof Error ? reason.message : "Could not load agents.");
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  const refreshDocuments = useCallback(async () => {
    try { setDocuments(await listDocuments()); } catch { setDocuments([]); }
  }, []);

  const refreshSessions = useCallback(async () => {
    try {
      setSessions(await listSessions());
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    void refreshHealth();
    void refreshAgents();
    void refreshSessions();
    void refreshDocuments();
  }, [refreshHealth, refreshAgents, refreshSessions, refreshDocuments]);

  async function startNewSession() {
    try {
      const session = await createSession("New research");
      setSessions((current) => [session, ...current]);
      setActiveSessionId(session.id);
      setView("workspace");
      setSidebarOpen(false);
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "Could not create a session. Check PostgreSQL.");
    }
  }

  function selectSession(session: WorkspaceSession) {
    setActiveSessionId(session.id);
    setView("workspace");
    setSidebarOpen(false);
  }

  return (
    <AppShell
      view={view}
      onViewChange={setView}
      sessions={sessions}
      activeSessionId={activeSessionId}
      onNewSession={() => void startNewSession()}
      onSelectSession={selectSession}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((open) => !open)}
      apiState={apiState}
    >
      {view === "workspace" && (
        <WorkspacePage
          agents={agents}
          documents={documents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          onOpenDocuments={() => setView("documents")}
          sessionId={activeSessionId}
        />
      )}
      {view === "documents" && <DocumentsPage onDocumentsChanged={() => void refreshDocuments()} />}
      {view === "agents" && <AgentsPage agents={agents} loading={agentsLoading} error={agentsError} onRetry={() => void refreshAgents()} />}
      {view === "settings" && <SettingsPage apiState={apiState} onRetry={() => void refreshHealth()} />}
    </AppShell>
  );
}
