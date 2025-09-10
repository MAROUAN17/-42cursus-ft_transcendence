import { createContext, useContext, useEffect, useRef } from "react";
import {
  type notificationPacket,
  type websocketContextType,
  type websocketPacket,
} from "../../../../backend/src/models/webSocket.model";
import type { messagePacket } from "../../../../backend/src/models/chat";

const WebsocketContext = createContext<websocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (msg: websocketPacket) => void>>(
    new Map<string, (msg: websocketPacket) => void>()
  );
  function connectWs() {
    const ws = new WebSocket("wss://localhost:5000/send-message");
    //console.log("socketRef -> ", socketRef.current);
    socketRef.current = ws;
    socketRef.current.onopen = () => {
      //console.log("Socket Created!");
      //console.log("ws ->", ws.readyState);
    };

    socketRef.current.onclose = () => {
      //console.log("closing ws");
      setTimeout(() => {
        //console.log("Retrying-----------------------");
        connectWs();
      }, 1000);
    };
    socketRef.current.onmessage = (event) => {
      const data: websocketPacket = JSON.parse(event.data.toString());
      const handler = handlersRef.current.get(data.type);
      if (handler) handler(data);
    };
    socketRef.current.onerror = function (err: any) {
      //console.log("Socket encountered error: ", err.message, "Closing socket");
      ws.close();
    };
  }
  useEffect(() => {
    try {
      //connectWs();
    } catch (error) {
      //console.log("this is ws error -> ", error);
    }

    return () => {
      //console.log("Closing WebSocket...");
      socketRef.current?.close();
    };
  }, []);
  function send(msg: string) {
    //console.log("sending packet!");
    //console.log("socketRef.current.readyState -> ", socketRef.current?.readyState);
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
