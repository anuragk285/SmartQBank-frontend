<template>
  <div>
    <Card class="ps-3 py-3 pe-3 border border-gray-300">
      <template #header>
        <div class="flex flex-wrap justify-between items-center mt-4 mx-4 gap-3">
          <div class="flex gap-3 flex-wrap">
            <Badge severity="secondary" class="text-xs px-4 py-2">Unit {{ unit }}</Badge>
            <Badge severity="secondary" class="text-xs px-4 py-2">{{ year }}</Badge>
            <Badge severity="secondary" class="text-primary">#{{ topic }}</Badge>
          </div>
          <div class="flex gap-3 flex-wrap">
            <Badge severity="secondary" class="font-inter text-xs text-tertiary rounded-md px-1.25 py-1 flex gap-1 items-center"><span class="text-sm">{{ marks }}</span> marks</Badge>
            <Badge :class="['px-3 py-1 text-xs font-bold border',difficultyClasses[difficulty],]">{{ difficulty }}</Badge>
          </div>
        </div>
      </template>
      <template #content>
        <h1 class="text-xl font-bold font-inter">{{ question_text }}</h1>
        <div v-if="image_urls?.length > 0" class="flex flex-wrap gap-4 justify-center my-8">
          <img v-for="image_url in image_urls" :key="image_url" :src="image_url" class="max-h-48"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Badge from 'primevue/badge'
defineProps(['question_text', 'unit', 'difficulty', 'year', 'marks', 'image_urls', 'topic'])
const difficultyClasses = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Hard: 'bg-rose-50 text-rose-700 border-rose-200',
}
</script>
