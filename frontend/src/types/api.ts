export type AgentEventType = "agent_started" | "agent_completed" | "tool_started" | "tool_completed" | "retrieval_started" | "retrieval_completed" | "generation_started" | "message" | "error" | "final_response";
export interface AgentEvent { type: AgentEventType; executionId: string; timestamp: string; payload: Record<string, unknown>; }
