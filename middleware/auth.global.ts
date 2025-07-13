import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  //   const { isAuthenticated, user, fetchMe, activeRole } = useAuth();
  //   // Public routes
  //   if (to.path === "/" || to.path === "/login" || to.path === "/register") {
  //     return;
  //   }
  //   // Ensure user is authenticated
  //   if (!isAuthenticated.value) {
  //     await fetchMe();
  //     if (!isAuthenticated.value) {
  //       return navigateTo("/login");
  //     }
  //   }
  //   // Role-based protection (if meta.roles is set)
  //   const roles: string[] = Array.isArray(to.meta.roles) ? to.meta.roles : [];
  //   if (roles.length > 0 && !roles.includes(activeRole.value)) {
  //     return navigateTo("/");
  //   }
});
