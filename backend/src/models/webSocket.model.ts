import type { messagePacket } from "./chat.js";
import type { userInfos } from "./user.model.js";

export interface ChatPacket {
  type: "chat";
  data: messagePacket;
}

export interface NotificationPacket {
  type: "notification";
  data: notificationPacket;
}

export interface notificationPacket {
  id: number;
  type: "message" | "markSeen" | "friendReq" | "friendAccept";
  username: string;
  sender_id: number;
  recipient_id: number;
  message?: string;
  unreadCount?: number;
  createdAt: string;
}
export interface notificationPacketDB {
  id: number;
  type: string;
  sender_id: number;
  username: string;
  recipient_id: number;
  message: string;
  isRead: boolean;
  unreadCount: number;
  updatedAt: string;
}
export type websocketPacket = NotificationPacket | ChatPacket;
export interface websocketContextType {
  send: (msg: string) => void;
  addHandler: (
    packetType: string,
    handler: (data: websocketPacket) => void
  ) => void;
  user: userInfos | null;
}
