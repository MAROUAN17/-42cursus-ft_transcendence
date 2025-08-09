import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Game from './components/game/Game'
import Login from "./components/user/login"

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/game' element={<Game />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </div>
  )
}

