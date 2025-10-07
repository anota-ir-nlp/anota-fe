<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50"
  >
    <div class="max-w-md w-full">
      <Card class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p class="text-gray-600">
            Enter your email address to receive password reset instructions
          </p>
        </div>

        <!-- Step 1: Request Reset -->
        <div v-if="currentStep === 'request'">
          <form @submit.prevent="requestReset" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full"
                required
                :disabled="loading"
              />
            </div>

            <Button
              type="submit"
              class="w-full"
              :loading="loading"
              :disabled="!email"
            >
              Send Reset Code
            </Button>

            <div v-if="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </div>
          </form>
        </div>

        <!-- Step 2: Verify Reset Code -->
        <div v-if="currentStep === 'verify'">
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">
              Reset code has been sent to <strong>{{ email }}</strong
              >. Please check your email and enter the code below.
            </p>
          </div>

          <form @submit.prevent="verifyReset" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reset Code
              </label>
              <Input
                v-model="resetCode"
                type="text"
                placeholder="Enter reset code"
                class="w-full"
                required
                :disabled="loading"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Input
                v-model="newPassword"
                type="password"
                placeholder="Enter new password"
                class="w-full"
                required
                :disabled="loading"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="w-full"
                required
                :disabled="loading"
              />
            </div>

            <Button
              type="submit"
              class="w-full"
              :loading="loading"
              :disabled="
                !resetCode ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              "
            >
              Reset Password
            </Button>

            <div
              v-if="newPassword !== confirmPassword && confirmPassword"
              class="text-sm text-red-600 text-center"
            >
              Passwords do not match
            </div>

            <div v-if="error" class="text-sm text-red-600 text-center">
              {{ error }}
            </div>
          </form>

          <div class="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              @click="currentStep = 'request'"
              :disabled="loading"
            >
              Back to email entry
            </Button>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div v-if="currentStep === 'success'" class="text-center">
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-lg font-medium text-green-800 mb-2">
              Password Reset Successful!
            </p>
            <p class="text-sm text-green-700">
              Your password has been reset successfully. You can now login with
              your new password.
            </p>
          </div>

          <Button @click="navigateTo('/')" class="w-full"> Go to Login </Button>
        </div>

        <div class="mt-6 text-center">
          <NuxtLink
            to="/"
            class="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Back to Login
          </NuxtLink>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUsersApi } from "~/data/users";
import { toast } from "vue-sonner";

const { requestPasswordReset, verifyPasswordReset } = useUsersApi();

// State
const currentStep = ref<"request" | "verify" | "success">("request");
const loading = ref(false);
const error = ref("");

// Form data
const email = ref("");
const resetCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Methods
async function requestReset() {
  if (!email.value) return;

  loading.value = true;
  error.value = "";

  try {
    await requestPasswordReset({ email: email.value });
    currentStep.value = "verify";
    toast.success("Reset code sent to your email");
  } catch (err: any) {
    error.value = err.message || "Failed to send reset code. Please try again.";
    console.error("Password reset request error:", err);
  } finally {
    loading.value = false;
  }
}

async function verifyReset() {
  if (
    !resetCode.value ||
    !newPassword.value ||
    newPassword.value !== confirmPassword.value
  ) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await verifyPasswordReset({
      email: email.value,
      otp_code: resetCode.value,
      new_password: newPassword.value,
    });
    currentStep.value = "success";
    toast.success("Password reset successfully");
  } catch (err: any) {
    error.value =
      err.message || "Failed to reset password. Please check your reset code.";
    console.error("Password reset verification error:", err);
  } finally {
    loading.value = false;
  }
}
</script>
