<script setup lang="ts">
import * as z from "zod";
import { ArrowLeft, User } from "lucide-vue-next";
import { Card, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/data/auth";
import { navigateTo } from "#app";
import { toast } from "vue-sonner";

const { login } = useAuth();

const username = ref("");
const password = ref("");

const usernameError = ref("");
const passwordError = ref("");

const schema = z.object({
  username: z.string().min(1, "Username harus diisi."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

async function onSubmit() {
  usernameError.value = "";
  passwordError.value = "";

  const validationResult = schema.safeParse({
    username: username.value,
    password: password.value,
  });

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

  await toast.promise(
    login(username.value, password.value),
    {
      loading: "Mencoba masuk...",
      success: () => {
        navigateTo("/beranda");
        return "Berhasil Masuk. Selamat datang!";
      },
      error: () => "Gagal Masuk. Username atau kata sandi salah.",
    }
  );
}

const goBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-900">
    <Card variant="glassmorphism" class="w-full max-w-md p-10 relative">
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-4 left-4 rounded-full text-slate-400 hover:bg-white/5 hover:text-white"
        @click="goBack"
        aria-label="Kembali"
      >
        <ArrowLeft class="w-6 h-6" />
      </Button>

      <CardHeader class="text-center mb-4 px-0">
        <User class="w-12 h-12 text-white mb-2 mx-auto" />
        <h2 class="text-3xl font-bold text-white mb-2">Masuk</h2>
        <p class="text-base text-slate-400">
          Masukkan kredensial Anda untuk mengakses akun.
        </p>
      </CardHeader>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div>
          <label for="username" class="block text-slate-300 text-sm mb-1">Username</label>
          <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            autocomplete="username"
            class="w-full px-4 py-4 text-base bg-slate-900 border border-slate-600 rounded-md text-white outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:opacity-70 focus:border-blue-500 focus:shadow-[0_0_0_1px_rgb(59,130,246)]"
            :class="{ '!border-red-400': usernameError }"
          />
          <p v-if="usernameError" class="text-red-400 text-xs mt-1">{{ usernameError }}</p>
        </div>

        <div>
          <label for="password" class="block text-slate-300 text-sm mb-1">Kata Sandi</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="w-full px-4 py-4 text-base bg-slate-900 border border-slate-600 rounded-md text-white outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:opacity-70 focus:border-blue-500 focus:shadow-[0_0_0_1px_rgb(59,130,246)]"
            :class="{ '!border-red-400': passwordError }"
          />
          <p v-if="passwordError" class="text-red-400 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          class="w-full mt-2"
        >
          Lanjutkan
        </Button>
      </form>
    </Card>
  </div>
</template>