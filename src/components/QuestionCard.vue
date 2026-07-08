<template>
  <div>
    <Card class="ps-3 py-3 pe-5 border border-gray-300">
      <template #content>
        <h1 class="text-xl font-bold font-inter">{{ question_text }}</h1>
      </template>
      <template #footer>
        <div class="flex justify-start items-center gap-3 mt-4">
          <Badge
            severity="secondary"
            class="font-inter text-xs text-tertiary rounded-md px-1.25 py-1 flex gap-1 items-center"
            ><span class="text-sm">{{ marks }}</span> marks</Badge
          >
          <Badge severity="secondary" class="text-xs px-4 py-2">Unit {{ unit }}</Badge>
          <Badge severity="secondary" class="text-xs px-4 py-2">{{ year }}</Badge>
          <Badge
            :class="[
              'px-3 py-1 text-xs font-bold rounded-full border',
              difficultyClasses[difficulty],
            ]"
            >{{ difficulty }}</Badge
          >
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Badge from 'primevue/badge'
defineProps(['question_text', 'unit', 'difficulty', 'year', 'marks'])
const difficultyClasses = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Hard: 'bg-rose-50 text-rose-700 border-rose-200',
}
</script>
