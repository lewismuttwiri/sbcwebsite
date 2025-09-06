const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "open" | "in-progress" | "resolved";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export async function fetchTickets(date: Date): Promise<Ticket[]> {
  try {
    const dateString = date.toISOString().split("T")[0];
    const response = await fetch(`${API_BASE_URL}/tickets?date=${dateString}`, {
      credentials: "include", // For session-based auth if you're using it
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }

    const data = await response.json();
    return data.map((ticket: any) => ({
      id: ticket.id.toString(),
      customerName: ticket.customer_name || "Unknown",
      customerEmail: ticket.customer_email || "",
      status: ticket.status || "open",
      lastMessage: ticket.last_message || "",
      lastMessageTime: ticket.last_message_time || new Date().toISOString(),
      unreadCount: ticket.unread_count || 0,
    }));
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update ticket status");
    }
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
}
