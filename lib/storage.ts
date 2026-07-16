export interface StoredMessage {
  id: string;
  need: string;
  description: string;
  priority: string;
  anonName: string;
  location: { lat: number; lng: number } | null;
  locationLabel: string;
  analysis: {
    category: string;
    priority: string;
    summary: string;
    bestReceiver: string;
    keywords: string[];
    urgencyScore: number;
  } | null;
  status: "pending" | "routed" | "accepted" | "resolved";
  timestamp: number;
}

export function saveMessage(msg: StoredMessage): void {
  const existing = getMessages();
  existing.unshift(msg);
  localStorage.setItem("linkless_messages", JSON.stringify(existing.slice(0, 50)));
}

export function getMessages(): StoredMessage[] {
  try {
    const raw = localStorage.getItem("linkless_messages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateMessageStatus(
  id: string,
  status: StoredMessage["status"]
): void {
  const msgs = getMessages();
  const idx = msgs.findIndex((m) => m.id === id);
  if (idx !== -1) {
    msgs[idx].status = status;
    localStorage.setItem("linkless_messages", JSON.stringify(msgs));
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
