<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden"
  >
    <div class="absolute inset-0 pointer-events-none select-none">
      <div
        class="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full opacity-40 animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/3 w-4 h-4 bg-pink-400 rounded-full opacity-30 animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/6 w-2 h-2 bg-blue-400 rounded-full opacity-35 animate-pulse delay-500"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-100/20 to-pink-100/20"
      ></div>
    </div>
    <div class="relative z-10 w-full max-w-md px-6">
      <Card
        class="p-8 backdrop-blur-md bg-white/80 border-white/50 shadow-2xl relative"
      >
        <CardHeader class="text-center mb-4 px-0">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Ganti Password</h2>
          <p class="text-base text-gray-500">
            Reset password dengan OTP yang dikirim ke email Anda.
          </p>
        </CardHeader>
        <form
          v-if="step === 1"
          @submit.prevent="onRequestOtp"
          class="flex flex-col gap-6"
        >
          <div>
            <label for="email" class="block text-gray-700 text-sm mb-1"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Masukkan email terdaftar"
              autocomplete="email"
              class="w-full border rounded-md px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p v-if="emailError" class="text-red-400 text-xs mt-1">
              {{ emailError }}
            </p>
          </div>
          <Button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold rounded-md"
            :loading="loading"
          >
            Kirim OTP
          </Button>
        </form>
        <form v-else @submit.prevent="onVerifyOtp" class="flex flex-col gap-6">
          <div>
            <label for="otp" class="block text-gray-700 text-sm mb-1"
              >Kode OTP</label
            >
            <input
              id="otp"
              v-model="otp"
              type="text"
              maxlength="6"
              placeholder="Masukkan 6 digit OTP"
              autocomplete="one-time-code"
              class="w-full border rounded-md px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p v-if="otpError" class="text-red-400 text-xs mt-1">
              {{ otpError }}
            </p>
          </div>
          <div>
            <label for="newPassword" class="block text-gray-700 text-sm mb-1"
              >Password Baru</label
            >
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Minimal 6 karakter"
              autocomplete="new-password"
              class="w-full border rounded-md px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p v-if="newPasswordError" class="text-red-400 text-xs mt-1">
              {{ newPasswordError }}
            </p>
          </div>
          <Button
            type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold rounded-md"
            :loading="loading"
          >
            Reset Password
          </Button>
        </form>
        <div
          v-if="successMessage"
          class="mt-4 text-green-600 text-center text-sm"
        >
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 text-red-500 text-center text-sm">
          {{ errorMessage }}
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/data/auth";

const { requestPasswordReset, verifyPasswordReset } = useAuth();

const step = ref(1);
const email = ref("");
const emailError = ref("");
const otp = ref("");
const otpError = ref("");
const newPassword = ref("");
const newPasswordError = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function onRequestOtp() {
  emailError.value = "";
  errorMessage.value = "";
  successMessage.value = "";
  if (!email.value || !email.value.includes("@")) {
    emailError.value = "Email tidak valid.";
    return;
  }
  loading.value = true;
  try {
    await requestPasswordReset(email.value);
    step.value = 2;
    successMessage.value = "Kode OTP berhasil dikirim ke email Anda.";
  } catch (err: any) {
    errorMessage.value =
      err?.data?.detail || "Gagal mengirim OTP. Coba lagi nanti.";
  } finally {
    loading.value = false;
  }
}

async function onVerifyOtp() {
  otpError.value = "";
  newPasswordError.value = "";
  errorMessage.value = "";
  successMessage.value = "";
  if (!otp.value || otp.value.length !== 6) {
    otpError.value = "OTP harus 6 digit.";
    return;
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    newPasswordError.value = "Password minimal 6 karakter.";
    return;
  }
  loading.value = true;
  try {
    await verifyPasswordReset(email.value, otp.value, newPassword.value);
    successMessage.value =
      "Password berhasil direset. Silakan login dengan password baru.";
    step.value = 1;
    email.value = "";
    otp.value = "";
    newPassword.value = "";
  } catch (err: any) {
    errorMessage.value =
      err?.data?.detail || "Gagal reset password. Cek OTP dan password Anda.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input {
  border-radius: 0.5rem;
  border-width: 1px;
}
</style>
