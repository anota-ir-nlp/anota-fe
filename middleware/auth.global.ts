import { useAuth } from "~/data/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, initializeAuth } = useAuth();

  // Ensure auth state is initialized before checking
  await initializeAuth();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login'];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(to.path);

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/login');
  }

  // If user is authenticated and trying to access login page
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/beranda');
  }
});
