import type { AgentMetadata, ApiErrorBody, WorkspaceDocument, WorkspaceSession } from "../../types/api";
const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api/v1").replace(/\/$/, "");
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(baseUrl + path, init);
  if (!response.ok) {
    let detail = "Request failed (" + response.status + ")";
    try {
      const body = (await response.json()) as ApiErrorBody;
      detail = body.detail ?? detail;
    } catch { /* Preserve the HTTP status message without a JSON body. */ }
    throw new Error(detail);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
export function getApiBaseUrl(): string { return baseUrl; }
export function getHealth(): Promise<{ status: string }> { return request("/health"); }
export function listAgents(): Promise<AgentMetadata[]> { return request("/agents"); }
export function listSessions(): Promise<WorkspaceSession[]> { return request("/sessions"); }
export function createSession(title?: string): Promise<WorkspaceSession> {
  return request("/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
}
export function listDocuments(): Promise<WorkspaceDocument[]> { return request("/documents"); }
export function uploadDocument(file: File): Promise<WorkspaceDocument> {
  const data = new FormData();
  data.append("file", file);
  return request("/documents", { method: "POST", body: data });
}
export function deleteDocument(documentId: string): Promise<void> {
  return request("/documents/" + documentId, { method: "DELETE" });
}
export function sendChat(message: string, agentId: string, sessionId?: string) {
  return request<{ status: string; detail: string }>("/chat", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, agent_id: agentId, session_id: sessionId }),
  });
}
