import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Game from "./components/game/game";
import Login from "./components/user/login";
import Register from "./components/user/register";
import Chat from "./components/chat/chat";
import Dashboard from "./components/dashboard/dashboard";
import { WebSocketProvider } from "./components/chat/websocketContext";
import Layout from "./components/layout/layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/game" element={<Game />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:username" element={<Chat />} />
      </Route>
    </Routes>
  );
}
