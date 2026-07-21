<template>
  <div class="w-full">
    <div class="relative flex min-h-screen w-full">
      <div
        v-if="isMobile && open"
        @click="open = false"
        class="fixed inset-0 bg-black/40 z-40 lg:hidden"
      ></div>
      <aside
        :class="[
          'bg-white border-gray-200 transition-all duration-300 z-40 flex flex-col justify-between',
        
          'fixed top-16.25 bottom-0 left-0 w-80 shadow-2xl h-[calc(100vh-65px)]',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:sticky lg:top-16.25 lg:bottom-auto lg:shadow-none lg:translate-x-0 lg:h-[calc(100vh-65px)]',
          open ? 'lg:w-80 lg:border-r' : 'lg:w-0 lg:border-r-0 lg:overflow-hidden'
        ]"
      >
        <div class="p-4 flex flex-col gap-4 w-80">
          <!-- Sidebar Header -->
          <div class="flex flex-col gap-2 mb-2">
            <h2 class="tracking-widest text-sm font-inter text-gray-500">FILTERS</h2>
            <div>
              <h3 class="tracking-wide font-inter text-xl font-bold text-gray-800">Refine your search</h3>
              <h3 class="tracking-wide text-xs font-inter text-gray-500">Find specific question easily</h3>
            </div>
          </div>

          <!-- Sidebar Content / Menu -->
          <div class="flex flex-col gap-5">
            <!-- Topic Filter -->
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-gray-700 tracking-wider">TOPIC</label>
              <TreeSelect
                v-model="selectedTopic"
                :options="treeTopics"
                placeholder="Select Topic"
                class="w-full"
                appendTo="self"
              />
            </div>

            <!-- Unit Filter -->
            <div class="flex flex-col gap-1">
              <label for="unit" class="text-xs font-bold text-gray-700 tracking-wider">UNIT</label>
              <div class="flex flex-wrap gap-2" id="unit">
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
                    <i class="pi pi-circle-fill text-xs"></i>
                  </span>
                  <span v-else><i class="pi pi-circle text-xs"></i></span>
                  <span class="text-xs ml-1">{{ unit.label }}</span>
                </Chip>
              </div>
            </div>

            <!-- Difficulty Filter -->
            <div class="flex flex-col gap-1">
              <label for="difficulty" class="text-xs font-bold text-gray-700 tracking-wider">DIFFICULTY</label>
              <div class="flex flex-col gap-3" id="difficulty">
                <div v-for="d of difficulties" :key="d.key" class="flex items-center gap-2">
                  <Checkbox
                    v-model="selectedDifficulties"
                    :inputId="d.key"
                    name="label"
                    :value="d"
                    :pt="{
                      icon: { class: 'bg-primary text-white border-primary' }
                    }"
                  />
                  <label :for="d.key" class="text-sm text-gray-700 cursor-pointer">{{ d.label }}</label>
                </div>
              </div>
            </div>

            <!-- Marks Filter -->
            <div class="flex flex-col gap-1">
              <label for="marks" class="text-xs font-bold text-gray-700 tracking-wider">MARKS</label>
              <div class="flex flex-wrap gap-2" id="marks">
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

            <!-- Apply Button -->
            <div class="pt-2">
              <Button class="w-full cursor-pointer bg-sky-800 border-sky-800 text-white" @click="applyFiltersOnQuestions()">
                APPLY FILTER
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 min-w-0 w-full">
        <header class="flex h-12 items-center gap-2 dark:border-surface-700 px-4 bg-white sticky top-0 z-30">
          <Button severity="secondary" text size="small" @click="open = !open" class="flex items-center gap-2">
            <h4 class="text-tertiary">FILTERS</h4>
            <span class="pi pi-bars text-tertiary"></span>
          </Button>
        </header>

        <div class="px-4 py-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start px-4">
            <div>
              <h1 class="font-inter font-bold text-2xl text-primary-dark tracking-wide">
                Questions
              </h1>
              <h3 class="text-tertiary">{{ total }} questions found.</h3>
            </div>
            <div class="flex flex-col sm:items-end gap-2">
              <h2 class="font-inter font-bold text-xl text-primary-dark tracking-wide me-3">{{ selectedSubject?.name }}</h2>
              <div class="flex gap-2 me-3 sm:flex-row sm:items-center">
                <Select v-model="sortBy" :options="sortableItems" optionLabel="label" placeholder="Sort By"></Select>
                <Select v-model="sortOrder" :options="sortableOrders" optionLabel="label" placeholder="Order By"></Select>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div v-if="questions?.length > 0">
              <div class="grid">
                <QuestionCard
                  class="p-4 w-auto"
                  v-for="(q, index) in questions"
                  :key="q.id || index"
                  :question_text="q.text"
                  :difficulty="q.difficulty"
                  :marks="q.marks"
                  :unit="q.unit"
                  :year="q.year"
                  :image_urls="q.image_urls"
                  :topic="q.topic"
                />
              </div>

              <Paginator
                v-model:first="first"
                v-model:rows="rows"
                :totalRecords="total"
                :rowsPerPageOptions="[10, 15, 20]"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                @page="onPageChange"
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'

// Valid PrimeVue Component Imports
import Checkbox from 'primevue/checkbox'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import TreeSelect from 'primevue/treeselect'
import Select from 'primevue/select'

import QuestionCard from './QuestionCard.vue'

const route = useRoute()
const subjectStore = useSubjectStore()

const first = ref(0)
const rows = ref(10)

let mql = null
let onMqlChange = null

const { selectedSubject } = storeToRefs(subjectStore)
const topics = ref([])
const treeTopics = ref([])
const selectedTopic = ref(null)
const subjectId = computed(() => Number(route.params.subjectId))
const questions = ref([])
const page = ref(1)
const filters = ref({ units: [], difficulty: [], marks: [] })
const selectedUnitsIndices = ref([])
const selectedMarksIndices = ref([])
const selectedDifficulties = ref([])
const total = ref(0)
const sortBy = ref()
const sortOrder = ref()
const checkInitialMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024
const isMobile = ref(checkInitialMobile())
const open = ref(!checkInitialMobile())

const sortableItems = ref([
  { label: 'Marks', value: 'marks' },
  { label: 'Units', value: 'unit' },
  { label: 'Difficulty', value: 'difficulty' }
])
const sortableOrders = ref([
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
])

async function loadTopics() {
  const numericSubjectId = subjectId.value
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/topics/${numericSubjectId}`)
    if (response.status === 404) {
      topics.value = []
    } else if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    } else {
      topics.value = await response.json()
      treeTopics.value = convertToTree(topics.value)
    }
  } catch (error) {
    console.log('Failed to load topics:', error)
    topics.value = []
  }
}

function applyFiltersOnQuestions() {
  page.value = 1
  first.value = 0
  let topicName = null
  if (selectedTopic.value !== null && selectedTopic.value !== undefined) {
    const keys = Object.keys(selectedTopic.value)
    if (keys.length > 0) {
      const topicId = keys[0]
      const foundTopic = topics.value.find(t => t.id.toString() === topicId)
      topicName = foundTopic ? foundTopic.topic : null
    }
  }
  filters.value = {
    units: selectedUnitsIndices.value.map(i => units.value[i].value),
    marks: selectedMarksIndices.value.map(i => marks.value[i].value),
    difficulty: (selectedDifficulties.value || []).map(d => d.value),
    topic: topicName
  }
  fetchQuestions()
}

async function fetchQuestions() {
  const numericSubjectId = subjectId.value
  const baseUrl = "http://192.168.0.168:"
  const params = new URLSearchParams({ page: page.value, page_size: rows.value })
  filters.value.units.forEach(u => params.append('units', u))
  filters.value.difficulty.forEach(d => params.append('difficulty', d))
  filters.value.marks.forEach(m => params.append('marks', m))
  if (sortBy.value) {
    params.append('sort_by', sortBy.value ? sortBy.value.value : null)
    params.append('sort_order', sortOrder.value ? sortOrder.value.value : 'asc')
  }
  if (filters.value.topic) params.append('topic', filters.value.topic)
  
  try {
    const res = await fetch(`${baseUrl}8000/api/subjects/${numericSubjectId}/questions?${params}`)
    const data = await res.json()
    questions.value = data.questions
    total.value = data.total
  } catch (e) {
    console.error('Failed to fetch questions:', e)
  }
}

watch([filters, sortBy, sortOrder], () => {
  page.value = 1
  first.value = 0
  scrollToTop()
  fetchQuestions()
}, { deep: true })

function onPageChange(event) {
  page.value = event.page + 1
  rows.value = event.rows
  fetchQuestions()
  scrollToTop()
}

function onSelectMarksChips(index) {
  if (!selectedMarksIndices.value) return
  if (selectedMarksIndices.value.includes(index)) {
    selectedMarksIndices.value = selectedMarksIndices.value.filter(i => i !== index)
  } else {
    selectedMarksIndices.value.push(index)
  }
}

function onSelectUnitChips(index) {
  if (!selectedUnitsIndices.value) return
  if (selectedUnitsIndices.value.includes(index)) {
    selectedUnitsIndices.value = selectedUnitsIndices.value.filter(i => i !== index)
  } else {
    selectedUnitsIndices.value.push(index)
  }
}

onMounted(async () => {
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
  if (!subjectStore.selectedSubject || subjectStore.selectedSubject.id !== subjectId.value) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/subjects/${subjectId.value}`)
      if (res.ok) {
        const data = await res.json()
        subjectStore.selectSubject(data)
      }
    } catch (e) {
      console.error('Failed to fetch subject details', e)
    }
  }
  loadTopics()
  fetchQuestions()
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

const units = ref([
  { label: 'Unit 1', value: 1 },
  { label: 'Unit 2', value: 2 },
  { label: 'Unit 3', value: 3 },
  { label: 'Unit 4', value: 4 },
  { label: 'Unit 5', value: 5 }
])

const difficulties = ref([
  { label: 'Easy', key: 'easy', value: 'Easy' },
  { label: 'Medium', key: 'medium', value: 'Medium' },
  { label: 'Hard', key: 'hard', value: 'Hard' }
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
  { label: '10', value: 10 }
])

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const convertToTree = (topicsList) => {
  const unitsMap = new Map()

  topicsList.forEach((topic) => {
    const unitKey = `unit-${topic.unit}`

    if (!unitsMap.has(unitKey)) {
      unitsMap.set(unitKey, {
        key: unitKey,
        label: `Unit ${topic.unit}`,
        selectable: false,
        children: []
      })
    }

    unitsMap.get(unitKey).children.push({
      key: topic.id.toString(),
      label: topic.topic,
      data: topic
    })
  })

  return [...unitsMap.values()]
}
</script>

<style scoped>
:deep(.p-cascadeselect-overlay),
:deep(.p-cascadeselect-sublist) {
  max-height: 260px;
  overflow-y: auto;
}
</style>