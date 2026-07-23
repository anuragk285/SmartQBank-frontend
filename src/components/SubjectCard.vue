<template>
    <div class="group h-full">
        <Card class="h-full transition-transform duration-300 group-hover:-translate-y-1.25 hover:shadow-lg min-w-2xs border border-gray-300"
      :pt="{ body: 'h-full flex flex-col justify-between p-5' }"
    >
            <template #title>
                <div class="flex flex-col gap-3 ml-2">
                    <div class="flex justify-start gap-3">
                        <Button class="px-2 py-1 text-sm border-gray-300 bg-gray-100 hover:bg-gray-200 text-tertiary">{{ subject_code }}</Button>
                    </div>
                    <h3 class="font-inter font-bold tracking-wide text-xl align-middle"> {{ subject_name }}</h3>
                </div>
            </template>
            <template #footer>
                <Button variant="link">
                    <span class="font-inter font-medium text-primary">View Questions</span>
                    <span class="transition-transform duration-300 group-hover:translate-x-1.25">→</span>
                </Button>
            </template>
        </Card>
    </div>
</template>

<script setup>
    import Button from 'primevue/button';
    import { Card } from 'primevue';
    defineProps(['subject_code', 'subject_name'])
</script>