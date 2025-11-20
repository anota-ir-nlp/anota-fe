import { useState } from '#imports'
import { computed, readonly, onMounted } from 'vue'
import type { ProjectResponse } from '~/types/api'

const STORAGE_KEY = 'anota.selectedProject'

export function useProjectContext() {
  const getInitialProject = (): ProjectResponse | null => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
      } catch (e) {
        console.error('Failed to parse stored project:', e)
        return null
      }
    }
    return null
  }

  const selectedProject = useState<ProjectResponse | null>('admin.selectedProject', getInitialProject)
  const selectedProjectId = computed(() => selectedProject.value?.id || null)
  const isAllProjects = computed(() => selectedProject.value === null)

  function setSelectedProject(project: ProjectResponse | null) {
    selectedProject.value = project

    if (process.client) {
      if (project) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  function clearSelectedProject() {
    selectedProject.value = null

    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    selectedProject: readonly(selectedProject),
    selectedProjectId: readonly(selectedProjectId),
    isAllProjects: readonly(isAllProjects),
    setSelectedProject,
    clearSelectedProject,
  }
}
