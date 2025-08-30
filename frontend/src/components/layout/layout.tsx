import React from "react";
import { Outlet } from "react-router";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

function Layout() {
  return (
    <div className="flex flex-col bg-darkBg h-screen">
      <Navbar />
      <div className="flex flex-row h-screen">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
export default Layout;
