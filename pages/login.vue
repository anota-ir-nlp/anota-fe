<script setup lang="ts">
import * as z from "zod";
import { navigateTo } from "#app";

const toast = useToast();

// Global state for authentication and role
const isAuthenticated = useState<boolean>("isAuthenticated", () => false);
const userRole = useState<string>("userRole", () => "Guest");
const userName = useState<string>("userName", () => "Pengguna");

// Form input refs
const email = ref("");
const password = ref("");
const remember = ref(false);


// Form error refs
const emailError = ref("");
const passwordError = ref("");

// Zod schema for form validation
const schema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

// Mock providers (Google, GitHub)
const providers = [
  {
    label: "Google",
    icon: "i-mdi-google",
    onClick: () => {
      toast.add({
        title: "Login Google",
        description: "Simulasi login dengan Google...",
        color: "primary",
      });
      // In a real app, this would trigger OAuth flow
    },
  },
  {
    label: "GitHub",
    icon: "i-mdi-github",
    onClick: () => {
      toast.add({
        title: "Login GitHub",
        description: "Simulasi login dengan GitHub...",
        color: "primary",
      });
      // In a real app, this would trigger OAuth flow
    },
  },
];

// Function to handle form submission
async function onSubmit() {
  // Clear previous errors
  emailError.value = "";
  passwordError.value = "";

  // Validate form data using Zod
  const validationResult = schema.safeParse({
    email: email.value,
    password: password.value,
    remember: remember.value,
  });

  if (!validationResult.success) {
    // If validation fails, display errors
    validationResult.error.errors.forEach((err) => {
      if (err.path[0] === "email") {
        emailError.value = err.message;
      }
      if (err.path[0] === "password") {
        passwordError.value = err.message;
      }
    });
    toast.add({
      title: "Validasi Gagal",
      description: "Periksa kembali input Anda.",
      color: "error",
    });
    return; // Stop submission if validation fails
  }

  // Simulate API call
  toast.add({
    title: "Login",
    description: "Mencoba masuk...",
    color: "warning",
  });

  try {
    // Simulate a delay for network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demonstration, assume successful login with a default role
    isAuthenticated.value = true;
    userRole.value = "Anotator"; // Default role for testing
    userName.value = "John Doe"; // Default name for testing

    toast.add({
      title: "Berhasil Masuk",
      description: `Selamat datang, ${userName.value}!`,
      color: "success",
    });
    navigateTo("/beranda"); // Redirect to /beranda page
  } catch (error) {
    toast.add({
      title: "Gagal Masuk",
      description: "Email atau kata sandi salah.",
      color: "error",
    });
    console.error("Login error:", error);
  }
}

// Function to navigate back to homepage
const goBack = () => {
  navigateTo("/");
};
</script>

<template>
  <div class="login-page-container">
    <div class="login-card">
      <div class="back-button-container">
        <button class="back-button" @click="goBack" aria-label="Kembali">
          <UIcon name="i-heroicons-arrow-left" class="icon-style" />
        </button>
      </div>

      <div class="header-section">
        <UIcon name="i-heroicons-user" class="header-icon" />
        <h2 class="form-title">Masuk</h2>
        <p class="form-description">
          Masukkan kredensial Anda untuk mengakses akun.
        </p>
      </div>

      <div class="social-providers-top">
        <button
          v-for="provider in providers"
          :key="provider.label"
          class="social-button-top"
          @click="provider.onClick"
        >
          <UIcon :name="provider.icon" class="social-icon" />
          <span>{{ provider.label }}</span>
        </button>
      </div>

      <div class="divider-container">
        <hr class="divider-line" />
        <span class="divider-text">atau</span>
        <hr class="divider-line" />
      </div>

      <form @submit.prevent="onSubmit" class="form-inputs">
        <div class="form-group">
          <label for="email" class="input-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Enter your email"
            class="custom-input"
            :class="{ 'input-error-border': emailError }"
          />
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <div class="form-group">
          <label for="password" class="input-label">Kata Sandi</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="custom-input"
            :class="{ 'input-error-border': passwordError }"
          />
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>

        <label class="remember-checkbox-container">
          <input type="checkbox" v-model="remember" class="custom-checkbox" />
          <span class="checkbox-label">Ingat saya</span>
        </label>

        <button type="submit" class="submit-button">Lanjutkan</button>
      </form>

      <p class="footer-text">
        Belum punya akun?
        <NuxtLink to="/register" class="register-link">Daftar di sini</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Direct color values for consistency and to avoid variable issues */
.login-page-container {
  min-height: calc(100vh - 8rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(20, 24, 30); /* --color-dark-blue-bg */
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 28rem;
  background-color: #1a2b3c; /* custom-blue or a dark shade */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1); /* --color-card-border */
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  padding: 2.5rem;
  position: relative;
}

.back-button-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.back-button {
  border-radius: 9999px;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: rgb(150, 155, 160); /* --color-text-lighter */
  cursor: pointer;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.icon-style {
  width: 1.5rem;
  height: 1.5rem;
}

.login-form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 1rem;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  color: white;
  margin-bottom: 0.5rem;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.form-description {
  font-size: 1rem;
  color: rgb(150, 155, 160); /* --color-text-lighter */
}

.social-providers-top {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-button-top {
  flex: 1;
  max-width: 10rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  background-color: white;
  border: 1px solid rgb(200, 205, 210);
  color: black;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.social-button-top:hover {
  background-color: rgb(240, 240, 240);
  border-color: rgb(180, 185, 190);
}

.social-icon {
  color: black !important;
  width: 1.25rem;
  height: 1.25rem;
}

.divider-container {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}

.divider-line {
  flex-grow: 1;
  border: none;
  border-top: 1px solid rgb(50, 55, 60); /* --color-divider-border */
  margin: 0;
}

.divider-text {
  padding: 0 0.75rem;
  color: rgb(150, 155, 160); /* --color-divider-text */
  background-color: rgba(255, 255, 255, 0.05); /* --color-card-bg */
  font-size: 0.875rem;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 0;
}

.input-label {
  display: block;
  color: rgb(200, 205, 210); /* --color-text-light */
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.custom-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: rgb(26, 30, 36); /* --color-input-bg */
  border: 1px solid rgb(50, 55, 60); /* --color-input-border */
  border-radius: 0.375rem;
  color: white;
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.custom-input::placeholder {
  color: rgb(150, 155, 160); /* --color-text-lighter */
  opacity: 0.7;
}

.custom-input:focus {
  border-color: rgb(38, 107, 240); /* --color-button-blue */
  box-shadow: 0 0 0 1px rgb(38, 107, 240); /* --color-button-blue */
}

.input-error-border {
  border-color: #f87171 !important; /* --color-error */
}

.error-message {
  color: #f87171; /* --color-error */
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.remember-checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.custom-checkbox {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid rgb(50, 55, 60); /* --color-input-border */
  background-color: rgb(26, 30, 36); /* --color-input-bg */
  border-radius: 0.25rem;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.custom-checkbox::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em rgb(38, 107, 240); /* --color-button-blue */
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.custom-checkbox:checked {
  background-color: rgb(38, 107, 240); /* --color-button-blue */
  border-color: rgb(38, 107, 240); /* --color-button-blue */
}

.custom-checkbox:checked::before {
  transform: scale(1);
}

.custom-checkbox:focus {
  outline: 2px solid rgb(38, 107, 240); /* --color-button-blue */
  outline-offset: 2px;
}

.checkbox-label {
  color: rgb(200, 205, 210); /* --color-text-light */
  font-size: 0.875rem;
  user-select: none;
}

.submit-button {
  width: 100%;
  padding: 1.25rem 2.5rem;
  font-weight: 700;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: 0.5rem;
  cursor: pointer;
}

.submit-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.7s ease-in-out;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: -1;
}

.submit-button:hover::before {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.submit-button:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 20px 25px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
  background: linear-gradient(to right, #2563eb, #7e22ce);
}

.footer-text {
  text-align: center;
  font-size: 0.875rem;
  color: rgb(150, 155, 160); /* --color-text-lighter */
  margin-top: 1.5rem;
}

.register-link {
  color: rgb(38, 107, 240); /* --color-link */
  font-weight: 500;
  text-decoration: none;
  transition: text-decoration 0.2s ease-in-out;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
