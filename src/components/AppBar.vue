<template>
  <Menubar class="p-4">
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
import avatarImage from '@/assets/images/onePunchMan.jpeg'

</script>
<style scoped></style>
