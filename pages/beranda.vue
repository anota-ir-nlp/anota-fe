<template>
  <div>
    <section
      class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16 pt-10 flex flex-col gap-8"
    >
      <Card
        variant="glassmorphism"
        class="p-0 border border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white w-full !shadow-none"
      >
        <div class="flex flex-col md:flex-row items-center gap-8 p-8 w-full">
          <Avatar class="w-24 h-24 ring-4 ring-green-400/30">
            <AvatarImage :src="userData.avatar" :alt="userData.name" />
            <AvatarFallback class="text-xl font-semibold">{{
              userData.name.charAt(0)
            }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 text-center md:text-left">
            <div
              class="flex items-center gap-3 justify-center md:justify-start mb-3 text-3xl"
            >
              <span
                class="font-medium text-white bg-white/10 px-4 py-2 rounded-lg"
              >
                Hi,
                <span class="font-bold text-white">{{ userData.name }}</span>
              </span>
            </div>
            <div class="flex gap-2 mt-2 mb-8">
              <Badge
                v-for="role in userData.roles"
                :key="role"
                variant="green"
                class="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/20 text-white border border-white/30"
              >
                {{ role }}
              </Badge>
            </div>
            <div
              class="flex flex-wrap gap-4 justify-center md:justify-start text-sm"
            >
              <span class="flex items-center gap-2 text-white/80 font-medium">
                <Mail class="w-4 h-4" />
                {{ userData.email }}
              </span>
              <span class="flex items-center gap-2 text-white/80 font-medium">
                <Calendar class="w-4 h-4" />
                Bergabung {{ userData.memberSince }}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Admin Project Info Section -->
      <div v-if="hasRole('Admin') && selectedProject" class="mt-8 mb-8">
        <!-- Admin Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-pink-500/10 border border-pink-200">
            <Users class="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Project Assignment</h2>
            <p class="text-gray-500 text-lg">Your assigned project</p>
          </div>
        </div>
        <Card
          variant="glassmorphism"
          class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-200">
                <Building2 class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ selectedProject.name }}</h3>
                <p class="text-gray-600">{{ selectedProject.description || 'No description available' }}</p>
                <p class="text-sm text-gray-500 mt-1">
                  Created: {{ formatDate(selectedProject.created_at) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="inline-block px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                Active
              </span>
              <p class="text-xs text-gray-500 mt-1">
                {{ selectedProject.assigned_admins?.length || 0 }} admin(s)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Role-specific Content -->
    <section
      class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-12 flex-col space-y-20"
    >
      <!-- Admin Dashboard -->
      <div v-if="hasRole('Admin')" class="space-y-8">
        <!-- Admin Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-200">
            <Users class="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Admin</h2>
            <p class="text-gray-500 text-lg">Kelola sistem dan pengguna</p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card
            v-if="pending"
            v-for="i in 4"
            :key="i"
            variant="glassmorphism"
            class="p-6 animate-pulse bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div class="w-16 h-8 bg-gray-200 rounded mb-3"></div>
            <div class="w-28 h-4 bg-gray-200 rounded"></div>
          </Card>

          <Card
            v-else
            v-for="stat in adminStats"
            :key="stat.label"
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 group bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <component
                :is="getIcon(stat.icon)"
                :class="`w-12 h-12 ${stat.color} transition-transform duration-300`"
              />
              <span class="text-3xl font-bold text-gray-900">{{
                stat.value
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              {{ stat.label }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{ stat.description }}
            </p>
          </Card>
        </div>

        <!-- Analytics Dashboard -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <div class="flex items-center justify-between mb-6">
            <h3
              class="text-2xl font-bold flex items-center gap-3 text-gray-900"
            >
              <BarChart3 class="w-7 h-7 text-purple-500" />
              Analytics Dashboard
            </h3>
            <Button
              variant="outline"
              size="sm"
              @click="navigateTo('/kepala-riset/dashboard')"
            >
              Lihat Detail
            </Button>
          </div>

          <!-- Charts and Analytics -->
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-8"
            v-if="dashboardAnalytics"
          >
            <!-- Annotations by Error Type -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                Distribusi Anotasi per Tipe Error
              </h4>
              <div
                v-if="dashboardAnalytics.annotations_by_error_type?.length"
                class="space-y-3"
              >
                <div
                  v-for="item in dashboardAnalytics.annotations_by_error_type.slice(
                    0,
                    5
                  )"
                  :key="item.error_type"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-gray-600">{{
                    item.error_type
                  }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-600 h-2 rounded-full"
                        :style="{ width: `${(item.count / Math.max(...dashboardAnalytics.annotations_by_error_type.map((i: any) => i.count))) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 w-8">{{
                      item.count
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-8">
                Tidak ada data anotasi
              </div>
            </div>

            <!-- Reviews by Error Type -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                Distribusi Review per Tipe Error
              </h4>
              <div
                v-if="dashboardAnalytics.reviews_by_error_type?.length"
                class="space-y-3"
              >
                <div
                  v-for="item in dashboardAnalytics.reviews_by_error_type.slice(
                    0,
                    5
                  )"
                  :key="item.error_type"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-gray-600">{{
                    item.error_type
                  }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-purple-600 h-2 rounded-full"
                        :style="{ width: `${(item.count / Math.max(...dashboardAnalytics.reviews_by_error_type.map((i: any) => i.count))) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-900 w-8">{{
                      item.count
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-8">
                Tidak ada data review
              </div>
            </div>
          </div>

          <!-- Document Status Overview -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">
              Status Dokumen
            </h4>
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4"
              v-if="dashboardAnalytics"
            >
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">
                  {{ dashboardAnalytics.pending_documents || 0 }}
                </div>
                <div class="text-sm text-blue-600">Pending</div>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">
                  {{ dashboardAnalytics.in_progress_documents || 0 }}
                </div>
                <div class="text-sm text-yellow-600">In Progress</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">
                  {{ dashboardAnalytics.completed_documents || 0 }}
                </div>
                <div class="text-sm text-green-600">Completed</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Annotator Dashboard -->
      <div v-if="hasRole('Annotator')" class="space-y-8">
        <!-- Annotator Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-green-500/10 border border-green-200">
            <Pencil class="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Anotator</h2>
            <p class="text-gray-500 text-lg">Kelola tugas anotasi Anda</p>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <FileText class="w-12 h-12 text-blue-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.assignedDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Ditugaskan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang harus dianotasi
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <CheckCircle class="w-12 h-12 text-green-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.completedDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Selesai
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang telah dianotasi
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <Clock class="w-12 h-12 text-yellow-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.inProgressDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Sedang Dikerjakan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen dalam proses
            </p>
          </Card>
        </div>

        <!-- Recent Assignments -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <ClipboardList class="w-7 h-7 text-blue-500" />
            Tugas Terbaru
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              v-for="task in recentTasks"
              :key="task.id"
              variant="glassmorphism"
              class="flex flex-col items-start gap-4 p-6 hover:border-gray-400 transition-all duration-300 border border-gray-200 bg-white/80 w-full !shadow-none"
              @click="navigateTo(`/anotator/anotasi/${task.id}`)"
            >
              <div class="flex items-center gap-4 mb-2">
                <FileText class="w-8 h-8 text-blue-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ task.title }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ task.sentences }} kalimat
                  </p>
                </div>
              </div>
              <span
                class="text-xs font-semibold px-3 py-1 rounded border border-gray-300 text-gray-700 bg-gray-50"
                :class="{
                  'text-blue-700 border-blue-200 bg-blue-50':
                    getTaskStatusColor(task.status) === 'blue',
                  'text-yellow-700 border-yellow-200 bg-yellow-50':
                    getTaskStatusColor(task.status) === 'yellow',
                  'text-green-700 border-green-200 bg-green-50':
                    getTaskStatusColor(task.status) === 'green',
                  'text-purple-700 border-purple-200 bg-purple-50':
                    getTaskStatusColor(task.status) === 'purple',
                  'text-orange-700 border-orange-200 bg-orange-50':
                    getTaskStatusColor(task.status) === 'orange',
                }"
              >
                {{ formatStatus(task.status) }}
              </span>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <Button
              variant="outline"
              size="lg"
              class="hover:bg-gray-900 hover:text-white transition"
              @click="navigateTo('/anotator/anotasi')"
            >
              Lihat Semua Tugas
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Reviewer Dashboard -->
      <div v-if="hasRole('Reviewer')" class="space-y-8">
        <!-- Reviewer Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-200">
            <Eye class="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Reviewer</h2>
            <p class="text-gray-500 text-lg">Kelola tugas review Anda</p>
          </div>
        </div>

        <!-- Progress Overview (same as annotator, but for reviewer) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <FileText class="w-12 h-12 text-purple-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.pendingReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Ditugaskan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang harus direview
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <CheckCircle class="w-12 h-12 text-green-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.completedReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Selesai
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang telah direview
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <Clock class="w-12 h-12 text-yellow-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.inProgressDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Sedang Dikerjakan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen dalam proses review
            </p>
          </Card>
        </div>

        <!-- Recent Assignments (same as annotator, but for reviewer) -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <ClipboardList class="w-7 h-7 text-purple-500" />
            Tugas Review Terbaru
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              v-for="task in recentReviewedDocs"
              :key="task.id"
              variant="glassmorphism"
              class="flex flex-col items-start gap-4 p-6 hover:border-gray-400 transition-all duration-300 border border-gray-200 bg-white/80 w-full !shadow-none"
              @click="navigateTo(`/reviewer/review/${task.id}`)"
            >
              <div class="flex items-center gap-4 mb-2">
                <FileText class="w-8 h-8 text-purple-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ task.title }}
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatDate(task.created_at) }}
                  </p>
                </div>
              </div>
              <span
                class="text-xs font-semibold px-3 py-1 rounded border border-gray-300 text-gray-700 bg-gray-50"
                :class="{
                  'text-blue-700 border-blue-200 bg-blue-50':
                    getTaskStatusColor(task.status) === 'blue',
                  'text-yellow-700 border-yellow-200 bg-yellow-50':
                    getTaskStatusColor(task.status) === 'yellow',
                  'text-green-700 border-green-200 bg-green-50':
                    getTaskStatusColor(task.status) === 'green',
                  'text-purple-700 border-purple-200 bg-purple-50':
                    getTaskStatusColor(task.status) === 'purple',
                  'text-orange-700 border-orange-200 bg-orange-50':
                    getTaskStatusColor(task.status) === 'orange',
                }"
              >
                {{ formatStatus(task.status) }}
              </span>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <Button
              variant="outline"
              size="lg"
              class="hover:bg-gray-900 hover:text-white transition"
              @click="navigateTo('/reviewer/review')"
            >
              Lihat Semua Tugas
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Kepala Riset Dashboard -->
      <div v-if="hasRole('Kepala Riset')" class="space-y-8">
        <!-- Research Head Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-200">
            <BarChart3 class="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">
              Dashboard Kepala Riset
            </h2>
            <p class="text-gray-500 text-lg">
              Pantau progress dan analytics lengkap proyek penelitian
            </p>
          </div>
        </div>

        <!-- Project Context Notice -->
        <div
          v-if="selectedProject"
          class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p class="text-sm text-blue-800">
            <strong>Project terpilih:</strong> {{ selectedProject.name }}
          </p>
          <p class="text-xs text-blue-600 mt-1">
            Data yang ditampilkan hanya untuk project ini
          </p>
        </div>
        <div v-else class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-600">
            Menampilkan data dari semua project
          </p>
        </div>

        <!-- Filters -->
        <Card
          variant="glassmorphism"
          class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Document
              </label>
              <Select v-model="selectedDocument">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih document..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Dokumen</SelectItem>
                  <SelectItem
                    v-for="doc in documents"
                    :key="doc.id"
                    :value="doc.id.toString()"
                  >
                    {{ doc.title || doc.name || `Document ${doc.id}` }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="mt-4">
            <Button @click="updateDashboardData" :loading="loadingFilter">
              <RefreshCw class="w-4 h-4 mr-2" />
              Update Data
            </Button>
          </div>
        </Card>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card
            v-if="pending"
            v-for="i in 4"
            :key="i"
            variant="glassmorphism"
            class="p-6 animate-pulse bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div class="w-16 h-8 bg-gray-200 rounded mb-3"></div>
            <div class="w-28 h-4 bg-gray-200 rounded"></div>
          </Card>

          <Card
            v-else
            v-for="stat in researchStats"
            :key="stat.label"
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <component
                :is="getIcon(stat.icon)"
                :class="`w-12 h-12 ${stat.color}`"
              />
              <span class="text-3xl font-bold text-gray-900">{{
                stat.value
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              {{ stat.label }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{ stat.description }}
            </p>
          </Card>
        </div>

        <!-- Charts and Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Annotations by Error Type -->
          <Card
            variant="glassmorphism"
            class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Distribusi Anotasi per Tipe Error
            </h3>
            <div
              v-if="dashboardAnalytics?.annotations_by_error_type?.length"
              class="space-y-3"
            >
              <div
                v-for="item in dashboardAnalytics.annotations_by_error_type"
                :key="item.error_type"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600">{{ item.error_type }}</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${(item.count / Math.max(...dashboardAnalytics.annotations_by_error_type.map((i: any) => i.count))) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-8">{{
                    item.count
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              Tidak ada data anotasi
            </div>
          </Card>

          <!-- Reviews by Error Type -->
          <Card
            variant="glassmorphism"
            class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Distribusi Review per Tipe Error
            </h3>
            <div
              v-if="dashboardAnalytics?.reviews_by_error_type?.length"
              class="space-y-3"
            >
              <div
                v-for="item in dashboardAnalytics.reviews_by_error_type"
                :key="item.error_type"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600">{{ item.error_type }}</span>
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-purple-600 h-2 rounded-full"
                      :style="{ width: `${(item.count / Math.max(...dashboardAnalytics.reviews_by_error_type.map((i: any) => i.count))) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-8">{{
                    item.count
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              Tidak ada data review
            </div>
          </Card>
        </div>

        <!-- Document Status Overview -->
        <Card
          variant="glassmorphism"
          class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Status Dokumen
          </h3>
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
            v-if="dashboardAnalytics"
          >
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {{ dashboardAnalytics.pending_documents || 0 }}
              </div>
              <div class="text-sm text-blue-600">Pending</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">
                {{ dashboardAnalytics.in_progress_documents || 0 }}
              </div>
              <div class="text-sm text-yellow-600">In Progress</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {{ dashboardAnalytics.completed_documents || 0 }}
              </div>
              <div class="text-sm text-green-600">Completed</div>
            </div>
          </div>
        </Card>

        <!-- Progress Chart -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900"
          >
            <TrendingUp class="w-7 h-7 text-green-500" />
            Progress Proyek
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Progress Bars -->
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Anotasi</span>
                  <span class="text-gray-400"
                    >{{
                      dashboardAnalytics?.totals?.annotations || 0
                    }}
                    total</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.min(
                      ((dashboardAnalytics?.totals?.annotations || 0) /
                        Math.max(
                          dashboardAnalytics?.per_document?.length || 1,
                          1
                        )) *
                        10,
                      100
                    )}%`"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Review</span>
                  <span class="text-gray-400"
                    >{{ dashboardAnalytics?.totals?.reviews || 0 }} total</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.min(
                      ((dashboardAnalytics?.totals?.reviews || 0) /
                        Math.max(
                          dashboardAnalytics?.totals?.annotations || 1,
                          1
                        )) *
                        100,
                      100
                    )}%`"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Inter-Annotator Agreement</span>
                  <span class="text-gray-400"
                    >{{
                      (
                        (dashboardAnalytics?.inter_annotator_agreement
                          ?.cohen_kappa_avg || 0) * 100
                      ).toFixed(1)
                    }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${
                      (dashboardAnalytics?.inter_annotator_agreement
                        ?.cohen_kappa_avg || 0) * 100
                    }%`"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-4">
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/kelola-project')"
              >
                <ClipboardList class="w-5 h-5" />
                Kelola Proyek
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium"
                @click="togglePerformanceSection"
              >
                <Users class="w-5 h-5" />
                Performance Team
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium hover:bg-gray-50 hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
                @click="navigateTo('/admin/kelola-dokumen')"
              >
                <Download class="w-5 h-5" />
                Export Dataset
              </Button>
            </div>
          </div>
        </Card>

        <!-- User Performance Section -->
        <div
          v-if="showPerformanceSection"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <!-- Annotator Performance -->
          <Card
            variant="glassmorphism"
            class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Performance Anotator
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Anotator
                </label>
                <Select v-model="selectedAnnotator">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih anotator..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in annotators"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.full_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                @click="loadAnnotatorPerformance"
                :loading="loadingAnnotator"
                :disabled="!selectedAnnotator"
              >
                Load Performance
              </Button>
              <div v-if="annotatorPerformance" class="space-y-2 pt-4 border-t">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Anotasi:</span>
                  <span class="font-medium">{{
                    annotatorPerformance.totals.annotations
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Dokumen Dikerjakan:</span>
                  <span class="font-medium">{{
                    annotatorPerformance.per_document.length
                  }}</span>
                </div>
                <div
                  v-if="annotatorPerformance.per_document.length > 0"
                  class="mt-2"
                >
                  <span class="text-xs text-gray-500">Per Dokumen:</span>
                  <div class="max-h-20 overflow-y-auto mt-1">
                    <div
                      v-for="doc in annotatorPerformance.per_document.slice(
                        0,
                        3
                      )"
                      :key="doc.document__id"
                      class="text-xs text-gray-600 truncate"
                    >
                      {{ doc.document__title }}:
                      {{ doc.annotations_count }} anotasi
                    </div>
                    <div
                      v-if="annotatorPerformance.per_document.length > 3"
                      class="text-xs text-gray-400"
                    >
                      +{{ annotatorPerformance.per_document.length - 3 }}
                      dokumen lainnya
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Reviewer Performance -->
          <Card
            variant="glassmorphism"
            class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Performance Reviewer
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Reviewer
                </label>
                <Select v-model="selectedReviewer">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih reviewer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in reviewers"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.full_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                @click="loadReviewerPerformance"
                :loading="loadingReviewer"
                :disabled="!selectedReviewer"
              >
                Load Performance
              </Button>
              <div v-if="reviewerPerformance" class="space-y-2 pt-4 border-t">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total Review:</span>
                  <span class="font-medium">{{
                    reviewerPerformance.totals.reviews
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Dokumen Dikerjakan:</span>
                  <span class="font-medium">{{
                    reviewerPerformance.per_document.length
                  }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed, onMounted, watch } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Calendar,
  Zap,
  UserPlus,
  FilePlus,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  ClipboardList,
  Eye,
  CheckCircle2,
  List,
  FileCheck,
  BarChart3,
  Download,
  Users,
  Pencil,
  RefreshCw,
  TrendingUp,
  Building2,
} from "lucide-vue-next";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAuth } from "~/data/auth";
import { useDashboardApi } from "~/data/dashboard";
import { useUsersApi } from "~/data/users";
import { useDocumentsApi } from "~/data/documents";
import { useUserDocumentsApi } from "~/data/user-documents";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { DocumentStatus } from "~/types/api";

const { user } = useAuth();
const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance } =
  useDashboardApi();
const { getUsers, getAllUsers } = useUsersApi();
const { getDocuments } = useDocumentsApi();
const { getAssignedDocuments } = useUserDocumentsApi();
const { getProjects } = useProjectsApi();
const {
  selectedProject,
  setSelectedProject,
  clearSelectedProject,
  selectedProjectId,
} = useProjectContext();

const pending = ref(false);

const dashboardAnalytics = ref<any>(null);

const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    users: Users,
    "document-text": FileText,
    "clipboard-document-list": ClipboardList,
    "exclamation-triangle": AlertTriangle,
    pencil: Pencil,
    "check-circle": CheckCircle,
    "arrow-down-tray": Download,
    "user-group": Users,
    "chart-bar": BarChart3,
    clock: Clock,
    envelope: Mail,
    calendar: Calendar,
    bolt: Zap,
    "user-plus": UserPlus,
    "document-plus": FilePlus,
    eye: Eye,
    "check-badge": CheckCircle2,
    "queue-list": List,
    "document-check": FileCheck,
  };
  return iconMap[iconName] || FileText;
};

const userData = computed(() => ({
  name: user.value?.full_name || "Pengguna",
  email: user.value?.email || "pengguna@anota.com",
  roles: user.value?.roles || ["Pengguna"],
  memberSince: user.value?.date_joined
    ? new Date(user.value.date_joined).toLocaleDateString("id-ID")
    : "1 Januari 2024",
  avatar:
    user.value?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value?.full_name || "User"
    )}&background=0ea5e9&color=fff`,
}));

const hasRole = (role: string) => user.value?.roles?.includes(role) || false;

const adminStats = ref([
  {
    label: "Total Pengguna",
    value: 0,
    icon: "users",
    color: "text-blue-400",
    description: "Pengguna aktif sistem",
  },
  {
    label: "Dokumen Upload",
    value: 0,
    icon: "document-text",
    color: "text-green-400",
    description: "Dokumen dalam sistem",
  },
  {
    label: "Tugas Aktif",
    value: 0,
    icon: "clipboard-document-list",
    color: "text-orange-400",
    description: "Tugas sedang dikerjakan",
  },
  {
    label: "Error Terdeteksi",
    value: 0,
    icon: "exclamation-triangle",
    color: "text-red-400",
    description: "Error yang perlu ditangani",
  },
]);

const annotatorStats = ref({
  assignedDocuments: 0,
  completedDocuments: 0,
  inProgressDocuments: 0,
});

const reviewerStats = ref({
  pendingReviews: 0,
  completedReviews: 0,
  errorsFound: 0,
  todayReviewed: 0,
  accuracy: 0,
});

const researchStats = ref([
  {
    label: "Total Anotasi",
    value: 0,
    icon: "pencil",
    color: "text-blue-400",
    description: "Anotasi yang telah dibuat",
  },
  {
    label: "Review Selesai",
    value: 0,
    icon: "check-circle",
    color: "text-green-400",
    description: "Review yang telah selesai",
  },
  {
    label: "Dataset Generated",
    value: 0,
    icon: "arrow-down-tray",
    color: "text-purple-400",
    description: "Dataset yang telah dibuat",
  },
  {
    label: "Active Annotators",
    value: 0,
    icon: "user-group",
    color: "text-orange-400",
    description: "Anotator yang aktif",
  },
]);

interface Task {
  id: string;
  title: string;
  sentences: number;
  status: DocumentStatus;
}

const recentTasks = ref<Task[]>([]);

const reviewQueue = ref<
  Array<{
    id: string;
    title: string;
    annotator: string;
    priority: string;
  }>
>([]);

const recentReviewedDocs = ref<any[]>([]);

// Dashboard filters and analytics
const selectedDocument = ref<string>("all");
const loadingFilter = ref(false);
const showPerformanceSection = ref(false);
const projects = ref<any[]>([]);
const documents = ref<any[]>([]);
const userProjects = ref<any[]>([]);
const isLoadingProjects = ref(false);

// Performance tracking
const selectedAnnotator = ref<string>("");
const selectedReviewer = ref<string>("");
const loadingAnnotator = ref(false);
const loadingReviewer = ref(false);
const annotators = ref<any[]>([]);
const reviewers = ref<any[]>([]);
const annotatorPerformance = ref<any>(null);
const reviewerPerformance = ref<any>(null);

// Reviewer stats summary
const reviewerStatsSummary = computed(() => ({
  reviewed: reviewerStats.value?.completedReviews ?? 0,
  todayReviewed: reviewerStats.value?.todayReviewed ?? 0,
  accuracy: reviewerStats.value?.accuracy ?? 0,
  total: reviewerStats.value?.pendingReviews ?? 0,
}));

// Helper functions
const getTaskStatusColor = (status: DocumentStatus | string) => {
  const colorMap: Record<
    string,
    "blue" | "yellow" | "green" | "purple" | "orange" | "gray"
  > = {
    // Document statuses
    belum_dianotasi: "gray",
    sedang_dianotasi: "yellow",
    sudah_dianotasi: "blue",
    belum_direview: "purple",
    sedang_direview: "orange",
    sudah_direview: "green",
  };
  return colorMap[status] || "gray";
};

const formatStatus = (status: DocumentStatus | string) => {
  const statusMap: Record<string, string> = {
    // Document statuses
    belum_dianotasi: "Belum Dianotasi",
    sedang_dianotasi: "Sedang Dianotasi",
    sudah_dianotasi: "Sudah Dianotasi",
    belum_direview: "Belum Direview",
    sedang_direview: "Sedang Direview",
    sudah_direview: "Sudah Direview",
  };
  return statusMap[status.toLowerCase()] || status;
};

// Date formatting function
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Page meta
useHead({
  title: "Anota",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});

onMounted(async () => {
  pending.value = true;
  await fetchUserProjects();
  try {
    await fetchDashboardData();
    await loadFilterData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    pending.value = false;
  }
});

// Watch for project context changes
watch(selectedProjectId, async () => {
  if (hasRole("Kepala Riset")) {
    await updateDashboardData();
  }
});

const fetchDashboardData = async () => {
  try {
    // Get dashboard summary data for all roles with project context
    const params: any = {};
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
    }
    const dashboardData = await getDashboardSummary(params);

    // Store analytics data for admin dashboard
    dashboardAnalytics.value = dashboardData;

    if (hasRole("Admin")) {
      // Get user count for admin
      const usersData = await getUsers();
      const documentsData = await getDocuments();

      adminStats.value = [
        {
          label: "Total Pengguna",
          value: usersData.count || 0,
          icon: "users",
          color: "text-blue-400",
          description: "Pengguna aktif sistem",
        },
        {
          label: "Dokumen Upload",
          value: documentsData.count || dashboardData.per_document?.length || 0,
          icon: "document-text",
          color: "text-green-400",
          description: "Dokumen dalam sistem",
        },
        {
          label: "Total Anotasi",
          value: dashboardData.totals?.annotations || 0,
          icon: "clipboard-document-list",
          color: "text-orange-400",
          description: "Anotasi yang telah dibuat",
        },
        {
          label: "Total Review",
          value: dashboardData.totals?.reviews || 0,
          icon: "exclamation-triangle",
          color: "text-red-400",
          description: "Review yang telah dilakukan",
        },
      ];
    }

    if (hasRole("Annotator") && user.value?.id) {
      // Get annotator-specific performance data
      const assignedDocs = await getAssignedDocuments();

      // Calculate stats based on document status
      const docResults = assignedDocs.results || [];
      const completedDocs = docResults.filter(
        (doc: any) =>
          doc.status === "sudah_dianotasi" || doc.status === "sudah_direview"
      );
      const inProgressDocs = docResults.filter(
        (doc: any) =>
          doc.status === "sedang_dianotasi" || doc.status === "sedang_direview"
      );

      annotatorStats.value = {
        assignedDocuments: assignedDocs.count || 0,
        completedDocuments: completedDocs.length,
        inProgressDocuments: inProgressDocs.length,
      };

      // Map assigned documents to recent tasks format
      recentTasks.value =
        assignedDocs.results?.slice(0, 3).map((doc: any, index: number) => ({
          id: doc.id.toString(),
          title: doc.title || `Dokumen ${doc.id}`,
          sentences: doc.jumlah_sentence || doc.sentence_count || 0,
          status: (doc.status as DocumentStatus) || "belum_dianotasi",
        })) || [];
    }

    if (hasRole("Reviewer") && user.value?.id) {
      const assignedDocs = await getAssignedDocuments();
      const docResults = assignedDocs.results || [];
      const completedDocs = docResults.filter(
        (doc: any) => doc.status === "sudah_direview"
      );
      const inProgressDocs = docResults.filter(
        (doc: any) => doc.status === "sedang_direview"
      );
      const pendingDocs = docResults.filter(
        (doc: any) => doc.status === "belum_direview"
      );

      reviewerStats.value = {
        pendingReviews: pendingDocs.length,
        completedReviews: completedDocs.length,
        errorsFound: 0,
        todayReviewed: 0,
        accuracy: 0,
      };

      recentReviewedDocs.value =
        completedDocs.slice(0, 5).map((doc: any) => ({
          id: doc.id.toString(),
          title: doc.title || `Dokumen ${doc.id}`,
          created_at: doc.created_at,
          status: doc.status,
        })) || [];
    }

    if (hasRole("Kepala Riset")) {
      // Get projects data for additional statistics
      let projectsCount = 0;
      try {
        const projectsData = await getProjects();
        projectsCount = projectsData.count || 0;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }

      researchStats.value = [
        {
          label: "Total Anotasi",
          value: dashboardData.totals?.annotations || 0,
          icon: "pencil",
          color: "text-blue-400",
          description: "Anotasi yang telah dibuat",
        },
        {
          label: "Review Selesai",
          value: dashboardData.totals?.reviews || 0,
          icon: "check-circle",
          color: "text-green-400",
          description: "Review yang telah selesai",
        },
        {
          label: "Total Proyek",
          value: projectsCount,
          icon: "arrow-down-tray",
          color: "text-purple-400",
          description: "Proyek yang dikelola",
        },
        {
          label: "Dokumen Aktif",
          value:
            dashboardData.per_document?.filter(
              (doc: any) => doc.annotations > 0 || doc.reviews > 0
            )?.length || 0,
          icon: "user-group",
          color: "text-orange-400",
          description: "Dokumen dalam progress",
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

// Load additional data for Kepala Riset filters
const loadFilterData = async () => {
  if (!hasRole("Kepala Riset")) return;

  try {
    // Load projects
    const projectsData = await getProjects();
    projects.value = projectsData.results || [];

    // Load documents
    const documentsData = await getDocuments();
    documents.value = documentsData.results || [];

    // Load users for performance tracking
    const allUsers = await getAllUsers();

    annotators.value = allUsers.filter((user: any) =>
      user.roles?.includes("Annotator")
    );
    reviewers.value = allUsers.filter((user: any) =>
      user.roles?.includes("Reviewer")
    );
  } catch (error) {
    console.error("Error loading filter data:", error);
  }
};

// Update dashboard data with filters
const updateDashboardData = async () => {
  if (!hasRole("Kepala Riset")) return;

  loadingFilter.value = true;
  try {
    const params: any = {};
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
    }
    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    // Refresh dashboard data with filters
    const dashboardData = await getDashboardSummary(params);
    dashboardAnalytics.value = dashboardData;

    // Update research stats with filtered data
    researchStats.value = [
      {
        label: "Total Anotasi",
        value: dashboardData.totals?.annotations || 0,
        icon: "pencil",
        color: "text-blue-400",
        description: "Anotasi yang telah dibuat",
      },
      {
        label: "Review Selesai",
        value: dashboardData.totals?.reviews || 0,
        icon: "check-circle",
        color: "text-green-400",
        description: "Review yang telah selesai",
      },
      {
        label: "Total Dokumen",
        value: dashboardData.per_document?.length || 0,
        icon: "arrow-down-tray",
        color: "text-purple-400",
        description: "Total dokumen dalam sistem",
      },
      {
        label: "Dokumen Aktif",
        value:
          dashboardData.per_document?.filter(
            (doc: any) => doc.annotations > 0 || doc.reviews > 0
          )?.length || 0,
        icon: "user-group",
        color: "text-orange-400",
        description: "Dokumen dalam progress",
      },
    ];
  } catch (error) {
    console.error("Error updating dashboard data:", error);
  } finally {
    loadingFilter.value = false;
  }
};

const togglePerformanceSection = () => {
  showPerformanceSection.value = !showPerformanceSection.value;
};

const loadAnnotatorPerformance = async () => {
  if (!selectedAnnotator.value) return;

  loadingAnnotator.value = true;
  try {
    const params: any = { user_id: selectedAnnotator.value };
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
    }
    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    annotatorPerformance.value = await getAnnotatorPerformance(params);
  } catch (error) {
    console.error("Error loading annotator performance:", error);
  } finally {
    loadingAnnotator.value = false;
  }
};

// Load reviewer performance
const loadReviewerPerformance = async () => {
  if (!selectedReviewer.value) return;

  loadingReviewer.value = true;
  try {
    const params: any = { user_id: selectedReviewer.value };
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
    }
    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    reviewerPerformance.value = await getReviewerPerformance(params);
  } catch (error) {
    console.error("Error loading reviewer performance:", error);
  } finally {
    loadingReviewer.value = false;
  }
};

// Fetch projects for admin
async function fetchUserProjects() {
  if (!hasRole("Admin")) return;
  isLoadingProjects.value = true;
  try {
    const response = await getProjects();
    userProjects.value = response.results || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    isLoadingProjects.value = false;
  }
}

// Handle project change
function handleProjectChange(value: string) {
  // Only allow project changes for Kepala Riset users who are not Admin
  if (!hasRole('Kepala Riset') || hasRole('Admin')) {
    return;
  }
  
  if (!value || value === "all") {
    clearSelectedProject();
  } else {
    const project = userProjects.value.find(
      (p: any) => p.id.toString() === value
    );
    if (project) {
      setSelectedProject(project);
    }
  }
  // Refresh dashboard data
  fetchDashboardData();
}

onMounted(async () => {
  pending.value = true;
  await fetchUserProjects();
  try {
    await fetchDashboardData();
    await loadFilterData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    pending.value = false;
  }
});
</script>
