import { useState } from '#imports'
import type { ProjectResponse } from '~/types/api'

export function useProjectContext() {
  const selectedProject = useState<ProjectResponse | null>('admin.selectedProject', () => null)
  const selectedProjectId = computed(() => selectedProject.value?.id || null)
  const isAllProjects = computed(() => selectedProject.value === null)

  function setSelectedProject(project: ProjectResponse | null) {
    selectedProject.value = project
  }

  function clearSelectedProject() {
    selectedProject.value = null
  }

  return {
    selectedProject: readonly(selectedProject),
    selectedProjectId: readonly(selectedProjectId),
    isAllProjects: readonly(isAllProjects),
    setSelectedProject,
    clearSelectedProject,
  }
}
