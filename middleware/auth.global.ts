import { useAuth } from "~/data/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, initializeAuth } = useAuth();

  const publicRoutes = ['/', '/login'];

  const isPublicRoute = publicRoutes.includes(to.path);

  await initializeAuth();

  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/beranda');
  }
});
