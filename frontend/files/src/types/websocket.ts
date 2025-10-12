export interface messagePacket {
  id?: number;
  tempId?: string;
  type: "message" | "markSeen" | "markDelivered" | "block";
  isDelivered: boolean;
  sender_id: number;
  recipient_id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
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
  type: "message" | "markSeen" | "friendReq" | "friendAccept";
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
export type websocketPacket = NotificationPacket | ChatPacket | OnlineStatusPacket | LogPacket;

export interface websocketContextType {
  send: (msg: string) => void;
  addHandler: (packetType: string, handler: (data: websocketPacket) => void) => void;
}
