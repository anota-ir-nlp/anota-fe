<script setup lang="ts">
import * as z from "zod";
import { useAuth } from "~/composables/useAuth";
import { navigateTo } from "#app";

const toast = useToast();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const remember = ref(false);

const emailError = ref("");
const passwordError = ref("");

const schema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
  remember: z.boolean().optional(),
});

async function onSubmit() {
  emailError.value = "";
  passwordError.value = "";

  const validationResult = schema.safeParse({
    email: email.value,
    password: password.value,
    remember: remember.value,
  });

  if (!validationResult.success) {
    validationResult.error.errors.forEach((err) => {
      if (err.path[0] === "email") emailError.value = err.message;
      if (err.path[0] === "password") passwordError.value = err.message;
    });
    toast.add({
      title: "Validasi Gagal",
      description: "Periksa kembali input Anda.",
      color: "error",
    });
    return;
  }

  toast.add({
    title: "Login",
    description: "Mencoba masuk...",
    color: "warning",
  });

  try {
    await login(email.value, password.value);
    toast.add({
      title: "Berhasil Masuk",
      description: `Selamat datang!`,
      color: "success",
    });
    navigateTo("/beranda");
  } catch (error) {
    toast.add({
      title: "Gagal Masuk",
      description: "Email atau kata sandi salah.",
      color: "error",
    });
  }
}

const goBack = () => {
  navigateTo("/");
};

// Social login providers
const providers = [
  {
    label: "Google",
    icon: "i-logos-google-icon",
    onClick: () => {
      toast.add({
        title: "Google Login",
        description: "Fitur login dengan Google belum tersedia.",
        color: "info",
      });
    },
  },
  {
    label: "Facebook",
    icon: "i-logos-facebook",
    onClick: () => {
      toast.add({
        title: "Facebook Login",
        description: "Fitur login dengan Facebook belum tersedia.",
        color: "info",
      });
    },
  },
];
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-4 sm:p-8 font-inter text-white"
  >
    <div
      class="w-full max-w-sm mx-auto glassmorphism-card border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative"
    >
      <!-- Back Button -->
      <div class="absolute top-4 left-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          size="lg"
          :ui="{
            base: 'p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors duration-200',
          }"
          @click="goBack"
          aria-label="Kembali"
        />
      </div>

      <!-- Header Section -->
      <div class="text-center mb-6 mt-8">
        <UIcon
          name="i-heroicons-user"
          class="w-12 h-12 text-blue-400 mb-2 mx-auto"
        />
        <h2 class="text-3xl font-bold text-white mb-2">Masuk</h2>
        <p class="text-gray-400 text-sm">
          Masukkan kredensial Anda untuk mengakses akun.
        </p>
      </div>

      <!-- Social Providers -->
      <div class="flex justify-center gap-4 mb-6">
        <UButton
          v-for="provider in providers"
          :key="provider.label"
          :label="provider.label"
          :icon="provider.icon"
          variant="outline"
          color="neutral"
          :ui="{
            base: 'flex-1 max-w-[10rem] py-3 px-4 font-semibold bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 hover:border-blue-500 transition-all duration-200 justify-center gap-2',
          }"
          @click="provider.onClick"
        />
      </div>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <hr class="flex-grow border-t border-gray-700" />
        <span class="px-3 text-gray-500 text-sm bg-gray-800/60">atau</span>
        <hr class="flex-grow border-t border-gray-700" />
      </div>

      <!-- Login Form -->
      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1"
            >Email</label
          >
          <UInput
            id="email"
            v-model="email"
            type="text"
            placeholder="Enter your email"
            size="lg"
            :ui="{ base: 'w-full' }"
            :class="{ 'border-red-500 ring-red-500': emailError }"
          />
          <p v-if="emailError" class="text-red-400 text-xs mt-1">
            {{ emailError }}
          </p>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-300 mb-1"
            >Kata Sandi</label
          >
          <UInput
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            size="lg"
            :ui="{ base: 'w-full' }"
            :class="{ 'border-red-500 ring-red-500': passwordError }"
          />
          <p v-if="passwordError" class="text-red-400 text-xs mt-1">
            {{ passwordError }}
          </p>
        </div>

        <UCheckbox
          id="remember"
          v-model="remember"
          name="remember"
          label="Ingat saya"
          class="mt-2 mb-4"
          :ui="{
            base: 'h-5 w-5 text-blue-500 rounded-md border-gray-700 bg-gray-900/60 focus:ring-blue-500',
            label: 'text-sm text-gray-300 select-none',
          }"
        />

        <UButton
          type="submit"
          label="Lanjutkan"
          color="primary"
          variant="solid"
          size="xl"
          :ui="{
            base: 'w-full py-4 px-8 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 mt-2',
          }"
        />
      </form>

      <p class="text-center text-sm text-gray-400 mt-6">
        Belum punya akun?
        <NuxtLink
          to="/register"
          class="text-blue-500 hover:underline font-medium transition-colors duration-200"
          >Daftar di sini</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.glassmorphism-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 1.5px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glassmorphism-card:hover {
  background-color: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 2px 12px rgba(0, 0, 0, 0.13);
}
</style>
<style scoped>
.glassmorphism-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 1.5px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glassmorphism-card:hover {
  background-color: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 2px 12px rgba(0, 0, 0, 0.13);
}
</style>
