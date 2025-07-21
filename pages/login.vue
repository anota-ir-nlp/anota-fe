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
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-slate-900">
    <div class="w-full max-w-md bg-slate-800/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl text-white px-10 py-16 relative">
      <div class="absolute top-4 left-4">
        <button
          class="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-transparent border-0 text-slate-400 cursor-pointer hover:bg-white/5 hover:text-white transition-colors"
          @click="goBack"
          aria-label="Kembali"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-6 h-6" />
        </button>
      </div>

      <div class="text-center mb-4">
        <UIcon name="i-heroicons-user" class="w-12 h-12 text-white mb-2 mx-auto" />
        <h2 class="text-3xl font-bold text-white mb-2">Masuk</h2>
        <p class="text-base text-slate-400">
          Masukkan kredensial Anda untuk mengakses akun.
        </p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
        <div class="">
          <label for="email" class="block text-slate-300 text-sm mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Enter your email"
            class="w-full px-4 py-4 text-base bg-slate-900 border border-slate-600 rounded-md text-white outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:opacity-70 focus:border-blue-500 focus:shadow-[0_0_0_1px_rgb(59,130,246)]"
            :class="{ '!border-red-400': emailError }"
          />
          <p v-if="emailError" class="text-red-400 text-xs mt-1">{{ emailError }}</p>
        </div>

        <div class="">
          <label for="password" class="block text-slate-300 text-sm mb-1">Kata Sandi</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-4 text-base bg-slate-900 border border-slate-600 rounded-md text-white outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:opacity-70 focus:border-blue-500 focus:shadow-[0_0_0_1px_rgb(59,130,246)]"
            :class="{ '!border-red-400': passwordError }"
          />
          <p v-if="passwordError" class="text-red-400 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <label class="flex items-center gap-2 mt-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            v-model="remember"
            class="appearance-none w-5 h-5 border border-slate-600 bg-slate-900 rounded grid place-content-center cursor-pointer transition-all duration-200 checked:bg-blue-500 checked:border-blue-500 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 before:content-[''] before:w-[0.65em] before:h-[0.65em] before:scale-0 before:transition-transform before:duration-[120ms] before:ease-in-out before:shadow-[inset_1em_1em_rgb(59,130,246)] before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:before:scale-100"
          />
          <span class="text-slate-300 text-sm select-none">Ingat saya</span>
        </label>

        <button
          type="submit"
          class="w-full px-10 py-4 font-bold rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border border-white/20 relative overflow-hidden z-[1] mt-2 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[300%] before:h-[300%] before:bg-white/10 before:rounded-full before:transition-all before:duration-700 before:ease-in-out before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0 before:opacity-0 before:-z-[1] hover:before:scale-100 hover:before:opacity-100"
        >
          Lanjutkan
        </button>
      </form>

      <p class="text-center text-sm text-slate-400 mt-6">
        Belum punya akun?
        <NuxtLink to="/register" class="text-blue-500 font-medium no-underline transition-all duration-200 hover:underline">Daftar di sini</NuxtLink>
      </p>
    </div>
  </div>
</template>