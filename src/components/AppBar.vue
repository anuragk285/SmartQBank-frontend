<template>
  <Menubar class="p-4 z-40 bg-white border-b border-gray-200">
    <template #start>
      <div class="flex items-center flex-wrap gap-6 mx-2 relative bg-white">
        <span class="text-primary text-2xl font-bold">SmartQBank</span>

        <Breadcrumb
          v-if="route.name !== 'subjects'"
          :home="home"
          :model="breadcrumbItems"
          class="p-0! bg-transparent! border-0"
        >
          <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center gap-2">
                <span v-if="item.icon" :class="item.icon" class="hover:text-tertiary"></span>
                <span v-if="item.label">{{ item.label }}</span>
              </a>
            </router-link>
            
            <span v-else v-bind="props.action" class="flex items-center gap-2 hover:text-tertiary">
              <span v-if="item.icon" :class="item.icon"></span>
              <span v-if="item.label">{{ item.label }}</span>
            </span>
          </template>
        </Breadcrumb>
      </div>
    </template>
    
    <template #end>
      <Avatar shape="circle" :image="avatarImage" class="cursor-pointer" />
    </template>
  </Menubar>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSubjectStore } from '@/stores/subject'
import { Menubar, Avatar } from 'primevue'
import Breadcrumb from 'primevue/breadcrumb'
import avatarImage from '@/assets/images/onePunchMan.jpeg'
const route = useRoute() 
const subjectStore = useSubjectStore()
const { selectedSubject } = storeToRefs(subjectStore)

const home = { icon: 'pi pi-home', route: '/' }

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
      items.push({ label: sub.name })
    }

    return items
  }
  return []
})
</script>