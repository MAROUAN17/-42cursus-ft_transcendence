import { useState, createContext, useContext, useEffect, useRef } from "react";
import type { websocketContextType, websocketPacket } from "../../types/websocket";

const WebsocketContext = createContext<websocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (msg: websocketPacket) => void>>(new Map<string, (msg: websocketPacket) => void>());
  function connectWs() {
    socketRef.current = new WebSocket("wss://localhost:5000/send-message");
    socketRef.current.onopen = () => {
      console.log("Socket Created!");
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
  }
  function addHandler(packetType: string, handler: (data: websocketPacket) => void) {
    if (!handlersRef.current.get(packetType)) handlersRef.current.set(packetType, handler);

    return () => {
      handlersRef.current.delete(packetType);
    };
  }
  return <WebsocketContext.Provider value={{ send, addHandler }}>{children}</WebsocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used inside WebsocketProvider!!!!");
  }
  return context;
};
