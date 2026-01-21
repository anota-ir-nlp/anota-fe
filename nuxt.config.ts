import tailwindcss from "@tailwindcss/vite";

const backendBaseUrl = (
  process.env.NUXT_BACKEND_URL ||
  "https://anota.cs.ui.ac.id/server/api/v1"
).replace(/\/$/, "");
const publicApiBaseUrl = (
  process.env.NUXT_PUBLIC_API_BASE_URL || "/api/proxy"
).replace(/\/$/, "");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-05-15",

  routeRules: {
    "/api/proxy/**": {
      proxy: `${backendBaseUrl}/**`,
    },
  },

  modules: [
    "@nuxt/devtools",
    "@pinia/nuxt",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
  ],

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    dataValue: "light",
    storageKey: false,
  },

  icon: {
    collections: ["mdi", "heroicons", "lucide"],
  },

  i18n: {
    locales: ["id"],
    defaultLocale: "id",
    vueI18n: "./i18n.config.ts",
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  plugins: ["~/plugins/vuetify.ts"],

  runtimeConfig: {
    public: {
      apiBaseUrl: publicApiBaseUrl,
    },
  },

  css: ["~/assets/css/main.css"],

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ["vuetify", "@sidebase/nuxt-auth", "next-auth"],
  },
});
