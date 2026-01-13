export const ROLES = {
    SUPER_ADMIN: "Super-Admin",
    MILL_ADMIN: "Mill-Admin",
    COMPANY_ADMIN: "Company-Admin",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
