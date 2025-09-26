import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-05-15",

  routeRules: {
    "/proxy/**": {
      proxy: `${
        process.env.NUXT_BACKEND_URL || "https://anota-dev.cs.ui.ac.id/api/v1"
      }/**`,
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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/proxy",
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
