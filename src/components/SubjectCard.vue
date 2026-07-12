<template>
    <div class="group">
        <Card class="transition-transform duration-300 group-hover:-translate-y-1.25 hover:shadow-2xl min-w-2xs flex flex-col justify-start p-3 border border-gray-300">
            <template #title>
                <div class="flex flex-col gap-3">
                    <div class="flex justify-start gap-3">
                        <Badge :value="subject_code" severity="secondary" class="p-4 text-sm"></Badge>
                    </div>
                    <h3 class="font-inter font-bold tracking-wide text-2xl ms-2"> {{ subject_name }}</h3>
                </div>
            </template>
            <template #footer>
                <Button variant="link">
                    <span class="font-inter font-bold text-primary">View Questions</span>
                    <span class=" transition-transform duration-300 group-hover:translate-x-1.25">→</span>
                </Button>
            </template>
        </Card>
    </div>
</template>

<script setup>
    import Badge from 'primevue/badge';
    import { Card, Button } from 'primevue';
    defineProps(['subject_code', 'subject_name'])
</script>