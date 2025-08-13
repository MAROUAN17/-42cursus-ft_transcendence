
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Game from './components/game/game'
import Login from "./components/user/login"
import Chat from './components/chat/chat';
import RGame from './components/game/remote/Game';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/game' element={<Game />}/>
        <Route path='/remote_game' element={<RGame />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/chat' element={<Chat />}/>
      </Routes>
    </div>
  )
}
