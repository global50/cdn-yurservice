// Centralized navigation configuration for consistent navigation across desktop and mobile

import {
  Home,
  Library,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

// Desktop navigation items (full list)
export const desktopNavigationItems: NavItem[] = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Library, label: "ЮрСервисы", path: "/yurservice" },
];

// Mobile bottom navigation items (limited set for bottom bar)
export const mobileBottomNavigationItems: NavItem[] = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Library, label: "ЮрСервисы", path: "/yurservice" },
];

// Create button configuration
export const createButtonConfig = {
  icon: Plus,
  label: "Создать",
  path: "/",
};
