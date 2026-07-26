import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  const selectedSubject = ref(null) // { id, name, department, semester }

  const filters = ref({
    department: 'CSE',
    semester: 5,
    regulation_code: 'R22'
  })

  function selectSubject(subject) {
    selectedSubject.value = subject
  }

  function clearSubject() {
    selectedSubject.value = null
  }

  return { selectedSubject, selectSubject, clearSubject, filters }
},
{persist: true})