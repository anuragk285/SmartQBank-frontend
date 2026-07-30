<template>
  <header class="px-4 md:px-4 py-3 z-40 bg-white border-b border-gray-200 shadow-sm">
    <div class="flex flex-wrap flex-row items-center gap-x-12 gap-y-3">
      <div class="flex items-center gap-1">
        <router-link to="/">
          <span class="text-primary sm:text-3xl text-2xl font-bold tracking-tight">SmartQBank</span>
        </router-link>
        <div class="flex items-center">
          <span class="px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200 rounded-full shadow-sm cursor-default">Beta</span>
        </div>
      </div>  
      <div class="">
        <Breadcrumb
          v-if="route.name !== 'subjects'"
          :home="home"
          :model="breadcrumbItems"
          class="p-0! bg-transparent! border-0"
        >
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                <span v-if="item.icon" :class="item.icon" class="text-sm"></span>
                <span v-if="item.label" class="text-sm font-medium">{{ item.label }}</span>
              </a>
            </router-link>
            
            <span v-else v-bind="props.action" class="flex items-center gap-2  font-semibold">
              <span v-if="item.icon" :class="item.icon" class="text-sm"></span>
              <span v-if="item.label" class="text-sm text-gray-500 hover:text-tertiary">{{ item.label }}</span>
            </span>
          </template>
          
          <template #separator>
            <span class="pi pi-angle-right text-gray-400 text-xl mx-[0.5]"></span>
          </template>
        </Breadcrumb>
      </div>
    </div>
  </header>
</template>
<script setup>
import Breadcrumb from 'primevue/breadcrumb'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'

const home = { icon: 'pi pi-home', route: '/' }
const route = useRoute()
const subjectStore = useSubjectStore()
const { selectedSubject } = storeToRefs(subjectStore)

const breadcrumbItems = computed(() => {
  if (route.name === 'questions' && selectedSubject.value) {
    const items = []
    const sub = selectedSubject.value
    if (sub.department) {
      const semLabel = typeof sub.semester === 'number' ? `Sem ${sub.semester}` : sub.semester
      items.push({
        label: typeof sub.department === 'object' ? `${sub.department.name} ⋅ ${semLabel}` : `${sub.department} ⋅ ${semLabel}`
      })
    }
    if (sub.name) {
      items.push({ label: selectedSubject.value.name })
    }

    return items
  }
  return []
})
</script>