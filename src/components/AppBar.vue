<template>
  <Menubar class="p-4" :model="items">
    <template #start>
      <span class="text-primary text-2xl font-bold mx-2">SmartQBank</span>
    </template>
    <template #end>
      <Avatar shape="circle" :image="avatarImage" class="cursor-pointer" />
    </template>
  </Menubar>
</template>

<script setup>
import { Menubar, Avatar } from 'primevue'
import { computed } from 'vue'
import avatarImage from '@/assets/images/onePunchMan.jpeg'
const props = defineProps({
  currentPage: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['change-page'])
const items = computed(() => [
  { label: 'Subjects', value: 'subjects' },
  { label: 'Questions', value: 'questions' },
])
</script>
<style scoped></style>
