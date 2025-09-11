import { useState, createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  type notificationPacket,
  type websocketContextType,
  type websocketPacket,
} from "../../../../backend/src/models/webSocket.model";
import type { ProfileUserInfo } from "../../types/user";
import api from "../../axios";

const WebsocketContext = createContext<websocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUserInfo | null>({
    id: 0,
    avatar: "",
    username: "",
    email: "",
  });
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (msg: websocketPacket) => void>>(
    new Map<string, (msg: websocketPacket) => void>()
  );
  function connectWs() {
    const ws = new WebSocket("wss://localhost:5000/send-message");
    socketRef.current = ws;
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
      ws.close();
    };
  }
  useEffect(() => {
    try {
      connectWs();
      api
        .get("/user", { withCredentials: true })
        .then(function (res) {
          setUser(res.data.infos);
        })
        .catch(function (err) {
          console.log(err);
          if (
            err.response.status == 401 &&
            err.response.data.error == "Unauthorized"
          )
            navigate("/login");
        });
    } catch (error) {}

    return () => {
      socketRef.current?.close();
    };
  }, []);
  function send(msg: string) {
    console.log("sent to server");
    if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN)
      socketRef.current.send(msg);
  }
  function addHandler(
    packetType: string,
    handler: (data: websocketPacket) => void
  ) {
    if (!handlersRef.current.get(packetType))
      handlersRef.current.set(packetType, handler);

    return () => {
      handlersRef.current.delete(packetType);
    };
  }
  return (
    <WebsocketContext.Provider value={{ send, addHandler, user }}>
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
