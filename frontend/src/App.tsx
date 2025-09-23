
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
import RGame from './components/game/remote/Game';
import "./App.css";
import { WebSocketProvider } from './components/chat/websocketContext';

import Dashboard from "./components/dashboard/dashboard";
import Page2FA from "./components/user/2fa";
import NewPassword from "./components/user/newPassword";
import ResetPasswordForm from "./components/user/passwordResetForm";
import Layout from "./components/layout/layout";
import Tournament from './components/tournament/tournament';
import Pairing from './components/match/Match';
import { Tournaments } from './components/tournament/tournaments';
import TournamentBracket from './components/tournament/Bracket';
import Profile from "./components/user/profile";
import notFound from "./components/error/404";
import checkBlockLoader from "./components/loaders/checkBlock";
import {
  checkAuthLoader,
  checkLoginPageLoader,
} from "./components/loaders/checkAuthUser";
import { check2FALoader } from "./components/loaders/check2fa";

export default function App() {
  let router = createBrowserRouter([
    {
      element: (
        <WebSocketProvider>
          <Layout />
        </WebSocketProvider>
      ),
      loader: checkAuthLoader,
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
        {
          path: "/profile",
          Component: Profile,
        },
        {
          path: "/profile/:username",
          Component: Profile,
          loader: checkBlockLoader,
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
      loader: checkLoginPageLoader,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/verify",
      Component: Page2FA,
      loader: check2FALoader
    },
    {
      path: "/reset-password",
      Component: ResetPasswordForm,
    },
    {
      path: "/reset-password/new",
      Component: NewPassword,
    },
    {
      path: '/remote_game',
      Component: RGame
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
    },
    {
      path: '/bracket/:id',
      element: (
        <WebSocketProvider>
          <TournamentBracket />
        </WebSocketProvider>
      )
    },
    {
      path: "/404",
      Component: notFound,
    },
  ]);
  return <RouterProvider router={router} />;
}
