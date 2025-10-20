import { useState, createContext, useContext, useEffect, useRef } from "react";
import type { websocketContextType, websocketPacket } from "../../types/websocket";

const WebsocketContext = createContext<websocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const queueRef = useRef<string[]>([]);
  const [gameInvite, setGameInvite] = useState<"sender" | "recipient" | "tournamentStart" | undefined>(undefined);
  const [opponentName, setOpponentName] = useState<string | undefined>(undefined);
  const handlersRef = useRef<Map<string, (msg: websocketPacket) => void>>(new Map<string, (msg: websocketPacket) => void>());
  function connectWs() {
    socketRef.current = new WebSocket(`${import.meta.env.VITE_SOCKET_BACKEND_URL}/send-message`);
    socketRef.current.onopen = () => {
      console.log("Socket Created!");
      while (queueRef.current.length > 0) {
        if (queueRef.current && socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
          let msg = queueRef.current.shift();
          if (msg) socketRef.current?.send(msg);
        }
      }
    };

    socketRef.current.onclose = () => {
      setTimeout(() => {
        connectWs();
      }, 1000);
    };
    socketRef.current.onmessage = (event) => {
      const data: websocketPacket = JSON.parse(event.data.toString());
      const handler = handlersRef.current.get(data.type);
      if (handler) handler(data);
    };
    socketRef.current.onerror = function () {
      socketRef.current?.close();
    };
  }
  useEffect(() => {
    try {
      connectWs();
    } catch (error) {}

    return () => {
      socketRef.current?.close();
    };
  }, []);
  function send(msg: string) {
    console.log("sent to server");
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) socketRef.current.send(msg);
    else queueRef.current.push(msg);
    console.log("queue -> ", queueRef.current);
  }
  function addHandler(packetType: string, handler: (data: websocketPacket) => void) {
    if (!handlersRef.current.get(packetType)) handlersRef.current.set(packetType, handler);

    return () => {
      handlersRef.current.delete(packetType);
    };
  }
  return (
    <WebsocketContext.Provider value={{ send, addHandler, gameInvite, setGameInvite, opponentName, setOpponentName }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used inside WebsocketProvider!!!!");
  }
  return context;
};
