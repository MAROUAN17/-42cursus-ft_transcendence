import './App.css'
import { Routes, 
         Route, 
         BrowserRouter,
         createBrowserRouter,
         RouterProvider,
} from 'react-router';
import Game from './components/game/game'
import Login from "./components/user/login"
import Register from "./components/user/register"
import Chat from './components/chat/chat';
import tournament from './components/gametyping/tournament/Tournament';
import listTournament from './components/gametyping/listTournament/listTournament';

import RGame from './components/game/remote/Game';

import Dashboard from './components/dashboard/dashboard';
import Page2FA from "./components/user/2fa";
import checkAuthLoader from "../src/loaders/checkAuth";
import NewPassword from "./components/user/newPassword";
import ResetPasswordForm from "./components/user/passwordResetForm";
import { WebSocketProvider } from "./components/chat/websocketContext";
import Layout from "./components/layout/layout";
import type Tournament from './components/gametyping/listTournament/listTournament';
import Match from './components/match/Match';
import MatchMaking from './components/match/Match';

export default function App() {
  let router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        {
          path: "/",
          Component: Dashboard,
        },
        {
          path: "/chat",
          Component: Chat,
        },
        {
          path: "/chat/:username",
          Component: Chat,
        },
      ],
    },
    {
      path: "/game",
      Component: Game,
    },
    {
      path: "/login",
      Component: Login,
      loader: checkAuthLoader,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/verify",
      Component: Page2FA,
      loader: checkAuthLoader,
    },
    {
      path: '/reset-password',
      Component: ResetPasswordForm,
    },
    {
      path: '/reset-password/new',
      Component: NewPassword,
    },
    {
      path: '/remote_game',
      Component: RGame
    },
    {
      path: '/match',
      Component: MatchMaking
    },
    {
      path: '/tournament',
      Component: tournament
    },{
      path:'/listtournament',
      Component: listTournament
    }
  ]);
  return <RouterProvider router={router} />;
}
