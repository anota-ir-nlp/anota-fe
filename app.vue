<!-- app.vue (in your project root) -->
<script setup lang="ts">
useHead({
  title: "ANOTA - Aplikasi Anotasi GEC Bahasa Indonesia",
  meta: [
    {
      name: "description",
      content:
        "Platform inovatif untuk anotasi Grammatical Error Correction (GEC) Bahasa Indonesia.",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap",
    },
  ],
});
</script>
<template>
  <div>
    <NuxtLayout>
      <!-- This tells Nuxt to use your layout system -->
      <NuxtPage />
      <!-- This renders the current page content inside the layout -->
    </NuxtLayout>
  </div>
</template>
