import { useState } from '#imports'
import { computed, readonly, watch, onMounted } from 'vue'
import type { ProjectResponse } from '~/types/api'

const STORAGE_KEY = 'anota.selectedProject'

// Shared state initialization flag to prevent multiple initializations
let isInitialized = false

export function useProjectContext() {
  // Initialize state with null - will be hydrated on client
  const selectedProject = useState<ProjectResponse | null>(
    'admin.selectedProject', 
    () => null
  )
  
  const selectedProjectId = computed(() => selectedProject.value?.id || null)
  const isAllProjects = computed(() => selectedProject.value === null)

  // Load from localStorage on client mount
  const loadFromStorage = (): ProjectResponse | null => {
    if (!process.client) return null
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      
      // Validate the parsed data has required fields
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        return parsed as ProjectResponse
      }
      
      // Invalid data, clean up
      localStorage.removeItem(STORAGE_KEY)
      return null
    } catch (e) {
      console.error('Failed to parse stored project:', e)
      // Clean up corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (cleanupError) {
        console.error('Failed to clean up storage:', cleanupError)
      }
      return null
    }
  }

  // Save to localStorage
  const saveToStorage = (project: ProjectResponse | null) => {
    if (!process.client) return
    
    try {
      if (project) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      console.error('Failed to save project to storage:', e)
    }
  }

  function setSelectedProject(project: ProjectResponse | null) {
    selectedProject.value = project
    saveToStorage(project)
  }

  function clearSelectedProject() {
    selectedProject.value = null
    saveToStorage(null)
  }

  // Initialize from storage on client-side only once
  if (process.client && !isInitialized) {
    isInitialized = true
    
    // Load immediately if available
    const storedProject = loadFromStorage()
    if (storedProject) {
      selectedProject.value = storedProject
    }

    // Listen for storage events (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue)
            if (parsed && typeof parsed === 'object' && 'id' in parsed) {
              selectedProject.value = parsed as ProjectResponse
            }
          } catch (error) {
            console.error('Failed to parse storage event:', error)
          }
        } else {
          selectedProject.value = null
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup on unmount (though composables don't have direct unmount hooks)
    // The event listener will be cleaned up when the page is unloaded
  }

  return {
    selectedProject: readonly(selectedProject),
    selectedProjectId: readonly(selectedProjectId),
    isAllProjects: readonly(isAllProjects),
    setSelectedProject,
    clearSelectedProject,
  }
}
