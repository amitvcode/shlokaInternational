import React from "react";
import { Input, Avatar, Dropdown, Badge } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";

export default function Header({ collapsed, setCollapsed, setDrawerOpen }) {
  const menu = {
    items: [
      { key: "1", label: "Profile" },
      { key: "2", label: "Logout" },
    ],
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Desktop Toggle */}
        <button
          className="hidden md:block p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setCollapsed((s) => !s)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuOutlined />
        </button>

        <div className="hidden sm:block text-lg font-semibold text-gray-700">
          Dashboard
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search (hidden on xs) */}
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-64 hidden lg:block"
        />

        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
        </Badge>

        <Dropdown menu={menu} placement="bottomRight" trigger={["click"]}>
          <Avatar src="/avatar.png" style={{ cursor: "pointer" }} />
        </Dropdown>
      </div>
    </header>
  );
}
