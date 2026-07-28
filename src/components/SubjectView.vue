<template>
  <div class="w-full">
    <div class="relative flex min-h-screen w-full">
      <div 
        v-if="isMobile && open" 
        @click="open = false" 
        class="fixed inset-0 bg-black/40 z-50 lg:hidden"
      ></div>

      <!-- Sidebar / Aside Container -->
      <aside
        :class="[
          'bg-white border-gray-200 transition-all duration-300 z-50 flex flex-col justify-between overflow-hidden',

          /* Mobile drawer: */
          'fixed top-0 bottom-0 left-0 w-80 shadow-2xl h-screen',
          open ? 'translate-x-0' : '-translate-x-full',

          /* Desktop sticky sidebar*/
          'lg:sticky lg:top-0 lg:bottom-auto lg:shadow-none lg:translate-x-0 lg:h-screen',
          open ? 'lg:w-80 lg:border-r' : 'lg:w-0 lg:border-r-0'
        ]"
      >
        <div class="p-4 flex flex-col gap-4 w-80 translate-x overflow-y-auto overscroll-contain">
          <!-- Sidebar Header -->
          <div class="mb-4">
              <h2 class="tracking-widest text-sm font-inter text-gray-500">FILTERS</h2>
          </div>

          <!-- Sidebar Content / Menu -->
          <div class="flex-1">
            <div class="flex flex-col gap-6">
              <!-- Department Select -->
              <div class="flex flex-col gap-2">
                <label for="department" class="text-sm font-semibold text-gray-700">DEPARTMENT</label>
                <Select
                  id="department"
                  :options="departments"
                  :default-value="selectedDepartment"
                  v-model="selectedDepartment"
                  option-label="label"
                  option-value="value"
                  append-to="self"
                  placeholder="Select your Department"
                  class="w-full border border-gray-300 text-gray-600"
                />
              </div>

              <!-- Semester Select -->
              <div class="flex flex-col gap-2">
                <label for="semester" class="text-sm font-semibold text-gray-700">SEMESTER</label>
                <Select
                  id="semester"
                  :options="semesters"
                  :default-value="selectedSemester"
                  v-model="selectedSemester"
                  option-label="label"
                  option-value="value"
                  append-to="self"
                  placeholder="Select your Semester"
                  class="w-full border border-gray-300 text-gray-600"
                />
              </div>

              <!-- Regulation Radio Group -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">REGULATION</label>
                <div class="flex items-center justify-start ps-3">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-3" v-for="rc in regulationCodes" :key="rc.value">
                      <RadioButton v-model="selectedRegulationCode" :input-id="rc.label" :name="rc.label" :value="rc.value" />
                      <label :for="rc.label" class="text-sm text-gray-700 cursor-pointer">{{ rc.value }}</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Apply Button -->
              <div class="pt-2">
              <Button class="w-full cursor-pointer bg-sky-800 border-sky-800 text-white" @click="applyFilterOnSubjects()">
                APPLY FILTER
              </Button>
            </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 min-w-0 transition-all duration-300 ease-in-out"
            :class="isMobile ? 'w-full px-4' : open ? 'px-6' : 'px-[10%]'">
        <header class="px-1 mb-3 bg-white z-30">
          <Button severity="secondary" text size="small" @click="open = !open" class="flex items-center gap-2 border-gray-300 bg-gray-50 ms-1 mt-4">
            <h4 class="text-sky-700 text-lg sm:text-sm">FILTERS</h4>
            <span class="pi pi-filter text-sky-700 text-lg sm:text-sm"></span>
          </Button>
        </header>

        <div class="mx-2 flex flex-col gap-5">
          <div class="mx-1 flex flex-col gap-1">
            <div class="flex flex-nowrap gap-2 text-primary items-center text-2xl font-bold">
              <h2>{{ headerRegulationCode }}</h2>
              <span class="pi pi-angle-right text-xl mx-[0.5]"></span>
              <h2>{{ headerDepartment }}</h2> 
              <span class="pi pi-angle-right text-xl mx-[0.5]"></span>
              <h2>Sem {{ headerSemester }}</h2>
          </div>
            <!-- <h1 class="text-primary text-xl font-bold">Subjects</h1> -->
            <h2 class="text-gray-500">Select a subject to view questions</h2>
          </div>
          <div>
            <div v-if="filteredSubjects.length > 0 || loading" class="w-full">
                <DataTable :value="loading ? Array(5).fill({}) : filteredSubjects" @row-click="onRowClick" row-hover class="cursor-pointer" :row-class="getRowClass">
                  <Column header="Subject Name" sortable field="name" class="hover:text-primary-dark">
                    <template #body="{ data }">
                      <Skeleton v-if="loading" width="10rem" height="1rem" borderRadius="16px"/>
                      <span v-else >{{ data.name }}</span>
                    </template>
                  </Column>
                    <Column header="Subject Code" class="hover:text-tertiary">
                      <template #body="{ data }">
                        <Skeleton v-if="loading" width="5rem" height="1rem" borderRadius="16px"/>
                        <span class="sm:pl-3" v-else>{{ data.subject_code }}</span>
                      </template>
                  </Column>
                  <Column header="No of Questions" class="hover:text-tertiary">
                    <template #body="{ data }">
                      <Skeleton v-if="loading" width="5rem" height="1rem" borderRadius="16px"/>
                      <span class="sm:pl-6" v-else>{{ data.question_count }}</span>
                    </template>
                  </Column>
                </DataTable>
            </div>
            
            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 my-4">
              <span class="pi pi-filter-slash text-3xl text-gray-400 mb-2"></span>
              <h3 class="text-base font-semibold text-gray-700">ERROR 404</h3>
              <p class="text-xs text-gray-500 mt-1">No Subjects Found.</p>
            </div>
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

import Select from 'primevue/select'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import Skeleton from 'primevue/skeleton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const router = useRouter()
const subjectStore = useSubjectStore()

const selectedDepartment = ref(subjectStore.filters.department || 'CSE')
const selectedSemester = ref(subjectStore.selectedSubject?.semester || 5)
const selectedRegulationCode = ref(subjectStore.filters.regulation_code || 'R22')
const loading = ref(false)
const allSubjects = ref([])
const filteredSubjects = ref([])
const checkInitialMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024
const isMobile = ref(checkInitialMobile())
const open = ref(!checkInitialMobile())
const headerRegulationCode = ref(selectedRegulationCode.value)
const headerDepartment = ref(selectedDepartment.value)
const headerSemester = ref(selectedSemester.value)
const baseUrl = import.meta.env.VITE_API_BASE_URL

let mql = null
let onMqlChange = null

const regulationCodes = ref([
  { label: 'R22A', value: 'R22A' },
  { label: 'R22', value: 'R22' },
  { label: 'R20', value: 'R20' },
  { label: 'R18', value: 'R18' },
])

async function loadAllSubjects() {
  loading.value = true
  try {
    const subjectsRes = await fetch(`${baseUrl}8000/api/subjects/${selectedDepartment.value}/${selectedSemester.value}/${selectedRegulationCode.value}`)
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
  headerDepartment.value = selectedDepartment.value
  headerRegulationCode.value = selectedRegulationCode.value
  headerSemester.value = selectedSemester.value
  await loadAllSubjects()
  if (isMobile.value) {
    open.value = false
  }
  scrollToTop()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mql = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mql.matches
  
  // Set initial state: closed on mobile, open on desktop
  open.value = !isMobile.value

  onMqlChange = (event) => {
    isMobile.value = event.matches
    // Automatically close when switching down to mobile size
    open.value = !event.matches
  }
  mql.addEventListener('change', onMqlChange)
  loadAllSubjects() 
})

onBeforeUnmount(() => {
  if (mql && onMqlChange) {
    mql.removeEventListener('change', onMqlChange)
  }
})

const departments = ref([
  { label: 'CSE', value: 'CSE' },
  { label: 'IT', value: 'IT' },
  { label: 'CSM', value: 'CSE-AI&ML' },
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

function onRowClick(event) {
  onSubjectSelect(event.data)
}

function onSubjectSelect(subject) {
  subjectStore.selectSubject(subject)
  subjectStore.filters.department = selectedDepartment.value
  subjectStore.filters.semester = selectedSemester.value
  subjectStore.filters.regulation_code = selectedRegulationCode.value
  router.push({ name: 'questions', params: { subjectId: subject.id } })
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
const getRowClass = () => {
  return 'hover:font-medium transition-all duration-100 ease-in-out'
}

</script>

<style scoped></style>