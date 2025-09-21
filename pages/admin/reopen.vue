<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Admin Reopen Dokumen
        </h1>
        <p class="text-gray-600">
          Buka kembali pekerjaan anotator atau reviewer pada dokumen tertentu.
        </p>
        <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- User List -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-lg font-semibold text-blue-700 mb-4">
              Daftar Pengguna
            </h2>
            <input
              v-model="userSearch"
              type="text"
              placeholder="Cari nama, email, UUID..."
              class="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg"
            />
            <div class="overflow-x-auto max-h-64">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-2 py-1 text-left text-black">ID</th>
                    <th class="px-2 py-1 text-left text-black">UUID</th>
                    <th class="px-2 py-1 text-left text-black">Nama</th>
                    <th class="px-2 py-1 text-left text-black">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="hover:bg-yellow-50 cursor-pointer"
                  >
                    <td class="px-2 py-1 text-black">{{ user.id }}</td>
                    <td class="px-2 py-1 font-mono text-black">
                      {{ user.uuid }}
                    </td>
                    <td class="px-2 py-1 text-black">{{ user.full_name }}</td>
                    <td class="px-2 py-1 text-black">{{ user.email }}</td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="filteredUsers.length === 0"
                class="text-gray-400 text-center py-2"
              >
                Tidak ada pengguna ditemukan.
              </div>
            </div>
          </div>
          <!-- Document List -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-lg font-semibold text-blue-700 mb-4">
              Daftar Dokumen
            </h2>
            <input
              v-model="docSearch"
              type="text"
              placeholder="Cari judul, ID..."
              class="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg"
            />
            <div class="overflow-x-auto max-h-64">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-2 py-1 text-left text-black">ID</th>
                    <th class="px-2 py-1 text-left text-black">Judul</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="doc in filteredDocs"
                    :key="doc.id"
                    class="hover:bg-yellow-50 cursor-pointer"
                  >
                    <td class="px-2 py-1 text-black">{{ doc.id }}</td>
                    <td class="px-2 py-1 text-black">{{ doc.title }}</td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="filteredDocs.length === 0"
                class="text-gray-400 text-center py-2"
              >
                Tidak ada dokumen ditemukan.
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Reopen Anotator -->
          <Card class="p-6">
            <h2 class="text-lg font-semibold text-yellow-700 mb-4">
              Reopen Anotator
            </h2>
            <form @submit.prevent="submitReopenAnnotator" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ID Dokumen
                </label>
                <Input
                  v-model="annotatorDocId"
                  type="number"
                  min="1"
                  placeholder="Masukkan ID dokumen"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  UUID User Annotator
                </label>
                <Input
                  v-model="annotatorUserId"
                  type="text"
                  placeholder="Masukkan UUID user annotator"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alasan (opsional)
                </label>
                <Textarea
                  v-model="annotatorReason"
                  rows="2"
                  placeholder="Alasan reopening (opsional)"
                />
              </div>
              <div class="flex justify-end gap-2">
                <Button
                  @click="submitReopenAnnotator"
                  :loading="annotatorLoading"
                  variant="success"
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
          </Card>
          <!-- Reopen Reviewer -->
          <Card class="p-6">
            <h2 class="text-lg font-semibold text-purple-700 mb-4">
              Reopen Reviewer
            </h2>
            <form @submit.prevent="submitReopenReviewer" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ID Dokumen
                </label>
                <Input
                  v-model="reviewerDocId"
                  type="number"
                  min="1"
                  placeholder="Masukkan ID dokumen"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  UUID User Reviewer
                </label>
                <Input
                  v-model="reviewerUserId"
                  type="text"
                  placeholder="Masukkan UUID user reviewer"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alasan (opsional)
                </label>
                <Textarea
                  v-model="reviewerReason"
                  rows="2"
                  placeholder="Alasan reopening (opsional)"
                />
              </div>
              <div class="flex justify-end gap-2">
                <Button
                  @click="submitReopenReviewer"
                  :loading="reviewerLoading"
                  variant="gradient"
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
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";
import { useUsersApi } from "~/data/users";
import { useDocumentsApi } from "~/data/documents";

const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();
const { getUsers } = useUsersApi();
const { getDocuments } = useDocumentsApi();

const annotatorDocId = ref<number | string>("");
const annotatorUserId = ref("");
const annotatorReason = ref("");
const annotatorLoading = ref(false);
const annotatorSuccess = ref("");
const annotatorError = ref("");

const reviewerDocId = ref<number | string>("");
const reviewerUserId = ref("");
const reviewerReason = ref("");
const reviewerLoading = ref(false);
const reviewerSuccess = ref("");
const reviewerError = ref("");

const users = ref<any[]>([]);
const documents = ref<any[]>([]);
const userSearch = ref("");
const docSearch = ref("");

onMounted(async () => {
  try {
    const userRes = await getUsers();
    users.value = userRes?.results || [];
    const docRes = await getDocuments();
    documents.value = docRes?.results || [];
  } catch (e) {
    // handle error
  }
});

const filteredUsers = computed(() => {
  const term = userSearch.value.toLowerCase();
  return users.value.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      (u.uuid && u.uuid.toLowerCase().includes(term)) ||
      String(u.id).includes(term)
  );
});

const filteredDocs = computed(() => {
  const term = docSearch.value.toLowerCase();
  return documents.value.filter(
    (d) => d.title?.toLowerCase().includes(term) || String(d.id).includes(term)
  );
});

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
    annotatorDocId.value = "";
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
    reviewerDocId.value = "";
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
/* Force table text to black for user/doc tables */
table th,
table td {
  color: #111 !important;
}
</style>
