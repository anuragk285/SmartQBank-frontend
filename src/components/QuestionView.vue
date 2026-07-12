<template>
  <div>
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
        <SidebarAside class="p-1 border-e-2-3 border-gray-300">
          <SidebarPanel class="p-3">
            <SidebarHeader>
              <div class="flex flex-col gap-2 mb-4">
                <h2 class="tracking-widest text-sm font-inter">FILTERS</h2>
                <div>
                  <h3 class="tracking-wide font-inter text-xl font-bold">Refine your search</h3>
                  <h3 class="tracking-wide text-xs font-inter">Find specific question easily</h3>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu class="flex flex-col justify-start gap-4">
                <SidebarMenuItem>
                  <div class="flex flex-col justify-start gap-1">
                    <Label for="year" class="text-xs">YEAR</Label>
                    <Select
                      id="year"
                      v-model="selectedYears"
                      :options="years"
                      optionLabel="label"
                      optionValue="value"
                      multiple
                      display="chip"
                      placeholder="Select year. Ex: 2025"
                      class="w-full border border-gray-400 bg-white"
                      :appendTo="'self'"
                    >
                      <template #header>
                        <div
                          class="p-2 text-center text-xs font-semibold text-blue-600 bg-gray-50 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
                          @click="selectAllYears()"
                        >
                          <span class="text-primary-dark"> Select All Years</span>
                        </div>
                      </template>
                      <template #option="slotProps">
                        <div class="flex items-center justify-between w-full">
                          <span>{{ slotProps.option.label }}</span>
                          <Check
                            v-if="selectedYears && selectedYears.includes(slotProps.option.value)"
                          ></Check>
                        </div>
                      </template>
                      <template #footer>
                        <div
                          class="p-2 text-center text-xs font-semibold text-blue-600 bg-gray-50 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
                          @click="resetSelectedYears()"
                        >
                          <span class="text-primary"> Reset Year Filters</span>
                        </div>
                      </template>
                    </Select>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div class="flex flex-col justify-start gap-1">
                    <Label for="unit">UNIT</Label>
                    <div class="flex flex-col gap-2" id="unit">
                      <!-- <Listbox v-model="selectedUnits" :options="units" multiple checkbox optionLabel="name" class="w-full md:w-56" :showToggleAll="false"></Listbox> -->
                      <!-- <div v-for="unit in units" :key="unit.id" class="flex items-center gap-2">
                        <Checkbox
                          v-model="selectedUnits"
                          :inputId="unit.id"
                          name="name"
                          :value="unit.value"
                        />
                        <Label :for="unit.key">{{ unit.name }}</Label>
                      </div> -->
                      <div class="flex flex-wrap gap-2">
                        <!-- <Chip
                          v-for="(unit, i) in units"
                          :key="unit.id"
                          :class="
                            selectedUnitsIndices && selectedUnitsIndices.includes(i)
                              ? 'cursor-pointer text-white bg-primary'
                              : 'cursor-pointer p-chip-outlined'
                          "
                          @click="onSelectUnitChips(i)"
                        >
                          <span>{{ unit.label }}</span>
                        </Chip> -->
                        <Chip
                          v-for="(unit, i) in units"
                          :key="unit.label"
                          :class="
                            selectedUnitsIndices && selectedUnitsIndices.includes(i)
                              ? 'cursor-pointer'
                              : 'cursor-pointer p-chip-outlined'
                          "
                          @click="onSelectUnitChips(i)"
                        >
                          <span
                            v-if="selectedUnitsIndices.includes(i)"
                            class="size-4.5 inline-flex items-center justify-center rounded-full text-primary"
                          >
                            <CircleFill></CircleFill>
                          </span>
                          <span v-else><Circle></Circle></span>
                          <span class="text-xs">{{ unit.label }}</span>
                        </Chip>
                      </div>
                    </div>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div class="flex flex-col justify-start gap-1">
                    <Label for="diificulty">DIFFICULTY</Label>
                    <div class="flex flex-col gap-3" id="difficulty">
                      <div v-for="d of difficulties" :key="d.key" class="flex items-center gap-2">
                        <Checkbox
                          v-model="selectedDifficulties"
                          :inputId="d.key"
                          name="label"
                          :value="d"
                          :pt="{
                            icon: {class: 'bg-primary text-white border-primary'}
                          }"
                        />
                        <Label :for="d.key" class="text-sm">{{ d.label }}</Label>
                      </div>
                    </div>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <div class="flex flex-col justify-start gap-1">
                    <Label for="marks">MARKS</Label>
                    <div class="flex flex-wrap gap-2">
                      <Chip
                        v-for="(mark, i) in marks"
                        :key="mark.label"
                        :class="
                          selectedMarksIndices && selectedMarksIndices.includes(i)
                            ? 'cursor-pointer text-white bg-primary'
                            : 'cursor-pointer p-chip-outlined'
                        "
                        @click="onSelectMarksChips(i)"
                      >
                        <span class="text-xs">{{ mark.label }}</span>
                      </Chip>
                    </div>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Button class="cursor-pointer bg-sky-800" @click="applyFiltersOnQuestions()">APPLY FILTER</Button>
                </SidebarMenuItem>
              </SidebarMenu>
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
        <main class="px-4">
          <div class="flex justify-between px-4">
            <div>
              <h1 class="font-inter font-bold text-2xl text-primary-dark tracking-wide">
                Questions
              </h1>
              <h3 class="text-tertiary">{{ filteredQuestions.length }} questions found.</h3>
            </div>
            <div>
              <h2 class="font-inter font-bold text-xl text-primary-dark tracking-wide pe-3">{{ selectedSubject?.name }}</h2>
            </div>
          </div>
          <div>
            <div v-if="filteredQuestions.length > 0">
              <div class="grid">
                <QuestionCard
                  class="p-4"
                  v-for="q in paginatedQuestions"
                  :key="q"
                  :question_text="q.text"
                  :difficulty="getDifficulty(q.difficulty_level)"
                  :marks="q.marks"
                  :unit="q.unit"
                  :year="q.year"
                  :image_urls="q.image_urls"
                />
              </div>

              <Paginator
                v-model:first="first"
                v-model:rows="rows"
                :totalRecords="filteredQuestions.length"
                :rowsPerPageOptions="[5, 10, 15]"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                @page="scrollToTop"
              />
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 my-4"
            >
              <span class="pi pi-filter-slash text-3xl text-gray-400 mb-2"></span>
              <h3 class="text-base font-semibold text-gray-700">No questions match your filters</h3>
              <p class="text-xs text-gray-500 mt-1">
                Try adjusting your choices or checking different combinations.
              </p>
            </div>
          </div>
        </main>
      </SidebarMain>
    </SidebarLayout>
  </div>
</template>

<script setup>
import {
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from 'primevue'
import SidebarIcon from '@primeicons/vue/sidebar'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Label from 'primevue/label'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import QuestionCard from './QuestionCard.vue'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'
import QuestionCircle from '@primeicons/vue/question-circle'
import Cog from '@primeicons/vue/cog'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '@/stores/subject'
import Chip from 'primevue/chip'
import Circle from '@primeicons/vue/circle'
import Check from '@primeicons/vue/check'
import CircleFill from '@primeicons/vue/circle-fill';
import { storeToRefs } from 'pinia'
const route = useRoute()
const subjectStore = useSubjectStore()
const first = ref(0)
const rows = ref(5)
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
const { selectedSubject } = storeToRefs(subjectStore)
const allQuestions = ref([])
const filteredQuestions = ref([])
const loading = ref(true)

const getDifficulty = (difficulty_level) => {
  if (difficulty_level <= 2) return 'Easy'
  else if (difficulty_level <= 4) return 'Medium'
  else return 'Hard'
}

function resetSelectedYears() {
  selectedYears.value = []
}
function selectAllYears() {
  selectedYears.value = years.value.map((year) => year.value)
}
async function loadSubjectAndQuestions(subjectId) {
  loading.value = true
  // If store doesn't have this subject (e.g. page was refreshed), fetch it
  if (!subjectStore.selectedSubject || subjectStore.selectedSubject.id !== subjectId) {
    const subjectRes = await fetch(`http://127.0.0.1:8000/api/subjects/${subjectId}`)
    subjectStore.selectSubject(await subjectRes.json())
  }
  const questionsRes = await fetch(`http://127.0.0.1:8000/api/subjects/${subjectId}/questions`)
  allQuestions.value = await questionsRes.json()
  filteredQuestions.value = allQuestions.value
  loading.value = false
}

function applyFiltersOnQuestions() {
  loading.value = false
  first.value = 0
  if (!allQuestions.value) return
  const targetYears = selectedYears.value.map((y) => y)
  const targetDiff = selectedDifficulties.value.map((d) => d.value)
  filteredQuestions.value = allQuestions.value.filter((question) => {
    const matchesYear = targetYears.length === 0 || targetYears.includes(Number(question?.year))
    const matchesMarks =
      selectedMarksIndices.value.length === 0 ||
      selectedMarksIndices.value.includes(Number(question?.marks) - 2)
    const matchesUnits =
      selectedUnitsIndices.value.length === 0 ||
      selectedUnitsIndices.value.includes(Number(question?.unit) - 1)
    const matchesDiff =
      targetDiff.length === 0 || targetDiff.includes(getDifficulty(question?.difficulty_level))
    return matchesDiff && matchesMarks && matchesUnits && matchesYear
  })
  loading.value = false
  scrollToTop()
  if (isMobile.value) {
    open.value = false
  }
}
const selectedUnitsIndices = ref([])
const selectedMarksIndices = ref([])
function onSelectMarksChips(index) {
  if (!selectedMarksIndices.value) {
    console.error('The ref array passed to onSelect is undefined!', selectedMarksIndices)
    return
  }
  if (selectedMarksIndices.value.includes(index)) {
    selectedMarksIndices.value = selectedMarksIndices.value.filter((i) => i !== index)
  } else {
    selectedMarksIndices.value.push(index)
  }
}
function onSelectUnitChips(index) {
  if (!selectedUnitsIndices.value) {
    console.error('The ref array passed to onSelect is undefined!', selectedUnitsIndices)
    return
  }
  if (selectedUnitsIndices.value.includes(index)) {
    selectedUnitsIndices.value = selectedUnitsIndices.value.filter((i) => i !== index)
  } else {
    selectedUnitsIndices.value.push(index)
  }
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
  loadSubjectAndQuestions(route.params.subjectId)
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
watch(
  () => route.params.subjectId,
  (newId) => {
    loadSubjectAndQuestions(newId)
  },
)
const units = ref([
  { label: 'Unit 1', value: 1 },
  { label: 'Unit 2', value: 2 },
  { label: 'Unit 3', value: 3 },
  { label: 'Unit 4', value: 4 },
  { label: 'Unit 5', value: 5 },
])
const selectedDifficulties = ref([])
const difficulties = ref([
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
])
const selectedYears = ref([])
const years = ref([
  { label: 2021, value: 2021 },
  { label: 2022, value: 2022 },
  { label: 2023, value: 2023 },
  { label: 2024, value: 2024 },
  { label: 2025, value: 2025 },
])
const marks = ref([
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
])
const paginatedQuestions = computed(() => {
  const start = first.value
  const end = first.value + rows.value
  return filteredQuestions.value.slice(start, end)
})
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Change to 'auto' if you want it to snap instantly without animation
  });
}
</script>

<style scoped></style>
