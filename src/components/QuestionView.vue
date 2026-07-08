<template>
    <div>
        <SidebarLayout class="relative! flex min-h-screen w-full">
            <SidebarBackdrop v-if="(backdrop || isMobile) && open" class="absolute!" />
            <Sidebar class="sticky top-0 h-screen"
                id="variants-demo" :variant="variant" :collapsible="isMobile ? 'offcanvas' : collapsible" :side="side" :overlay="isMobile || overlay" :openOnHover="openOnHover" v-model:open="open">
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
                            <div class="flex flex-col justify-start gap-4">
                                <div class="flex flex-col justify-start gap-1">
                                    <Label for="year" class="text-xs">YEAR</Label>
                                    <Select 
                                        id="year"
                                        v-model="selectedYears" 
                                        :options="years" 
                                        optionLabel="year" 
                                        multiple
                                        display="chip" 
                                        placeholder="Select year. Ex: 2025"
                                        class="w-full border border-gray-400 bg-white" 
                                    />
                               </div>
                               <div class="flex flex-col justify-start gap-1">
                                    <Label for="unit">UNIT</Label>
                                    <div class="flex flex-col gap-2" id="unit">
                                        <!-- <Listbox v-model="selectedUnits" :options="units" multiple checkbox optionLabel="name" class="w-full md:w-56" :showToggleAll="false"></Listbox> -->
                                        <div v-for="unit in units" :key="unit.id" class="flex items-center gap-2">
                                            <Checkbox v-model="selectedUnits" :inputId="unit.id" name="name" :value="unit" />
                                            <Label :for="unit.key">{{ unit.name }}</Label>
                                        </div>
                                    </div>
                               </div>
                               <div class="flex flex-col justify-start gap-1">
                                    <Label for="diificulty">DIFFICULTY</Label>
                                    <div class="flex flex-col gap-3" id="difficulty">
                                        <div v-for="d of difficulties" :key="d.key" class="flex items-center gap-2">
                                            <Checkbox v-model="selectedDifficulties" :inputId="d.key" name="name" :value="d" />
                                            <Label :for="d.key" class="text-sm">{{ d.name }}</Label>
                                        </div>
                                    </div>
                               </div>
                               <div class="flex flex-col justify-start gap-1">
                                <Label for="marks">MARKS</Label>
                                <Select 
                                        id="year"
                                        v-model="selectedMarks" 
                                        :options="marks" 
                                        optionLabel="marks" 
                                        multiple
                                        display="chip" 
                                        placeholder="Ex: 2, 4, 8.."
                                        class="w-full border-gray-400 bg-white" 
                                    />
                               </div>
                            </div>
                        </SidebarContent>
                        <SidebarFooter class="flex flex-col gap-3">
                            <div v-for="group in sidebarFooterItems" :key="group.label" class="w-full flex flex-col gap-4">                          
                                <hr class="mb-3">
                                <SidebarMenuItem v-for="item in group.items" :key="item.label">
                                    <SidebarMenuButton class="p-1! flex items-center gap-2 w-full">
                                        <component :is="item.icon" class="w-4 h-4 me-2 scale-150 text-black"/>
                                        <span class="text-sm font-medium">{{ item.label }}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem> 
                            </div>
                        </SidebarFooter>
                    </SidebarPanel>
                </SidebarAside>
            </Sidebar>
            <SidebarMain v-if="side === 'left'" class="flex-1">
                    <header class="flex h-12 items-center gap-2 border-surface-200 dark:border-surface-700 px-4">
                        <SidebarTrigger severity="secondary" target="variants-demo" :text="true" size="small">
                            <h4>FILTERS</h4>
                            <SidebarIcon />
                        </SidebarTrigger>
                    </header>
                    <main class="px-4">
                        <div class="flex justify-between">
                            <div>
                                <h1 class="font-inter font-bold text-2xl text-primary-dark tracking-wide">Questions</h1>
                                <h3 class="text-tertiary">questions found <span class="text-primary">↓</span></h3>
                            </div>
                            <Button class="px-4 py-2 rounded-md self-start">APPLY FILTER</Button>
                        </div>
                        <div>
                            <div class="grid ">
                                <QuestionCard
                                class="p-4"
                                v-for="q in paginatedQuestions" 
                                :key="q"    
                                :question_text="q.text"
                                :difficulty="getDifficulty(q.difficulty_level)"
                                :marks="q.marks"
                                :unit="q.unit"
                                :year="q.year"/>
                            </div>

                            <Paginator
                                v-model:first="first" 
                                v-model:rows="rows" 
                                :totalRecords="allQuestions.length" 
                                :rowsPerPageOptions="[5, 10, 15]"
                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"/>
                        </div>
                    </main>
                </SidebarMain>
        </SidebarLayout>
    </div>
</template>

<script setup>
    import { Sidebar, SidebarAside, SidebarContent, SidebarHeader, SidebarLayout, SidebarMain, SidebarTrigger, SidebarPanel, SidebarBackdrop, SidebarFooter, SidebarSpacer, SidebarMenuButton, SidebarMenuItem} from 'primevue';
    import SidebarIcon from '@primeicons/vue/sidebar';
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
    import Label from 'primevue/label';
    import Checkbox from 'primevue/checkbox';
    import Select from 'primevue/select';
    import QuestionCard from './QuestionCard.vue';
    import Paginator from 'primevue/paginator';
    import Button from 'primevue/button';
    import QuestionCircle from '@primeicons/vue/question-circle';
    import Cog from '@primeicons/vue/cog';
    import { useRoute } from 'vue-router'
    import { useSubjectStore } from '@/stores/subject'

    const route = useRoute()
    const subjectStore = useSubjectStore()
    const first = ref(0);
    const rows = ref(5);
    const isMobile = ref(false);
    const open = ref(true);
    const variant = ref('sidebar');
    const collapsible = ref('offcanvas');
    const side = ref('left');
    const overlay = ref(false);
    const openOnHover = ref(false);
    const backdrop = ref(false);
    let mql = null;
    let onMqlChange = null;
    
    const allQuestions = ref([])
    const loading = ref(true)

    const getDifficulty = (difficulty_level) => {
        if(difficulty_level <= 2) return 'Easy';
        else if(difficulty_level <= 4) return 'Medium';
        else return 'Hard';
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
        loading.value = false
    }

    const sidebarFooterItems = [
        {
            label: "menu",
            items: [
                {label: "Help", icon: QuestionCircle},
                {label: "Settings", icon: Cog}
            ]
        }
    ]
    onMounted(() => {
        if (typeof window === 'undefined') return;
        loadSubjectAndQuestions(route.params.subjectId)
        mql = window.matchMedia('(max-width: 1023px)');
        isMobile.value = mql.matches;
        open.value = !isMobile.value;
        onMqlChange = (event) => {
            isMobile.value = event.matches;
            open.value = !event.matches;
        };
        mql.addEventListener('change', onMqlChange);
    });
    onBeforeUnmount(() => {
        if (mql && onMqlChange) {
            mql.removeEventListener('change', onMqlChange);
        }
    });
    watch(() => route.params.subjectId, (newId) => {
        loadSubjectAndQuestions(newId)
    })
    const selectedUnits = ref([]);
    const units = ref([
        {name: 'Unit 1', unit_number: 1},
        {name: 'Unit 2', unit_number: 2},
        {name: 'Unit 3', unit_number: 3},
        {name: 'Unit 4', unit_number: 4},
        {name: 'Unit 5', unit_number: 5},
    ])
    const selectedDifficulties = ref([]);
    const difficulties = ref([
        { name: 'Easy', key: 'Easy' },
        { name: 'Medium', key: 'Midium' },
        { name: 'Hard', key: 'Hard' },
    ]);
    const selectedYears = ref([])
    const years = ref([
        {year: 2021, value: 2021},
        {year: 2022, value: 2022},
        {year: 2023, value: 2023},
        {year: 2024, value: 2024},
        {year: 2025, value: 2025},
    ])
    const selectedMarks = ref(null)
    const marks = ref([
        {marks: "2", value: 2},
        {marks: "3", value: 3},
        {marks: "4", value: 4},
        {marks: "5", value: 5},
        {marks: "6", value: 6},
        {marks: "7", value: 7},
        {marks: "8", value: 8},
        {marks: "9", value: 9},
        {marks: "10", value: 10},
    ])
    const paginatedQuestions = computed(() => {
        const start = first.value;
        const end = first.value + rows.value;
        return allQuestions.value.slice(start, end);
    });
</script>