

import './App.css'
import { Routes, Route } from 'react-router-dom';
import Game from './components/game/game'
import Login from "./components/user/login"
import Register from "./components/user/register"
import Chat from './components/chat/chat';

import RGame from './components/game/remote/Game';

import Dashboard from './components/dashboard/dashboard';
import Tournament from './components/tournament/Tournament';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path='/game' element={<Game />}/>
        <Route path='/remote_game' element={<RGame />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/chat' element={<Chat />}/>
        <Route path='/tournament' element={<Tournament />}/>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
    </div>
  )
}
