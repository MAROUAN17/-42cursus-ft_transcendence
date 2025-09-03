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

import Dashboard from './components/dashboard/dashboard';
import Page2FA from "./components/user/2fa";
import NewPassword from "./components/user/newPassword";
import ResetPasswordForm from "./components/user/passwordResetForm";
import { WebSocketProvider } from "./components/chat/websocketContext";
import Layout from "./components/layout/layout";
import Setup2FA from "./components/user/setup2FA";
import type { UserInfo } from './types/user';
import Profile from "./components/user/profile"

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
        {
          path: '/profile',
          Component: Profile
        }
      ],
    },
    {
      path: "/game",
      Component: Game,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    },
    {
      path: "/verify",
      Component: Page2FA,
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
  ]);
  return <RouterProvider router={router} />;
}
