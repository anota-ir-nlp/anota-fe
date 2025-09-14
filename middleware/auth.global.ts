import { useAuth } from "~/data/auth";

const roleBasedRoutes = {
  Admin: [
    "/admin/kelola-dokumen",
    "/admin/kelola-error",
    "/kepala-riset-admin/kelola-pengguna",
    "/admin/reopen",
    "/admin/dashboard",
  ],
  Annotator: ["/anotator/anotasi"],
  Reviewer: ["/reviewer/review"],
  "Kepala Riset": [
    "/kepala-riset/kelola-project",
    "/kepala-riset-admin/kelola-pengguna",
    "/admin/kelola-dokumen",
    "/admin/kelola-error",
    "/admin/dashboard",
  ],
};

const publicRoutes = ["/", "/login", "/reset-password"];
const commonAuthenticatedRoutes = ["/beranda", "/change-password"];

function hasRoleAccess(userRoles: string[], routePath: string): boolean {
  if (commonAuthenticatedRoutes.some((route) => routePath.startsWith(route))) {
    return true;
  }

  for (const role of userRoles) {
    const allowedRoutes =
      roleBasedRoutes[role as keyof typeof roleBasedRoutes] || [];
    if (allowedRoutes.some((route) => routePath.startsWith(route))) {
      return true;
    }
  }

  return false;
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, userRoles, initializeAuth } = useAuth();
  const routePath = to.path;

  const isPublicRoute = publicRoutes.includes(routePath);

  await initializeAuth();

  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo("/login");
  }

  if (isAuthenticated.value && routePath === "/login") {
    return navigateTo("/beranda");
  }

  if (isAuthenticated.value && !isPublicRoute) {
    const userRoleList = userRoles.value || [];

    if (routePath === "/beranda") {
      return;
    }

    if (!hasRoleAccess(userRoleList, routePath)) {
      return navigateTo("/beranda");
    }
  }
});
