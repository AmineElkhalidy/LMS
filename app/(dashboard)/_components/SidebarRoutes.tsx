"use client";

import React from "react";
import { Compass, Layout } from "lucide-react";
import SidebarItem from "./SidebarItem";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const SidebarRoutes = () => {
  const routes = guestRoutes;

  return (
    <div className="flex flex-col w-full gap-y-1">
      {routes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
