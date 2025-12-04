import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col bg-slate-50 transition-all duration-300 ${
          collapsed ? "md:ml-18" : "md:ml-64"
        }`}
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setDrawerOpen={setDrawerOpen}
        />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Nested routes render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
