import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
import Dashboard from './components/dashboard/dashboard';
import Page2FA from "./components/user/2fa";
import checkAuthLoader from "../src/loaders/checkAuth";
import PasswordReset from "./components/user/passwordReset";

export default function App() {
  let router = createBrowserRouter([
    {
      path: '/',
      Component: Dashboard,
    },
    {
      path: '/game',
      Component: Game,
    },
    {
      path: '/login',
      Component: Login,
      loader: checkAuthLoader
    },
    {
      path: '/register',
      Component: Register,
    },
    {
      path: '/chat',
      Component: Chat,
    },
    {
      path: '/verify',
      Component: Page2FA,
      loader: checkAuthLoader
    },
    {
      path: '/password-reset',
      Component: PasswordReset,
    },
  ])
  return (
      <RouterProvider router={router} />
  )
}

