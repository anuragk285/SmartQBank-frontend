<template>
  <div class="flex min-h-screen w-full">

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
            <h3 class="tracking-wide text-xs font-inter text-gray-500">Find specific question easily</h3>
          </div>
        </div>
      </template>

      <!-- CONTENT SLOT (Replaces SidebarContent, SidebarMenu, etc.) -->
      <div class="flex flex-col justify-start gap-6 mt-4">
        
        <!-- TOPIC FILTER -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-gray-700">TOPIC</label>
          <TreeSelect
            v-model="selectedTopic"
            :options="treeTopics"
            placeholder="Select Topic"
            class="w-full"
            appendTo="self"
          />
        </div>

        <!-- UNIT FILTER -->
        <div class="flex flex-col justify-start gap-2">
          <label class="font-semibold text-sm text-gray-700" for="unit">UNIT</label>
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
                <i class="pi pi-circle-fill"></i>
              </span>
              <span v-else><i class="pi pi-circle"></i></span>
              <span class="text-xs ml-1">{{ unit.label }}</span>
            </Chip>
          </div>
        </div>

        <!-- DIFFICULTY FILTER -->
        <div class="flex flex-col justify-start gap-2">
          <label class="font-semibold text-sm text-gray-700" for="difficulty">DIFFICULTY</label>
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
              <label :for="d.key" class="text-sm cursor-pointer">{{ d.label }}</label>
            </div>
          </div>
        </div>

        <!-- MARKS FILTER -->
        <div class="flex flex-col justify-start gap-2">
          <label class="font-semibold text-sm text-gray-700" for="marks">MARKS</label>
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

        <!-- APPLY BUTTON -->
        <Button 
          class="mt-4 bg-sky-800 border-sky-800 hover:bg-sky-900 w-full justify-center" 
          @click="applyFiltersOnQuestions"
        >
          APPLY FILTER
        </Button>
      </div>
    </Drawer>

    <!-- MAIN CONTENT AREA (Replaces SidebarMain) -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- TOP HEADER (Replaces SidebarTrigger) -->
      <header class="flex h-16 items-center gap-2 border-b border-surface-200 dark:border-surface-700 px-4">
        <Button severity="secondary" text size="small" @click="open = true" class="flex gap-2 items-center">
          <i class="pi pi-sidebar text-lg"></i>
          <span class="font-bold tracking-wide">FILTERS</span>
        </Button>
      </header>

      <!-- MAIN PAGE CONTENT -->
      <main class="flex-1 px-4 py-6 sm:px-8">
        
        <!-- Headers & Sorting -->
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
          <div class="sm:self-center">
            <h1 class="font-inter font-bold text-2xl text-primary-dark tracking-wide">
              Questions
            </h1>
            <h3 class="text-gray-500">{{ total }} questions found.</h3>
          </div>
          <div class="flex flex-col sm:items-end gap-2">
            <h2 class="font-inter font-bold text-xl text-primary-dark tracking-wide">{{ selectedSubject?.name }}</h2>
            <div class="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select v-model="sortBy" :options="sortableItems" optionLabel="label" placeholder="Sort By" class="w-32 sm:w-auto" />
              <Select v-model="sortOrder" :options="sortableOrders" optionLabel="label" placeholder="Order By" class="w-36 sm:w-auto" />
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div>
          <div v-if="questions?.length > 0">
            <div class="grid gap-4 md:mx-6">
              <QuestionCard
                class="p-4 w-auto"
                v-for="q in questions"
                :key="q"
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
              class="mt-6"
            />
          </div>
          
          <!-- Empty State -->
          <div
            v-else
            class="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 my-4"
          >
            <span class="pi pi-filter-slash text-4xl text-gray-400 mb-3"></span>
            <h3 class="text-lg font-semibold text-gray-700">No questions match your filters</h3>
            <p class="text-sm text-gray-500 mt-1 max-w-sm">
              Try adjusting your choices or checking different combinations to find what you're looking for.
            </p>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSubjectStore } from '@/stores/subject'

// PrimeVue Imports
import Drawer from 'primevue/drawer' // <--- Added this to ensure Drawer renders properly
import Checkbox from 'primevue/checkbox'
import Paginator from 'primevue/paginator'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import TreeSelect from 'primevue/treeselect'
import Select from 'primevue/select'

// Components
import QuestionCard from './QuestionCard.vue'

const route = useRoute()
const subjectStore = useSubjectStore()
const { selectedSubject } = storeToRefs(subjectStore)

const first = ref(0)
const rows = ref(10)
const isMobile = ref(false)
const open = ref(true)

let mql = null
let onMqlChange = null

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
const sortableItems = ref([
  {label: 'Marks', value: 'marks'},
  {label: 'Units', value: 'unit'},
  {label: 'Difficulty', value: 'difficulty'}
])
const sortableOrders = ref([
  {label: 'Ascending', value:'asc'},
  {label: 'Descending', value:'desc'}
])

async function loadTopics(){
  const numericSubjectId = subjectId.value
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/topics/${numericSubjectId}`)
    if (response.status === 404) {
      topics.value = []
    } else if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    } else {
      topics.value = await response.json()
      treeTopics.value = convertToTree(topics.value);
    }
  } catch (error) {
    console.log("Failed to load topics:", error)
    topics.value = []
  }
}

function applyFiltersOnQuestions() {
  page.value = 1
  first.value = 0
  let topicName = null
  if (selectedTopic.value !== null && selectedTopic.value !== undefined) {
    const keys = Object.keys(selectedTopic.value);
    if (keys.length > 0) {
      const topicId = keys[0];
      const foundTopic = topics.value.find(t => t.id.toString() === topicId);
      topicName = foundTopic ? foundTopic.topic : null; 
    }
  }
  filters.value = {
    units: selectedUnitsIndices.value.map(i => units.value[i].value),
    marks: selectedMarksIndices.value.map(i => marks.value[i].value),
    difficulty: (selectedDifficulties.value || []).map(d => d.value),
    topic: topicName
  };
  fetchQuestions();

  // Optionally auto-close the drawer on mobile after applying filters
  if (isMobile.value) {
    open.value = false;
  }
}

async function fetchQuestions() {
  const numericSubjectId = subjectId.value
  const params = new URLSearchParams({ page: page.value, page_size: rows.value })
  filters.value.units.forEach(u => params.append('units', u))
  filters.value.difficulty.forEach(d => params.append('difficulty', d))
  filters.value.marks.forEach(m => params.append('marks', m))
  if (sortBy.value) {
    params.append('sort_by', (sortBy.value ? sortBy.value.value : null))
    params.append('sort_order', (sortOrder.value ? sortOrder.value.value : 'asc'))
  }
  if (filters.value.topic) params.append('topic', filters.value.topic)
  const res = await fetch(`http://127.0.0.1:8000/api/subjects/${numericSubjectId}/questions?${params}`)
  const data = await res.json()
  questions.value = data.questions
  total.value = data.total
}

watch([filters, sortBy, sortOrder], () => { 
  page.value = 1; 
  first.value = 0; 
  scrollToTop(); 
  fetchQuestions() 
}, { deep: true })

function onPageChange(event) {
  page.value = event.page + 1  
  rows.value = event.rows
  fetchQuestions()
  scrollToTop()
}

function onSelectMarksChips(index) {
  if (!selectedMarksIndices.value) return;
  if (selectedMarksIndices.value.includes(index)) {
    selectedMarksIndices.value = selectedMarksIndices.value.filter((i) => i !== index)
  } else {
    selectedMarksIndices.value.push(index)
  }
}

function onSelectUnitChips(index) {
  if (!selectedUnitsIndices.value) return;
  if (selectedUnitsIndices.value.includes(index)) {
    selectedUnitsIndices.value = selectedUnitsIndices.value.filter((i) => i !== index)
  } else {
    selectedUnitsIndices.value.push(index)
  }
}

onMounted(async () => {
  if (typeof window === 'undefined') return
  if (!subjectStore.selectedSubject || subjectStore.selectedSubject.id !== subjectId.value) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/subjects/${subjectId.value}`);
      if (res.ok) {
        const data = await res.json();
        subjectStore.selectSubject(data); 
      }
    } catch (e) {
      console.error("Failed to fetch subject details", e);
    }
  }
  loadTopics()
  fetchQuestions()
  
  // Responsive Drawer Logic
  mql = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mql.matches
  open.value = !isMobile.value // Stays open by default on desktop, hidden on mobile

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
  { label: 'Unit 5', value: 5 },
])

const difficulties = ref([
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
}

const convertToTree = (topics) => {
    const units = new Map();

    topics.forEach((topic) => {
        const unitKey = `unit-${topic.unit}`;

        if (!units.has(unitKey)) {
            units.set(unitKey, {
                key: unitKey,
                label: `Unit ${topic.unit}`,
                selectable: false, 
                children: []
            });
        }

        units.get(unitKey).children.push({
            key: topic.id.toString(),
            label: topic.topic,
            data: topic
        });
    });

    return [...units.values()];
};
</script>

<style scoped>
:deep(.p-cascadeselect-overlay) {
    max-height: 260px;
    overflow-y: auto;
}

:deep(.p-cascadeselect-sublist) {
    max-height: 260px;
    overflow-y: auto;
}
</style>