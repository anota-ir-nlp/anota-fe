import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/devtools",
    "@pinia/nuxt",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
  ],

  icon: {
    collections: ["mdi", "heroicons", "lucide"],
  },

  i18n: {
    locales: ["id"],
    defaultLocale: "id",
    vueI18n: "./i18n.config.ts",
  },

  plugins: ["~/plugins/vuetify.ts"],

  runtimeConfig: {
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    AUTH_SECRET: process.env.AUTH_SECRET,
    backendUrl: process.env.NUXT_BACKEND_URL || "http://127.0.0.1:8000/api/v1",

    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api/proxy",
    },
  },

  css: ["~/assets/css/main.css"],

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["914bef266dd4.ngrok-free.app"]
    }
  },

  build: {
    transpile: ["vuetify"],
  },
});
