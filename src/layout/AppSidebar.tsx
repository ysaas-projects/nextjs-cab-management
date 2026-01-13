"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import Icon from "@/components/atoms/Icon";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  roles?: string[];
  path?: string;
};

const navItems: NavItem[] = [
  { icon: <Icon name="BoxCubeIcon" />, name: "Dashboard", path: "/" },
  { icon: <Icon name="BoxCubeIcon" />, name: "Cabs", path: "/cabs"},
  { icon: <Icon name="BoxCubeIcon" />, name: "Pricing Rules", path: "/pricing-rules"},

  { icon: <Icon name="BoxCubeIcon" />, name: "Mills", path: "/mills", roles: ["Super-Admin"] },

  { icon: <Icon name="BoxCubeIcon" />, name: "Company / Buyer", path: "/companies", roles: [ "Super-Admin"] },

  // Mill-admin
  { icon: <Icon name="BoxCubeIcon" />, name: "Products", path: "/products", roles: ["Mill-Admin"] },

  // Company-admin
  { icon: <Icon name="BoxCubeIcon" />, name: "Products Shop", path: "/products/shop", roles: ["Company-Admin"] },

  { icon: <Icon name="BoxCubeIcon" />, name: "KYC Documents", path: "/kyc-documents/uploads", roles: ["Mill-Admin", "Company-Admin"] },
  { icon: <Icon name="BoxCubeIcon" />, name: "My Order", path: "/order/invoice", roles: ["Mill-Admin", "Company-Admin"] },
  

];

const othersItems: NavItem[] = [
  // { icon: <Icon name="BoxCubeIcon" />, name: "Roles", path: "/", roles: ["Super-Admin"] },
  // { icon: <Icon name="BoxCubeIcon" />, name: "Role Permissions", path: "/", roles: ["Super-Admin"] },
  // { icon: <Icon name="BoxCubeIcon" />, name: "Document Types", path: "/", roles: ["Super-Admin"] },  
  { icon: <Icon name="BoxCubeIcon" />, name: "States", path: "/settings/states", roles: ["Super-Admin"] },
  { icon: <Icon name="BoxCubeIcon" />, name: "Cities", path: "/settings/cities", roles: ["Super-Admin"] },  
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setIsAuthReady(true);
    }
  }, [user]);

  const userRoles = user?.roles || [];

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    return roles.some(role => userRoles.includes(role));
  };

  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  // ✅ Render guard INSIDE JSX (safe)
  if (!isAuthReady) {
    return <div className="w-full h-screen bg-white" />;
  }

  const renderMenu = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items
        .filter(item => hasAccess(item.roles))
        .map(item => (
          <li key={item.name}>
            <Link
              href={item.path!}
              className={`menu-item ${isActive(item.path!) ? "menu-item-active" : "menu-item-inactive"
                }`}
            >
              <span className="menu-item-icon">{item.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{item.name}</span>
              )}
            </Link>
          </li>
        ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-white border-r transition-all
      ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 px-5">
        <Link href="/">
          <Image src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
        </Link>
      </div>

      <nav className="px-4">
        <h2 className="text-xs uppercase text-gray-400 mb-4">Menu</h2>
        {renderMenu(navItems)}

        <h2 className="text-xs uppercase text-gray-400 mt-6 mb-4">Settings</h2>
        {renderMenu(othersItems)}
      </nav>
    </aside>
  );
};

export default AppSidebar;
