import type { User, userInfos } from "./user.model.js";

export interface messagePacket {
  id?: number;
  tempId?: string;
  type: "message" | "markSeen" | "markDelivered" | "block" | "gameInvite" | "inviteAccepted" | "inviteDeclined";
  isDelivered: boolean;
  sender_id: number;
  recipient_id: number;
  isAccepted: boolean;
  message: string;
  createdAt: string;
  isRead: boolean;
}
export interface UsersLastMessage {
  user: userInfos;
  unreadCount: number;
  blockedByUser: boolean;
  blockedByOther: boolean;
  lastMessage: messagePacket | undefined;
}
export interface messagePacketDB {
  id: number;
  sender_id: number;
  recipient_id: number;
  type: "message" | "gameInvite";
  isAccepted: boolean;
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
  rememberMe: boolean;
}
