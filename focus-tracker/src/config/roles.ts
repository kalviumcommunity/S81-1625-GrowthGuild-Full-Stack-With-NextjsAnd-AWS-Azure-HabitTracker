export type AppRole = "admin" | "editor" | "viewer";

export type Permission =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "manage_users"
  | "read_users"
  | "read_habits"
  | "create_habit"
  | "update_habits"
  | "delete_habits"
  | "view_dashboard"
  | "read_files"
  | "upload_files"
  | "delete_own_file"
  | "delete_any_file";

export const roles: Record<AppRole, Permission[]> = {
  admin: [
    "read",
    "create",
    "update",
    "delete",
    "manage_users",
    "read_users",
    "read_habits",
    "create_habit",
    "update_habits",
    "delete_habits",
    "view_dashboard",
    "read_files",
    "upload_files",
    "delete_own_file",
    "delete_any_file",
  ],
  editor: [
    "read",
    "create",
    "update",
    "read_users",
    "read_habits",
    "create_habit",
    "update_habits",
    "view_dashboard",
    "read_files",
    "upload_files",
    "delete_own_file",
  ],
  viewer: ["read", "read_users", "read_habits", "view_dashboard", "read_files"],
};
