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
  ],

  icon: {
    collections: ["mdi", "heroicons"],
  },

  i18n: {
    locales: ["id"],
    defaultLocale: "id",
    vueI18n: "./i18n.config.ts",
  },

  plugins: [
    "~/plugins/vuetify.ts",
  ],

  runtimeConfig: {
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    AUTH_SECRET: process.env.AUTH_SECRET,

    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
    },
  },

  css: ["vuetify/styles", "~/assets/css/main.css"],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
