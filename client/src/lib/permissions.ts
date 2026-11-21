import { UserRole } from "../types";

export interface NavItemConfig {
  label: string;
  path: string;
  iconName: string;
  allowedRoles: UserRole[];
  badgeKey?: "approvals" | "materials";
}

export interface NavSectionConfig {
  title: string;
  allowedRoles: UserRole[];
  items: NavItemConfig[];
}

export const RBAC_NAV_CONFIG: NavSectionConfig[] = [
  {
    title: "Main Operations",
    allowedRoles: [
      "BUILDER_OWNER",
      "PROJECT_MANAGER",
      "CIVIL_ENGINEER",
      "SITE_SUPERVISOR",
      "ACCOUNTANT",
      "CLIENT",
      "ADMIN",
    ],
    items: [
      {
        label: "Dashboard",
        path: "/",
        iconName: "LayoutDashboard",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "SITE_SUPERVISOR",
          "ACCOUNTANT",
          "CLIENT",
          "ADMIN",
        ],
      },
      {
        label: "Projects & Sites",
        path: "/projects",
        iconName: "Building2",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "ACCOUNTANT",
          "CLIENT",
          "ADMIN",
        ],
      },
      {
        label: "Tasks & Milestones",
        path: "/tasks",
        iconName: "CheckSquare",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "SITE_SUPERVISOR",
          "ADMIN",
        ],
      },
      {
        label: "Daily Site Reports",
        path: "/daily-reports",
        iconName: "FileText",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "SITE_SUPERVISOR",
          "ADMIN",
        ],
      },
    ],
  },
  {
    title: "Workforce",
    allowedRoles: [
      "BUILDER_OWNER",
      "PROJECT_MANAGER",
      "SITE_SUPERVISOR",
      "ACCOUNTANT",
      "ADMIN",
    ],
    items: [
      {
        label: "Workers Directory",
        path: "/workforce",
        iconName: "Users",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "SITE_SUPERVISOR",
          "ADMIN",
        ],
      },
      {
        label: "Daily Attendance",
        path: "/attendance",
        iconName: "CalendarCheck",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "SITE_SUPERVISOR",
          "ACCOUNTANT",
          "ADMIN",
        ],
      },
      {
        label: "Leaves & Wages",
        path: "/leaves-wages",
        iconName: "CreditCard",
        allowedRoles: ["BUILDER_OWNER", "ACCOUNTANT", "ADMIN"],
      },
    ],
  },
  {
    title: "Field Operations",
    allowedRoles: [
      "BUILDER_OWNER",
      "PROJECT_MANAGER",
      "CIVIL_ENGINEER",
      "SITE_SUPERVISOR",
      "ADMIN",
    ],
    items: [
      {
        label: "Materials & Inventory",
        path: "/materials",
        iconName: "Boxes",
        badgeKey: "materials",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "SITE_SUPERVISOR",
          "ADMIN",
        ],
      },
      {
        label: "Heavy Equipment",
        path: "/equipment",
        iconName: "Truck",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "CIVIL_ENGINEER",
          "SITE_SUPERVISOR",
          "ADMIN",
        ],
      },
    ],
  },
  {
    title: "Commercial & Finance",
    allowedRoles: ["BUILDER_OWNER", "ACCOUNTANT", "ADMIN"],
    items: [
      {
        label: "Finance & Budgets",
        path: "/finance",
        iconName: "DollarSign",
        allowedRoles: ["BUILDER_OWNER", "ACCOUNTANT", "ADMIN"],
      },
    ],
  },
  {
    title: "Governance",
    allowedRoles: [
      "BUILDER_OWNER",
      "PROJECT_MANAGER",
      "ACCOUNTANT",
      "ADMIN",
    ],
    items: [
      {
        label: "Pending Approvals",
        path: "/approvals",
        iconName: "ClipboardCheck",
        badgeKey: "approvals",
        allowedRoles: [
          "BUILDER_OWNER",
          "PROJECT_MANAGER",
          "ACCOUNTANT",
          "ADMIN",
        ],
      },
      {
        label: "Company Onboarding",
        path: "/onboarding",
        iconName: "Sparkles",
        allowedRoles: ["BUILDER_OWNER", "ADMIN"],
      },
    ],
  },
];

/** Check if a role can access a route path */
export function isRouteAllowedForRole(path: string, role: UserRole): boolean {
  if (path === "/") return true;
  for (const section of RBAC_NAV_CONFIG) {
    for (const item of section.items) {
      if (item.path === path || path.startsWith(item.path + "/")) {
        return item.allowedRoles.includes(role);
      }
    }
  }
  return true;
}

/** Get list of authorized routes for a role */
export function getAllowedNavSections(role: UserRole) {
  return RBAC_NAV_CONFIG.filter((section) =>
    section.allowedRoles.includes(role)
  )
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.allowedRoles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}
