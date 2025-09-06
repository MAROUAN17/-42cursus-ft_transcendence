import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { WebSocketProvider } from "./components/chat/websocketContext.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <WebSocketProvider> */}
      <App />
    {/* </WebSocketProvider> */}
  </StrictMode>
);
