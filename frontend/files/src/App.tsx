import { Routes, Route, BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import Game from "./components/game/game";
import Login from "./components/user/login";
import Register from "./components/user/register";
import Chat from "./components/chat/chat";
import RGame from "./components/game/remote/Game";
import { WebSocketProvider } from "./components/contexts/websocketContext";
import Dashboard from "./components/dashboard/dashboard";
import Page2FA from "./components/user/2fa";
import NewPassword from "./components/user/newPassword";
import ResetPasswordForm from "./components/user/passwordResetForm";
import Layout from "./components/layout/layout";
import Pairing from "./components/match/Match";
import { Tournaments } from "./components/tournament/tournaments";
import TournamentBracket from "./components/tournament/Bracket";
import Profile from "./components/user/profile";
import notFound from "./components/error/404";
import checkBlockLoader from "./components/loaders/checkBlock";
import { checkAuthLoader, checkLoginPageLoader } from "./components/loaders/checkAuthUser";
import checkFirstLoginLoader from "./components/loaders/checkFirstLogin";
import { check2FALoader } from "./components/loaders/check2fa";
import AvatarSelection from "./components/user/avatar";
import { UserContext, UserProvider } from "./components/contexts/userContext";
import Home from "./components/home/home";
import { Leaderboard } from "./components/game/leaderboard";

export default function App() {
  let router = createBrowserRouter([
    {
      element: (
        <WebSocketProvider>
          <UserProvider>
            <Layout />
          </UserProvider>
        </WebSocketProvider>
      ),
      loader: checkAuthLoader,
      children: [
        {
          path: "/dashboard",
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
        {
          path: "/leaderboard",
          Component: Leaderboard,
        },
        {
          path: "/tournaments",
          Component: Tournaments,
        },
        {
          path: "/pairing",
          Component: Pairing,
        },
        {
          path: "/bracket/:id",
          Component: TournamentBracket,
        },
      ],
    },
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/game",
      Component: Game,
    },
    {
      path: "/remote_game",
      element: (
        <WebSocketProvider>
          <UserProvider>
            <RGame />
          </UserProvider>
        </WebSocketProvider>
      ),
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
      loader: check2FALoader,
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
      path: "/avatar",
      element: (
        <UserProvider>
          <AvatarSelection />
        </UserProvider>
      ),
      loader: checkFirstLoginLoader,
    },
    {
      path: "*",
      Component: notFound,
    },
  ]);
  return <RouterProvider router={router} />;
}
