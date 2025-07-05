// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/devtools",
    "@pinia/nuxt",
    "@nuxt/ui",
    "@vueuse/nuxt",
    // "@sidebase/nuxt-auth",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
  ],

  icon: {
    collections: ["mdi", "heroicons"], // Example of explicit collections if you needed them
  },

  i18n: {
    // <--- Add this configuration
    locales: ["id"], // Set default locale to Indonesian
    defaultLocale: "id",
    vueI18n: "./i18n.config.ts", // Path to your i18n config file
  },

  tailwindcss: {
    viewer: false, // Disables the Tailwind CSS viewer in development for security/cleanup
    exposeConfig: true, // Exposes the Tailwind config for programmatic use
    // You can extend the config here:
    config: {
      theme: {
        extend: {
          colors: {
            "custom-blue": "#1a2b3c",
          },
        },
      },
    },
  },

  // auth: {
  //   baseURL: process.env.AUTH_ORIGIN, // Uses the AUTH_ORIGIN from your runtimeConfig
  //   secret: process.env.AUTH_SECRET,
  //   enableGlobalAppMiddleware: false, //TODO: set to true if auth is ready
  //   // or set specific redirect paths.
  //   pages: {
  //     signIn: "/login", // Redirect to this path if unauthenticated
  //     // signOut: '/',
  //     // error: '/auth-error',
  //     // newUser: '/register'
  //   },

  //   // To add specific providers (e.g., Keycloak, Google, GitHub, Credentials):
  //   // providers: {
  //   //   // Example: Credentials provider (for username/password login)
  //   //   // You'll need to define the `credentials` provider in a server route
  //   //   // for authentication logic.
  //   //   credentials: {
  //   //     // name: 'Credentials', // Optional display name
  //   //     // type: 'credentials', // Type of provider
  //   //     // credentials: { // Define expected credentials structure (e.g., username, password)
  //   //     //   username: { label: 'Username', type: 'text' },
  //   //     //   password: { label: 'Password', type: 'password' }
  //   //     // },
  //   //     // authorize: async (credentials: Record<string, string>) => {
  //   //     //   // This is where you'd call your backend API to authenticate
  //   //     //   // and return a user object if successful.
  //   //     //   // Example:
  //   //     //   // const user = await fetch('/api/auth/login', {
  //   //     //   //   method: 'POST',
  //   //     //   //   body: JSON.stringify(credentials)
  //   //     //   // }).then(res => res.json());
  //   //     //   // if (user) { return user; } else { return null; }
  //   //     //   return null; // Return null if authentication fails
  //   //     // }
  //   //   },
  //   //   // Example: Keycloak provider (requires Keycloak instance and setup)
  //   //   // You'd need to install '@auth/core' and 'next-auth' adapters for Keycloak if using Auth.js direct
  //   //   // Or use a specific Keycloak module if available.
  //   //   // Keycloak setup is quite involved and requires client ID, secret, issuer URL.
  //   //   // keycloak: {
  //   //   //   clientId: process.env.KEYCLOAK_CLIENT_ID,
  //   //   //   clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  //   //   //   issuer: process.env.KEYCLOAK_ISSUER,
  //   //   // },
  //   // },
  // },

  plugins: [
    "~/plugins/vuetify.ts", // Make sure you actually use Vuetify or remove this if not
  ],

  runtimeConfig: {
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    AUTH_SECRET: process.env.AUTH_SECRET,

    // Public keys that are exposed to the client.
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
    },
  },

  css: ["vuetify/styles", "~/assets/css/main.css"],

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {}, // <--- Updated line
      autoprefixer: {},
    },
  },
});
