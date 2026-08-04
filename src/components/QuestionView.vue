<template>
  <div class="w-full">
    <div class="relative flex min-h-screen w-full">
      <div
        v-if="isMobile && open"
        @click="open = false"
        class="fixed inset-0 bg-black/40 z-50 lg:hidden"
      ></div>
      <aside
        :class="[
          'bg-white border-gray-200 transition-all duration-300 z-50 flex flex-col justify-between overflow-hidden',

          'fixed top-0 bottom-0 left-0 w-80 shadow-2xl h-screen',
          open ? 'translate-x-0' : '-translate-x-full',

          'lg:sticky lg:top-0 lg:bottom-auto lg:shadow-none lg:translate-x-0 lg:h-screen',
          open ? 'lg:w-80 lg:border-r' : 'lg:w-0 lg:border-r-0'
        ]"
      >
        <div class="p-4 flex flex-col gap-4 w-80 translate-x h-full overflow-y-auto overscroll-contain">
          <div class="flex flex-col gap-2 mb-2">
            <h2 class="tracking-widest text-sm font-inter text-gray-500">FILTERS</h2>
          </div>

          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold text-gray-700 tracking-wider">TOPIC</label>
              <MultiSelect
                v-model="selectedTopics"
                :options="treeTopics"
                ref="multiSelectRef"
                optionLabel="label"
                optionValue="key"
                optionGroupChildren="children"
                optionGroupLabel="label"
                filter
                filterBy="label"
                :filterValue="filterQuery"
                @filter="(e) => filterQuery = e.value"
                showClear
                placeholder="Select Topic"
                appendTo="self"
                :pt="{
                  list: { class: 'p-0!' },
                  optionGroup: { class: 'border-b border-surface rounded-none' },
                  overlay: { class: 'max-w-full w-full' },
                  option: { class: 'whitespace-normal h-auto py-2' }
                }"
              >
                <template #filtericon>
                  <i 
                    v-if="filterQuery && filterQuery.length > 0" 
                    class="pi pi-times cursor-pointer text-surface-500 hover:text-surface-700 dark:text-surface-400" 
                    @click.stop="clearFilter"
                  />
                  <i v-else class="pi pi-search text-surface-400" />
                </template>

                <template #option="slotProps">
                  <div class="min-w-0 w-full py-0.5">
                    <!-- <span 
                      v-if="slotProps.option.unit" 
                      class="text-xs text-muted-color bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full shrink-0 mt-0.5"
                    >
                      U{{ slotProps.option.unit }}
                    </span> -->
                    <span class="text-xs whitespace-normal wrap-break min-w-0 flex-1 leading-snug">
                      <i>{{ slotProps.option.label }}</i>
                    </span>
                  </div>
                </template>
              </MultiSelect>
            </div>

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
                  <span class="text-xs">{{ unit.label }}</span>
                </Chip>
              </div>
            </div>

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
            <div class="pt-2">
              <Button 
                class="w-full cursor-pointer bg-sky-800 border-sky-800 text-white select-none touch-manipulation mobile-tap-clean" 
                @click="applyFiltersOnQuestions()"
              >
                APPLY FILTER
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-w-0 w-full mt-5">
        <div class="px-2">
          <header class="dark:border-surface-700 bg-white z-30 mx-auto transition-all duration-300 ease-in-out"
          :class="isMobile ? 'w-full' : (open ? 'w-full max-w-[85ch]' : 'w-full max-w-[95ch]')">
          
          <div class="flex flex-col gap-2 ml-3 mt-3">
            <h1 class="font-inter font-bold text-2xl text-primary-dark tracking-wide ">
              {{ selectedSubject?.name }}
            </h1>
            <div class="flex gap-2 flex-wrap">
              <h3 class=" text-gray-500">#{{ selectedSubject?.subject_code }}</h3>
              <span>⋅</span>
              <h3 class="text-tertiary">{{ total }} questions.</h3>
            </div>
          </div>
        </header>
      </div>
      <div class="px-2">
        <div class="mx-auto px-4 transition-all duration-300 ease-in-out" :class="isMobile ? 'w-full' : (open ? 'w-full max-w-[85ch]' : 'w-full max-w-[95ch]')">
          <Divider/>
        </div>
      </div>
        <div class="px-4">
          <div 
            class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start px-2 sm:mx-auto transition-all duration-300 ease-in-out"
            :class="isMobile ? 'w-full' : (open ? 'w-full max-w-[85ch]' : 'w-full max-w-[95ch]')"
          >
             <div class="flex flex-wrap gap-5">
                <Button severity="secondary" size="small" @click="open = !open" class="flex items-center gap-2 border-gray-300 bg-gray-50 mt-4 hover:bg-gray-100">
                 <h4 class=" text-sky-700 text-sm">FILTERS</h4>
                 <span class="pi pi-filter text-sky-700 text-sm"></span>
                </Button>
                <Button @click="removeFiltersAndFetchQuestions()" unstyled class="self-end pb-1 mt-4 ms-1 underline cursor-pointer text-surface-500 hover:text-tertiary border-none px-2 rounded-2xl"><i>clear filters</i></Button>
              </div>

            <div class="sm:self-end">
              <div class="flex flex-wrap gap-4 sm:flex-row sm:items-center">
                <FloatLabel variant="on" class="w-32">
                  <Select 
                    inputId="sortby" 
                    v-model="sortBy" 
                    size="small" 
                    :options="sortableItems" 
                    optionLabel="label" 
                    :disabled="total === 0" 
                    :class="{ 'bg-gray-100': total === 0 }" 
                    class="w-full"
                  />
                  <label for="sortby" class="whitespace-nowrap">sort by</label>
                </FloatLabel>

                <FloatLabel variant="on" class="w-36">
                  <Select 
                    inputId="orderby" 
                    v-model="sortOrder" 
                    size="small" 
                    :options="sortableOrders" 
                    optionLabel="label" 
                    :disabled="total === 0" 
                    :class="{ 'bg-gray-100': total === 0 }" 
                    class="w-full"
                  />
                  <label for="orderby" class="whitespace-nowrap">order by</label>
                </FloatLabel>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div v-if="loading" class="flex flex-col gap-4">
              <div
                v-for="n in 10"
                :key="n"
                class="mx-auto my-2 px-4 py-6 min-h-32 border border-gray-300 rounded-xl flex flex-col gap-3 justify-between"
                :class="isMobile ? 'w-full' : open ? 'w-[85ch]' : 'w-[95ch]'"
              >
                <div class="flex flex-wrap justify-between items-center gap-3">
                  <div class="flex gap-2 items-center">
                    <Skeleton width="4rem" height="1rem" class="bg-gray-200" />
                    <span class="text-gray-300">⋅</span>
                    <Skeleton width="4rem" height="1rem" class="bg-gray-200" />
                    <span class="text-gray-300">⋅</span>
                    <Skeleton width="10rem" height="1rem" class="bg-gray-200" />
                  </div>
                  <div class="flex gap-3">
                    <Skeleton width="3rem" height="1.25rem" class="rounded-md bg-gray-200" />
                    <Skeleton width="3rem" height="1.25rem" class="rounded-md bg-gray-200" />
                  </div>
                </div>
                <div class="flex flex-col gap-2 mx-2 mb-1">
                  <Skeleton width="100%" height="1.25rem" class="bg-gray-200" />
                  <Skeleton width="4rem" height="1rem" class="bg-gray-200" />
                </div>
              </div>
            </div>
            <div v-else-if="questions?.length > 0">
              <div class="flex flex-col">
                <QuestionCard
                  class="sm:p-2 py-2 mx-auto"
                  v-for="q in questions"
                  :key="q.id"
                  :question_id="q.id"
                  :question_text="q.text"
                  :difficulty="q.difficulty"
                  :marks="q.marks"
                  :unit="q.unit"
                  :year="q.year"
                  :image_urls="q.image_urls"
                  :topic="q.topic"
                  :topic_id="q.topic_id"
                  :isMobile="isMobile"
                  :open="open"
                  @selectedTopic="showSelectedTopicQuestions($event)"
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
              class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 my-4 transition-all duration-300 ease-in-out mx-auto"
              :class="isMobile ? 'w-full' : open ? 'w-[85ch]' : 'w-[95ch]'"
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
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'

// Valid PrimeVue Component Imports
import Checkbox from 'primevue/checkbox'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import MultiSelect  from 'primevue/multiselect'

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
const selectedTopics = ref([])
const subjectId = computed(() => Number(route.params.subjectId))
const questions = ref([])
const page = ref(1)
const filters = ref({ units: [], difficulty: [], marks: [],  })
const selectedUnitsIndices = ref([])
const selectedMarksIndices = ref([])
const selectedDifficulties = ref([])
const total = ref(0)
const sortBy = ref()
const sortOrder = ref()
const checkInitialMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024
const isMobile = ref(checkInitialMobile())
const open = ref(!checkInitialMobile())
const baseUrl = import.meta.env.VITE_API_BASE_URL
const loading = ref(false)
const filterQuery = ref('')
const multiSelectRef = ref(null);
const resettingFilters = ref(false)

function clearFilter() {
  filterQuery.value = ''
}
const sortableItems = ref([
  { label: 'Marks', value: 'marks' },
  { label: 'Units', value: 'unit' },
  { label: 'Difficulty', value: 'difficulty' }
])
const sortableOrders = ref([
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
])
async function showSelectedTopicQuestions(topicId) {  
  await removeFilters()
  filters.value.topic = [Number(topicId)]
  fetchQuestions()
}
async function removeFilters() {
  resettingFilters.value = true
  filters.value.difficulty = []
  filters.value.marks = []
  filters.value.units = []
  filters.value.topic = null
  selectedDifficulties.value = []
  selectedMarksIndices.value = []
  selectedUnitsIndices.value = []
  selectedTopics.value = []
  sortBy.value = null
  sortOrder.value = null
  await nextTick()
  resettingFilters.value = false
}
async function removeFiltersAndFetchQuestions(){
  await removeFilters()
  fetchQuestions()
} 

async function loadTopics() {
  loading.value = true
  const numericSubjectId = subjectId.value
  try {
    const response = await fetch(`${baseUrl}/api/topics/${numericSubjectId}`)
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
  loading.value = false
}

function applyFiltersOnQuestions() {
  page.value = 1
  first.value = 0
  let topicIds = null
  if (Array.isArray(selectedTopics.value) && selectedTopics.value.length > 0) {
    topicIds = selectedTopics.value
      .map(item => (typeof item === 'object' ? Number(item.value ?? item.id) : Number(item)))
      .filter(id => !isNaN(id))
  }
  filters.value = {
    units: selectedUnitsIndices.value.map(i => units.value[i].value),
    marks: selectedMarksIndices.value.map(i => marks.value[i].value),
    difficulty: (selectedDifficulties.value || []).map(d => d.value),
    topic: topicIds
  }
  fetchQuestions()
  if (isMobile.value) {
    open.value = false
  }
}

async function fetchQuestions() {
  loading.value = true
  const numericSubjectId = subjectId.value
  const params = new URLSearchParams({ page: page.value, page_size: rows.value })
  filters.value.units.forEach(u => params.append('units', u))
  filters.value.difficulty.forEach(d => params.append('difficulty', d))
  filters.value.marks.forEach(m => params.append('marks', m))
  if (sortBy.value) {
    params.append('sort_by', sortBy.value ? sortBy.value.value : null)
    params.append('sort_order', sortOrder.value ? sortOrder.value.value : 'asc')
  }
  if (Array.isArray(filters.value.topic)) {
    filters.value.topic.forEach(id => params.append('topic_ids', id))
  }
  try {
    const res = await fetch(`${baseUrl}/api/subjects/${numericSubjectId}/questions?${params}`)
    const data = await res.json()
    questions.value = data.questions
    total.value = data.total
  } catch (e) {
    console.error('Failed to fetch questions:', e)
  }
  loading.value = false
}

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
  open.value = !isMobile.value

  onMqlChange = (event) => {
    isMobile.value = event.matches
    open.value = !event.matches
  }
  mql.addEventListener('change', onMqlChange)
  loading.value = true
  if (!subjectStore.selectedSubject || subjectStore.selectedSubject.id !== subjectId.value) {
    try {
      const res = await fetch(`${baseUrl}/api/subjects/${subjectId.value}`)
      if (res.ok) {
        const data = await res.json()
        subjectStore.selectSubject(data)
      }
    } catch (e) {
      console.error('Failed to fetch subject details', e)
    }
  }
  loading.value = false
  loadTopics()
  fetchQuestions()
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
      key: topic.id,
      label: topic.topic,
      value: topic,
      unit: topic.unit
    })
  })

  return [...unitsMap.values()]
}
watch([sortBy, sortOrder], () => {
    first.value = 0
    page.value = 1
    if (resettingFilters.value) return
    fetchQuestions()
})
</script>

<style scoped>
:deep(.p-cascadeselect-overlay),
:deep(.p-cascadeselect-sublist) {
  max-height: 260px;
  overflow-y: auto;
}
:deep(.p-tree-toggler),
:deep(.p-tree-node-toggle-button) {
  color: var(--color-primary) !important;
}
:deep(.p-tree-toggler),
:deep(.p-tree-node-toggle-button) {
  width: 1.75rem !important;
  height: 1.75rem !important;
  border-radius: 9999px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: background-color 0.2s ease, color 0.2s ease !important;
}

:deep(.p-treenode-content:hover .p-tree-toggler),
:deep(.p-tree-node-content:hover .p-tree-node-toggle-button) {
  background-color: #f3f4f6 !important; 
  color: #374151 !important;           
}
.mobile-tap-clean {
  -webkit-tap-highlight-color: transparent;
}
.p-button .p-ink {
  background: rgba(255, 255, 255, 0.35) !important;
}
</style>