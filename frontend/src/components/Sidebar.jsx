import React from "react";
import { Menu, Drawer } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  SlackOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, drawerOpen, setDrawerOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "Dashboard", key: "/admin", icon: <DashboardOutlined /> },
    { label: "Slider", key: "/admin/slider", icon: <SlackOutlined /> },
    {
      label: "Main Category",
      key: "/admin/main-category",
      icon: <SlackOutlined />,
    },
    { label: "Category", key: "/admin/category", icon: <SlackOutlined /> },
    {
      label: "Sub Category",
      key: "/admin/sub-category",
      icon: <SlackOutlined />,
    },
    {
      label: "Product",
      key: "/admin/product-manager",
      icon: <ShoppingOutlined />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen border-r shadow-lg bg-white fixed top-0 left-0 transition-all duration-300 z-50 ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center justify-center font-bold text-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
          {!collapsed ? "Admin Panel" : "AP"}
        </div>

        <div className="flex-1 overflow-auto mt-16">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => navigate(key)}
            className="border-0"
          />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <span className="font-bold text-lg text-indigo-600">Admin Menu</span>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => {
            navigate(key);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
}
