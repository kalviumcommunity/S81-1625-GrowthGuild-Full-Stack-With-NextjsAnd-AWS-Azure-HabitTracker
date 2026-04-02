import { NextResponse } from "next/server";
import { AppRole, Permission, roles } from "@/config/roles";
import { logger } from "@/lib/logger";

export interface RequestActor {
  userId: number;
  role: AppRole;
  rawRole: string;
}

export function normalizeRole(role: string | null | undefined): AppRole {
  const normalized = (role || "").toLowerCase();

  if (normalized === "admin" || normalized === "administrator") {
    return "admin";
  }

  if (normalized === "editor" || normalized === "user" || normalized === "member") {
    return "editor";
  }

  return "viewer";
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return roles[role].includes(permission);
}

export function getRequestActor(req: Request): RequestActor | null {
  const userIdHeader = req.headers.get("x-user-id");
  const roleHeader = req.headers.get("x-user-role");

  if (!userIdHeader || !roleHeader) {
    return null;
  }

  const userId = Number(userIdHeader);
  if (Number.isNaN(userId)) {
    return null;
  }

  return {
    userId,
    role: normalizeRole(roleHeader),
    rawRole: roleHeader,
  };
}

interface LogParams {
  actor: RequestActor;
  resource: string;
  action: string;
  allowed: boolean;
  reason: string;
  targetUserId?: number;
}

function logDecision(params: LogParams) {
  const { actor, resource, action, allowed, reason, targetUserId } = params;

  logger.info(`[RBAC] ${actor.role} ${action} ${resource}: ${allowed ? "ALLOWED" : "DENIED"}`, {
    actorId: actor.userId,
    actorRoleRaw: actor.rawRole,
    targetUserId,
    reason,
  });
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized: missing authentication context" },
    { status: 401 }
  );
}

export function checkPermission(params: {
  actor: RequestActor;
  permission: Permission;
  resource: string;
  action: string;
  targetUserId?: number;
  allowOwner?: boolean;
}) {
  const { actor, permission, resource, action, targetUserId, allowOwner = false } = params;
  const allowedByRole = hasPermission(actor.role, permission);
  const allowedByOwnership =
    allowOwner && typeof targetUserId === "number" && targetUserId === actor.userId;

  const allowed = allowedByRole || allowedByOwnership;
  const reason = allowedByRole
    ? `permission:${permission}`
    : allowedByOwnership
      ? "ownership"
      : `missing_permission:${permission}`;

  logDecision({ actor, resource, action, allowed, reason, targetUserId });
  return allowed;
}
