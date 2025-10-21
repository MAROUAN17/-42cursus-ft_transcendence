import type { RefObject } from "react";

export interface messagePacket {
  id?: number;
  tempId?: string;
  type: "message" | "markSeen" | "markDelivered" | "block" | "gameInvite" | "inviteAccepted" | "inviteDeclined";
  isDelivered: boolean;
  sender_id: number;
  recipient_id: number;
  message: string;
  isAccepted?: boolean;
  createdAt: string;
  isRead: boolean;
}

export interface EventPacket {
  type: "gameEvent";
  data: {
    tournamentId: number;
    tournamentName?: string;
    senderId?: number;
    round: number;
    admin: number;
  };
}

export interface LogPacket {
  type: "logNotif";
  data: {
    id: string;
    is_new?: boolean;
    is_removed: boolean;
    winner: string;
    avatar: string;
    loser?: string;
    game_type: "1v1" | "tournament";
    score: number;
    tournament_name?: string;
    timestamps: string;
  };
}

export interface ChatPacket {
  type: "chat";
  data: messagePacket;
}

export interface NotificationPacket {
  type: "notification";
  data: notificationPacket;
}
export interface OnlineStatusPacket {
  type: "onlineStatus";
  data: {
    type: "singleFriend" | "friendsList";
    friends_list?: number[];
    friend_id: number;
    online: boolean;
  };
}

export interface notificationPacket {
  id: number;
  type: "message" | "markSeen" | "friendReq" | "friendAccept" | "friendAccept" | "gameAlert";
  username: string;
  avatar: string;
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
  avatar: string;
  recipient_id: number;
  message: string;
  isRead: boolean;
  unreadCount: number;
  updatedAt: string;
}
export type websocketPacket = NotificationPacket | ChatPacket | OnlineStatusPacket | LogPacket | EventPacket;

export interface websocketContextType {
  send: (msg: string) => void;
  socketRef: RefObject<WebSocket | null>;
  addHandler: (packetType: string, handler: (data: websocketPacket) => void) => void;
  gameInvite: "sender" | "recipient" | "tournamentStart" | undefined;
  setGameInvite: (bool: "sender" | "recipient" | "tournamentStart" | undefined) => void;
  opponentName: string | undefined;
  setOpponentName: React.Dispatch<React.SetStateAction<string | undefined>>;
}
