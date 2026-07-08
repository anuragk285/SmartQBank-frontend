import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  const selectedSubject = ref(null) // { id, name, department, semester }

  function selectSubject(subject) {
    selectedSubject.value = subject
  }

  function clearSubject() {
    selectedSubject.value = null
  }

  return { selectedSubject, selectSubject, clearSubject }
})