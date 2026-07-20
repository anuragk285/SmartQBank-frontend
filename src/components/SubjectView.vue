<template>
  <div class="flex min-h-screen w-full bg-white dark:bg-surface-900">
    
    <!-- PRIMEVUE DRAWER -->
    <!-- 
      :modal="isMobile" -> Removes the grey backdrop on desktop
      :dismissable="isMobile" -> Prevents clicking outside from closing it on desktop
      :showCloseIcon="isMobile" -> Hides the 'X' button on desktop since it's a permanent sidebar
    -->
    <Drawer
      v-model:visible="open"
      :modal="isMobile"
      :dismissable="isMobile"
      :showCloseIcon="isMobile"
      class="w-72 sm:w-80 shadow-2xl lg:shadow-none lg:border-r lg:border-surface-200"
      :pt="{
        root: { class: '!top-16 !h-[calc(100vh-4rem)]' },
        mask: { class: '!top-16 !h-[calc(100vh-4rem)]' }
      }"
    >
      <!-- HEADER SLOT -->
      <template #header>
        <div class="flex flex-col gap-2">
          <h2 class="tracking-widest text-sm font-inter text-gray-500">FILTERS</h2>
          <div>
            <h3 class="tracking-wide font-inter text-xl font-bold">Refine your search</h3>
            <h3 class="tracking-wide text-xs font-inter text-gray-500">Select a subject</h3>
          </div>
        </div>
      </template>

      <!-- CONTENT SLOT -->
      <div class="flex flex-col gap-6 mt-4">
        
        <!-- Department Filter -->
        <div class="flex flex-col gap-2">
          <label for="department" class="font-semibold text-sm text-gray-700">DEPARTMENT</label>
          <Select
            id="department"
            :options="departments"
            v-model="selectedDepartment"
            optionLabel="label"
            optionValue="value"
            placeholder="Select your Department"
            class="w-full"
          />
        </div>
        
        <!-- Semester Filter -->
        <div class="flex flex-col gap-2">
          <label for="semester" class="font-semibold text-sm text-gray-700">SEMESTER</label>
          <Select
            id="semester"
            :options="semesters"
            v-model="selectedSemester"
            optionLabel="label"
            optionValue="value"
            placeholder="Select your Semester"
            class="w-full"
          />
        </div>
        
        <!-- Regulation Filter -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-gray-700">REGULATION</label>
          <div class="flex flex-col gap-3 mt-1 ps-2">
            <div class="flex items-center gap-3" v-for="rc in regulationCodes" :key="rc.value">
              <RadioButton 
                v-model="selectedRegulationCode" 
                :inputId="rc.label" 
                :name="rc.label" 
                :value="rc.value" 
              />
              <label :for="rc.label" class="text-sm cursor-pointer">{{ rc.value }}</label>
            </div>
          </div>
        </div>
        
        <!-- Apply Button -->
        <Button 
          class="w-full justify-center bg-sky-800 border-sky-800 hover:bg-sky-900 mt-2" 
          @click="applyFilterOnSubjects"
        >
          APPLY FILTER
        </Button>
      </div>
    </Drawer>

    <!-- MAIN CONTENT AREA -->
    <!-- When the drawer is open on desktop (!isMobile), we apply ml-80 to push this content to the right by exactly the drawer's width -->
    <div :class="[
      'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
      (open && !isMobile) ? 'ml-80' : 'ml-0'
    ]">
      
      <!-- TOP HEADER (Trigger) -->
      <!-- Changed to @click="open = !open" so it acts as a toggle button -->
      <header class="flex h-16 items-center gap-2 border-b border-surface-200 dark:border-surface-700 px-4">
        <Button severity="secondary" text size="small" @click="open = !open" class="flex gap-2 items-center">
          <i class="pi pi-sidebar text-lg"></i>
          <span class="font-bold tracking-wide">FILTERS</span>
        </Button>
      </header>

      <!-- PAGE CONTENT -->
      <main class="flex-1 px-4 py-6 sm:px-8 flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-primary text-3xl font-bold">Subjects</h1>
          <h2 class="text-gray-500">Select a subject to view questions</h2>
        </div>
        
        <div>
          <!-- Subjects Grid -->
          <div v-if="filteredSubjects.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
              <div v-for="subject in filteredSubjects" :key="subject.id" @click="onSubjectSelect(subject)" class="h-full">
                <SubjectCard
                  :subject_code="subject.subject_code"
                  :subject_name="subject.name"
                  class="cursor-pointer h-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 my-4">
            <span class="pi pi-filter-slash text-4xl text-gray-400 mb-3"></span>
            <h3 class="text-lg font-semibold text-gray-700">ERROR 404</h3>
            <p class="text-sm text-gray-500 mt-1 max-w-sm">
              No Subjects Found matching those criteria.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '@/stores/subject.js'

// PrimeVue Components
import Drawer from 'primevue/drawer'
import Select from 'primevue/select'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'

// Local Components
import SubjectCard from './SubjectCard.vue'

const router = useRouter()
const subjectStore = useSubjectStore()

const selectedDepartment = ref('CSE')
const selectedSemester = ref(5)
const selectedRegulationCode = ref('R22')

const isMobile = ref(false)
const open = ref(true)

let mql = null
let onMqlChange = null
const loading = ref(false)
const allSubjects = ref([])
const filteredSubjects = ref([])

const regulationCodes = ref([
  { label: 'R22A', value: 'R22A' },
  { label: 'R22', value: 'R22' },
  { label: 'R20', value: 'R20' },
  { label: 'R18', value: 'R18' },
])

const departments = ref([
  { label: 'CSE', value: 'CSE' },
  { label: 'IT', value: 'IT' },
  { label: 'CSM', value: 'CSM' },
  { label: 'AI&ML', value: 'AI&ML' },
  { label: 'CET', value: 'CET' },
  { label: 'Mechanical', value: 'Mech' },
  { label: 'Biotech', value: 'Biotech' },
  { label: 'AI&DS', value: 'AI&DS' },
  { label: 'Civil', value: 'Civil' },
  { label: 'ECE', value: 'ECE' },
  { label: 'Chemical', value: 'Chem' },
])

const semesters = ref([
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
  { label: 7, value: 7 },
  { label: 8, value: 8 },
])

async function loadAllSubjects() {
  loading.value = true
  try {
    const subjectsRes = await fetch(`http://127.0.0.1:8000/api/subjects/${selectedDepartment.value}/${selectedSemester.value}/${selectedRegulationCode.value}`)
    if (!subjectsRes.ok) throw new Error('API Connection failed')
    allSubjects.value = await subjectsRes.json()
  } catch (error) {
    console.error('Failed loading subject cards array:', error)
  } finally {
    loading.value = false
    filteredSubjects.value = allSubjects.value
  }
}

async function applyFilterOnSubjects() {
  await loadAllSubjects()
  if (isMobile.value) {
    open.value = false
  }
  scrollToTop()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  loadAllSubjects()
  
  // Responsive Drawer Logic
  mql = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mql.matches
  open.value = !isMobile.value
  
  onMqlChange = (event) => {
    isMobile.value = event.matches
    open.value = !event.matches
  }
  mql.addEventListener('change', onMqlChange)
})

onBeforeUnmount(() => {
  if (mql && onMqlChange) {
    mql.removeEventListener('change', onMqlChange)
  }
})

function onSubjectSelect(subject) {
  subjectStore.selectSubject(subject) 
  router.push({ name: 'questions', params: { subjectId: subject.id } })
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
}
</script>

<style scoped></style>