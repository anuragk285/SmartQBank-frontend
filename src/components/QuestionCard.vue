<template>
  <div :class="isMobile ? 'w-full' : (open ? 'w-[80ch]' : 'w-[95ch]')" class="transition-all duration-300 ease-in-out">
    <Card class="px-3 py-2 border border-gray-300">
      <template #header>
        <div class="flex flex-wrap justify-between items-center mt-4 mx-4 gap-3">
          <div class="flex gap-2 flex-wrap items-center">
            <h4 class="text-sm">Unit {{ unit }}</h4>
            <span>⋅</span>
            <h4 class="text-sm">{{ year }}</h4>
            <span>⋅</span>
            <h4 class="text-primary text-sm"><i>#{{ topic }}</i></h4>
          </div>
          <div class="flex gap-3 flex-wrap">
            <Badge severity="secondary" class="font-inter text-xs text-tertiary rounded-md px-1.25 py-1 flex gap-1 items-center"><span class="text-sm">{{ marks }}</span> marks</Badge>
            <Badge :class="['px-2 py-1 text-xs font-bold border',difficultyClasses[difficulty],]">{{ difficulty }}</Badge>
          </div>
        </div>
      </template>
      <template #content>
        <h1 class="flex items-baseline text-xl font-medium font-inter text-start">
          <span class="shrink-0 font-light text-base mr-2">
            Q{{ question_id }} <span class="text-xl font-medium ml-1">⋅</span>
          </span>
          <span class="flex-1">
            {{ question_text }}
          </span> 
        </h1>
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
defineProps(['question_id', 'question_text', 'unit', 'difficulty', 'year', 'marks', 'image_urls', 'topic', 'isMobile', 'open'])
const difficultyClasses = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Hard: 'bg-rose-50 text-rose-700 border-rose-200',
}
</script>
