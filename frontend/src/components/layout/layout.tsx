import React from "react";
import { Outlet } from "react-router";
import Navbar from "./navbar";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
export default Layout;
