<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-white text-black">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
        <h1 class="text-2xl font-bold flex items-center gap-2 text-black mb-2">
          <span
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-yellow-50"
          >
            <svg
              class="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20v-6M12 4v2m0 0a8 8 0 1 1-8 8 8 8 0 0 1 8-8z" />
            </svg>
          </span>
          Admin Reopen Dokumen
        </h1>
        <p class="text-gray-700 mb-4">
          Buka kembali pekerjaan anotator atau reviewer pada dokumen tertentu.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Reopen Anotator -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-lg font-semibold text-yellow-700 mb-4">
              Reopen Anotator
            </h2>
            <form @submit.prevent="submitReopenAnnotator" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >ID Dokumen</label
                >
                <input
                  v-model="annotatorDocId"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >UUID User Annotator</label
                >
                <input
                  v-model="annotatorUserId"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Alasan (opsional)</label
                >
                <textarea
                  v-model="annotatorReason"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                ></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <Button
                  type="submit"
                  :loading="annotatorLoading"
                  class="bg-yellow-500 text-white hover:bg-yellow-600"
                  >Kirim</Button
                >
              </div>
              <div v-if="annotatorSuccess" class="mt-2 text-green-600 text-sm">
                {{ annotatorSuccess }}
              </div>
              <div v-if="annotatorError" class="mt-2 text-red-500 text-sm">
                {{ annotatorError }}
              </div>
            </form>
          </div>
          <!-- Reopen Reviewer -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-lg font-semibold text-purple-700 mb-4">
              Reopen Reviewer
            </h2>
            <form @submit.prevent="submitReopenReviewer" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >ID Dokumen</label
                >
                <input
                  v-model="reviewerDocId"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >UUID User Reviewer</label
                >
                <input
                  v-model="reviewerUserId"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Alasan (opsional)</label
                >
                <textarea
                  v-model="reviewerReason"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                ></textarea>
              </div>
              <div class="flex justify-end gap-2">
                <Button
                  type="submit"
                  :loading="reviewerLoading"
                  class="bg-purple-500 text-white hover:bg-purple-600"
                  >Kirim</Button
                >
              </div>
              <div v-if="reviewerSuccess" class="mt-2 text-green-600 text-sm">
                {{ reviewerSuccess }}
              </div>
              <div v-if="reviewerError" class="mt-2 text-red-500 text-sm">
                {{ reviewerError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "~/components/ui/button";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";

const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();

const annotatorDocId = ref<number | null>(null);
const annotatorUserId = ref("");
const annotatorReason = ref("");
const annotatorLoading = ref(false);
const annotatorSuccess = ref("");
const annotatorError = ref("");

const reviewerDocId = ref<number | null>(null);
const reviewerUserId = ref("");
const reviewerReason = ref("");
const reviewerLoading = ref(false);
const reviewerSuccess = ref("");
const reviewerError = ref("");

async function submitReopenAnnotator() {
  annotatorError.value = "";
  annotatorSuccess.value = "";
  annotatorLoading.value = true;
  try {
    await adminReopenAnnotator({
      document: Number(annotatorDocId.value),
      user_id: annotatorUserId.value,
      reason: annotatorReason.value,
    });
    annotatorSuccess.value = "Berhasil membuka kembali pekerjaan anotator.";
    annotatorDocId.value = null;
    annotatorUserId.value = "";
    annotatorReason.value = "";
  } catch (err: any) {
    annotatorError.value =
      err?.data?.detail || "Gagal melakukan reopen anotator.";
  } finally {
    annotatorLoading.value = false;
  }
}

async function submitReopenReviewer() {
  reviewerError.value = "";
  reviewerSuccess.value = "";
  reviewerLoading.value = true;
  try {
    await adminReopenReview({
      document: Number(reviewerDocId.value),
      user_id: reviewerUserId.value,
      reason: reviewerReason.value,
    });
    reviewerSuccess.value = "Berhasil membuka kembali pekerjaan reviewer.";
    reviewerDocId.value = null;
    reviewerUserId.value = "";
    reviewerReason.value = "";
  } catch (err: any) {
    reviewerError.value =
      err?.data?.detail || "Gagal melakukan reopen reviewer.";
  } finally {
    reviewerLoading.value = false;
  }
}
</script>

<style scoped>
input,
textarea {
  border-radius: 0.75rem;
  border-width: 1px;
}
</style>
