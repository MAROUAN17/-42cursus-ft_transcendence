export interface messagePacket {
  id?: number;
  tempId?: string;
  type: "message" | "markSeen" | "markDelivered";
  isDelivered: boolean;
  from?: string;
  to: string;
  message: string;
  createdAt?: string;
  isRead: boolean;
}
export interface messagePacketDB {
  id: number;
  sender: string;
  recipient: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
export interface RequestQuery {
  token: string;
}
export interface Payload {
  email: string;
  username: string;
}
