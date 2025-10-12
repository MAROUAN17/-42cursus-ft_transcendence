import type { UserInfos } from "./user";
import type { messagePacket } from "./websocket";

export interface UsersLastMessage {
  user: UserInfos;
  unreadCount: number;
  blockedByUser: boolean;
  blockedByOther: boolean;
  lastMessage: messagePacket | undefined;
}