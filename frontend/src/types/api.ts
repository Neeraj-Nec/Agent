export interface ApiErrorBody { detail?: string; }
export interface AgentMetadata { agent_id: string; name: string; description: string; capabilities: string[]; version: string; status: string; }
export interface WorkspaceSession { id: string; title: string | null; created_at: string; updated_at: string; }
export interface WorkspaceDocument { id: string; file_name: string; media_type: string; size_bytes: number; sha256: string; created_at: string; }

export interface AgentEvent {
  type: string;
  executionId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}
