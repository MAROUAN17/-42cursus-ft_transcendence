import type { User } from "./user.model.js";

export interface messagePacket {
  id?: number;
  tempId?: string;
  type: "message" | "markSeen" | "markDelivered";
  isDelivered: boolean;
  sender_id: number;
  recipient_id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}
export interface UsersLastMessage {
  user: User;
  unreadCount: number;
  lastMessage: messagePacket | undefined;
}
export interface messagePacketDB {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}
export interface RequestQuery {
  token: string;
}
export interface Payload {
  id: number;
  email: string;
  username: string;
}
