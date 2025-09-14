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
import MatchMaking  from './components/gametyping/matchmaking/Matchmaking';
import RGame from './components/game/remote/Game';

import Dashboard from './components/dashboard/dashboard';
import Page2FA from "./components/user/2fa";
import checkAuthLoader from "../src/loaders/checkAuth";
import NewPassword from "./components/user/newPassword";
import ResetPasswordForm from "./components/user/passwordResetForm";
import Layout from "./components/layout/layout";
import Tournament from './components/tournament/tournament';
import GameTyping from './components/gametyping/game/gameTyping';
import Pairing from './components/match/Match';
import { Tournaments } from './components/tournament/tournaments';

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
      path: '/typing-game/tournament',
      Component: tournament
    },{
      path:'/typing-game/listtournament',
      Component: listTournament
    },{
      path:'/typing-game/game',
      Component: GameTyping
    },{
      path:'/typing-game/matchmaking',
      Component: MatchMaking
    },
    {
      path:'/match',
      Component: Pairing
    },
    {
      path:'/tournament',
      Component:Tournament,
    },
    {
      path: '/tournaments',
      Component: Tournaments,
    }
  ]);
  return <RouterProvider router={router} />;
}
