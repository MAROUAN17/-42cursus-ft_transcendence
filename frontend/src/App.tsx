import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Game from './components/game/game'
import Login from "./components/user/login"
import Register from "./components/user/register"
import Chat from './components/chat/chat';
import Dashboard from './components/dashboard/dashboard';
import Page2FA from "./components/user/2fa";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path='/game' element={<Game />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/chat' element={<Chat />}/>
        <Route path="/verify" element={<Page2FA />}></Route>
      </Routes>
    </div>
  )
}

