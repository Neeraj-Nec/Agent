import type { SVGProps } from "react";
export type IconName = "workspace" | "library" | "agents" | "settings" | "search" | "plus" | "chevron" | "sparkle" | "upload" | "arrow-up" | "file" | "clock" | "menu" | "close" | "external" | "check" | "alert" | "trash" | "message" | "filter" | "more" | "shield" | "database" | "refresh";
const paths: Record<IconName, string> = {
  workspace: "M3 3h8v8H3z M13 3h8v5h-8z M13 10h8v11h-8z M3 13h8v8H3z",
  library: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  agents: "M12 8V4H8 M12 4l3 3 M8 12H4v4 M4 12l3-3 M16 12h4v4 M20 12l-3-3 M12 16v4h4 M12 20l-3-3",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19 14l2 1v3l-2 1-2-1-2 1h-3l-1-2-2-1-2 1-2-2 1-2-1-2 2-2 2 1 2-1 1-2h3l1 2 2 1 2-1 2 2-1 2z",
  search: "m20 20-4.4-4.4 M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z",
  plus: "M12 5v14 M5 12h14", chevron: "m9 18 6-6-6-6",
  sparkle: "m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z M19 14l1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14z",
  upload: "M12 16V4m0 0L7 9m5-5 5 5 M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3",
  "arrow-up": "M12 19V5m0 0-7 7m7-7 7 7",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8",
  clock: "M12 8v4l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  menu: "M4 6h16 M4 12h16 M4 18h16", close: "M18 6 6 18 M6 6l12 12",
  external: "M14 3h7v7 M10 14 21 3 M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6",
  check: "m5 12 4 4L19 6",
  alert: "M12 9v4 M12 17h.01 M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v5 M14 11v5",
  message: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z",
  filter: "M4 7h16 M7 12h10 M10 17h4", more: "M5 12h.01 M12 12h.01 M19 12h.01",
  shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z M9 12l2 2 4-4",
  database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  refresh: "M20 7v5h-5 M4 17v-5h5 M5.6 9a7 7 0 0 1 11.5-2L20 12 M4 12l2.9 5a7 7 0 0 0 11.5-2",
};
export function Icon({ name, size = 18, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}><path d={paths[name]} /></svg>;
}
