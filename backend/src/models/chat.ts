export interface messagePacket {
  from: string;
  to: string;
  message: string;
}
export interface messagePacketDB {
  id: number
  sender: string;
  recipient: string;
  message: string;
}
export interface RequestQuery {
  token: string;
}
export interface Payload {
  email: string;
  username: string;
}
