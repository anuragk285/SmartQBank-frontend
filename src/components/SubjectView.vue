<template>
  <div class="flex flex-col gap-2">
    <SidebarLayout class="relative! flex min-h-screen w-full">
      <SidebarBackdrop v-if="(backdrop || isMobile) && open" class="absolute!" />
      <Sidebar
        class="sticky top-0 h-screen"
        id="variants-demo"
        :variant="variant"
        :collapsible="isMobile ? 'offcanvas' : collapsible"
        :side="side"
        :overlay="isMobile || overlay"
        :openOnHover="openOnHover"
        v-model:open="open"
      >
        <SidebarSpacer></SidebarSpacer>
        <SidebarAside class="p-1">
          <SidebarPanel class="p-3">
            <SidebarHeader>
              <div class="flex flex-col gap-2 mb-4">
                <h2 class="tracking-widest text-sm font-inter">FILTERS</h2>
                <div>
                  <h3 class="tracking-wide font-inter text-xl font-bold">Refine your search</h3>
                  <h3 class="tracking-wide text-xs font-inter">Select a subject</h3>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <div>
                <div class="my-5 flex flex-col gap-2">
                  <Label for="department">DEPARTMENT</Label>
                  <!-- <h2 class="text-gray-600 text-xs tracking-widest">DEPARTMENT</h2> -->
                  <Select
                    id="department"
                    :options="departments"
                    v-model="selectedDepartment"
                    option-label="label"
                    option-value="value"
                    placeholder="Select your Department"
                    class="border border-gray-300 text-gray-600"
                  />
                </div>
                <div class="my-5 flex flex-col gap-2">
                  <Label for="semester">SEMESTER</Label>
                  <Select
                    id="semester"
                    :options="semesters"
                    v-model="selectedSemester"
                    option-label="label"
                    option-value="value"
                    placeholder="Select your Semester"
                    class="border border-gray-300 text-grey-600"
                  />
                </div>
              </div>
            </SidebarContent>
            <SidebarFooter class="flex flex-col gap-3">
              <div
                v-for="group in sidebarFooterItems"
                :key="group.label"
                class="w-full flex flex-col gap-4"
              >
                <hr class="mb-3" />
                <SidebarMenuItem v-for="item in group.items" :key="item.label">
                  <SidebarMenuButton class="p-1! flex items-center gap-2 w-full">
                    <component :is="item.icon" class="w-4 h-4 me-2 scale-150 text-black" />
                    <span class="text-sm font-medium">{{ item.label }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarFooter>
          </SidebarPanel>
        </SidebarAside>
      </Sidebar>
      <SidebarMain v-if="side === 'left'" class="flex-1">
        <header
          class="flex h-12 items-center gap-2 border-surface-200 dark:border-surface-700 px-4"
        >
          <SidebarTrigger severity="secondary" target="variants-demo" :text="true" size="small">
            <h4>FILTERS</h4>
            <SidebarIcon />
          </SidebarTrigger>
        </header>
        <main class="px-6 py-2 flex flex-col gap-5">
          <div class="flex flex-col gap-1">
            <h1 class="text-primary text-3xl font-bold">Subjects</h1>
            <h2 class="text-gray-500">Select a subject to view questions</h2>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 w-full"
          >
            <div v-for="subject in filteredSubjects" :key="subject.id">
              <SubjectCard
                :subject_code="subject.subject_code"
                :subject_name="subject.name"
                :no_of_questions="subject.no_of_questions"
                :key="subject.id"
                class="cursor-pointer"
                @click="onSubjectSelect(subject)"
              />
            </div>
          </div>
        </main>
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

<script setup>
import {
  Select,
  Sidebar,
  SidebarAside,
  SidebarContent,
  SidebarHeader,
  SidebarLayout,
  SidebarMain,
  SidebarTrigger,
  SidebarPanel,
  SidebarBackdrop,
  SidebarFooter,
  SidebarSpacer,
  SidebarMenuItem,
  SidebarMenuButton,
} from 'primevue'
import Label from 'primevue/label'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SidebarIcon from '@primeicons/vue/sidebar'
import QuestionCircle from '@primeicons/vue/question-circle'
import Cog from '@primeicons/vue/cog'
import SubjectCard from './SubjectCard.vue'
import { useRouter } from 'vue-router'
import { useSubjectStore } from '@/stores/subject.js'

const router = useRouter()
const subjectStore = useSubjectStore()
const selectedDepartment = ref(null)
const selectedSemester = ref(null)
const isMobile = ref(false)
const open = ref(true)
const variant = ref('sidebar')
const collapsible = ref('offcanvas')
const side = ref('left')
const overlay = ref(false)
const openOnHover = ref(false)
const backdrop = ref(false)
let mql = null
let onMqlChange = null
const loading = ref(false)
const allSubjects = ref([])
const filteredSubjects = ref([])

async function loadAllSubjects() {
  loading.value = true
  try {
    const subjectsRes = await fetch('http://127.0.0.1:8000/api/subjects/')
    if (!subjectsRes.ok) throw new Error('API Connection failed')
    allSubjects.value = await subjectsRes.json()
  } catch (error) {
    console.error('Failed loading subject cards array:', error)
  } finally {
    loading.value = false
    filteredSubjects.value = allSubjects.value
  }
}
function applyFilterOnSubjects() {
  loading.value = true
  filteredSubjects.value = ref([])
  allSubjects.array.forEach((subject) => {
    if (subject.department == selectedDepartment) filteredSubjects.current.push(subject)
  })
  loading.value = false
}
const sidebarFooterItems = [
  {
    label: 'menu',
    items: [
      { label: 'Help', icon: QuestionCircle },
      { label: 'Settings', icon: Cog },
    ],
  },
]
onMounted(() => {
  if (typeof window === 'undefined') return
  loadAllSubjects()
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
const departments = ref([
  { label: 'Computer Science and Engineering', value: 'cse' },
  { label: 'Information Technology', value: 'it' },
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
function onSubjectSelect(subject) {
  subjectStore.selectSubject(subject) // cache full object: {id, name, subject_code}
  router.push({ name: 'questions', params: { subjectId: subject.id } })
}
</script>

<style scoped></style>
