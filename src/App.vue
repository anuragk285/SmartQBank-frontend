<template>
  <div>
    <AppBar></AppBar>
    <router-view />
  </div>
</template>

<script setup>
import AppBar from './components/AppBar.vue'
import { ref } from 'vue'
const currentPage = ref('Subjects')
const handlePageChange = (newPage) => {
  if (currentPage.value !== newPage) currentPage.value = newPage
}
</script>
