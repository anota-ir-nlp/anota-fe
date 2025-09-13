<script setup lang="ts">
import * as z from "zod";
import { Eye, EyeOff, ArrowLeft, User, Lock } from "lucide-vue-next";
import { Card, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/data/auth";
import { navigateTo } from "#app";
import { toast } from "vue-sonner";
import type { LoginRequest } from "~/types/api";

const { login } = useAuth();

const username = ref("");
const password = ref("");
const usernameError = ref("");
const passwordError = ref("");
const showPassword = ref(false);

const schema = z.object({
  username: z.string().min(1, "Username harus diisi."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

async function onSubmit() {
  usernameError.value = "";
  passwordError.value = "";

  const loginData: LoginRequest = {
    username: username.value,
    password: password.value,
  };

  const validationResult = schema.safeParse(loginData);

  if (!validationResult.success) {
    validationResult.error.errors.forEach((err) => {
      if (err.path[0] === "username") usernameError.value = err.message;
      if (err.path[0] === "password") passwordError.value = err.message;
    });
    toast.message("Validasi Gagal", {
      description: "Periksa kembali input Anda.",
    });
    return;
  }

  await toast.promise(login(loginData.username, loginData.password), {
    loading: "Mencoba masuk...",
    success: () => {
      navigateTo("/beranda");
      return "Berhasil Masuk. Selamat datang!";
    },
    error: () => "Gagal Masuk. Username atau kata sandi salah.",
  });
}

const goBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden"
  >
    <!-- Background Decorations -->
    <div class="absolute inset-0 pointer-events-none select-none">
      <!-- Pen as background decoration (optional, remove if not available) -->
      <!-- <div class="absolute top-1/4 right-1/4 opacity-30 transform rotate-12 scale-150">
        <Frame1047 />
      </div> -->
      <!-- Floating elements -->
      <div
        class="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full opacity-40 animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/3 w-4 h-4 bg-pink-400 rounded-full opacity-30 animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/6 w-2 h-2 bg-blue-400 rounded-full opacity-35 animate-pulse delay-500"
      ></div>
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-100/20 to-pink-100/20"
      ></div>
    </div>

    <div class="relative z-10 w-full max-w-md px-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-5xl mb-4 tracking-tight">
          <span
            class="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
          >
            Anota
          </span>
        </h1>
        <div
          class="w-16 h-1 bg-gradient-to-r from-green-500 to-pink-500 mx-auto rounded-full mb-4"
        ></div>
        <p class="text-gray-600">Anotasi Cerdas. Dataset Sempurna.</p>
      </div>

      <!-- Login Card -->
      <Card
        class="p-8 backdrop-blur-md bg-white/80 border-white/50 shadow-2xl relative"
      >
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-4 left-4 rounded-full text-gray-400 hover:bg-white/5 hover:text-gray-700"
          @click="goBack"
          aria-label="Kembali"
        >
          <ArrowLeft class="w-6 h-6" />
        </Button>

        <CardHeader class="text-center mb-4 px-0">
          <User class="w-12 h-12 text-gray-700 mb-2 mx-auto" />
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Masuk</h2>
          <p class="text-base text-gray-500">
            Masukkan kredensial Anda untuk mengakses akun.
          </p>
        </CardHeader>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
          <div>
            <label for="username" class="block text-gray-700 text-sm mb-1"
              >Username</label
            >
            <div
              :class="[
                'flex items-center border-2 rounded-md bg-white/90 backdrop-filter backdrop-blur-sm transition-all duration-200',
                usernameError
                  ? 'border-red-400 ring-2 ring-red-400/20'
                  : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
              ]"
              style="height: 48px"
            >
              <div class="flex items-center justify-center w-10 h-full">
                <User class="text-gray-500 w-5 h-5" />
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Masukkan username"
                autocomplete="username"
                class="flex-1 bg-transparent border-none outline-none shadow-none px-2 py-0 text-base text-gray-900 placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none h-full font-medium"
              />
            </div>
            <p v-if="usernameError" class="text-red-400 text-xs mt-1">
              {{ usernameError }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-gray-700 text-sm mb-1"
              >Kata Sandi</label
            >
            <div
              :class="[
                'flex items-center border-2 rounded-md bg-white/90 backdrop-filter backdrop-blur-sm transition-all duration-200',
                passwordError
                  ? 'border-red-400 ring-2 ring-red-400/20'
                  : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
              ]"
              style="height: 48px"
            >
              <div class="flex items-center justify-center w-10 h-full">
                <Lock class="text-gray-500 w-5 h-5" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="flex-1 bg-transparent border-none outline-none shadow-none px-2 py-0 text-base text-gray-900 placeholder:text-gray-500 placeholder:opacity-80 focus:outline-none h-full font-medium"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="flex items-center justify-center w-10 h-full text-gray-500 hover:text-gray-700 transition-colors rounded-r-md"
                tabindex="-1"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="passwordError" class="text-red-400 text-xs mt-1">
              {{ passwordError }}
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            class="w-full animated-gradient-btn-greenblue text-white border-0 py-3 text-lg font-semibold"
          >
            Masuk
          </Button>
        </form>

        <!-- Password Reset Link -->
        <div class="mt-4 text-center">
          <NuxtLink
            to="/reset-password"
            class="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Lupa kata sandi?
          </NuxtLink>
        </div>
      </Card>
    </div>
  </div>
</template>
