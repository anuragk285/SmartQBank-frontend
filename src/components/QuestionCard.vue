<template>
  <div :class="isMobile ? 'w-full' : (open ? 'w-full max-w-[85ch]' : 'w-full max-w-[95ch]')" class="transition-all duration-300 ease-in-out">
    <Card class="sm:px-3 px-[0.5] py-2 border border-gray-300">
      <template #header>
        <div class="flex flex-wrap justify-between items-center mt-4 mx-5 gap-3">
          <div class="flex sm:gap-2 gap-1 flex-wrap items-center">
            <span v-if="isMobile" class="font-light text-sm hover:text-tertiary">Q{{ question_id }}</span>
            <span v-if="isMobile" class="text-xl font-medium mx-1">⋅</span>
            <h4 class="text-sm text-gray-500 hover:text-tertiary">Unit {{ unit }}</h4>
            <span class="text-xl font-medium mx-1">⋅</span>
            <h4 class="text-sm text-gray-500 hover:text-tertiary">{{ year }}</h4>
            <Button unstyled class="text-primary text-sm hover:underline cursor-pointer select-none touch-manipulation rounded-2xl mobile-tap-clean px-2 py-[0.5]" @click="$emit('selectedTopic', topic_id)"><i>#{{ topic }}</i></Button>
          </div>
          <div class="flex gap-3 flex-wrap">
            <Badge severity="secondary" class="font-inter text-xs text-tertiary rounded-md px-1.25 py-1 flex gap-1 items-center"><span class="text-sm">{{ marks }}</span> marks</Badge>
            <Badge :class="['px-2 py-1 text-xs font-bold border',difficultyClasses[difficulty],]">{{ difficulty }}</Badge>
          </div>
        </div>
      </template>
      <template #content>
        <h1 class="flex items-baseline font-medium text-lg font-inter text-start">
          <span v-if="!isMobile" class="font-light text-base sm:mr-2 text-gray-500 hover:text-tertiary" :class="isMobile ? 'shrink' : 'shrink-0'">Q{{ question_id }} <span class="text-lg font-medium ml-1">⋅</span></span>
          <span class="flex-1 text-lg">
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
import Button from 'primevue/button'

defineProps(['question_id', 'question_text', 'unit', 'difficulty', 'year', 'marks', 'image_urls', 'topic', 'topic_id', 'isMobile', 'open'])
const difficultyClasses = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Hard: 'bg-rose-50 text-rose-700 border-rose-200',
}
</script>

<style scoped>
.mobile-tap-clean {
  -webkit-tap-highlight-color: transparent;
}
.p-button .p-ink {
  background: rgba(255, 255, 255, 0.35) !important;
}
</style>
