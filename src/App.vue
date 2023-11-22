<script setup lang="ts">
import LeftSide from "./components/LeftSide/index.vue";
import Main from "./components/Main/index.vue";
</script>

<template>
  <div class="flex w-full h-8 mb-1 bg-gradient-to-b from-slate-300 to-white"></div>
  <div class="flex items-stretch">
    <LeftSide class='flex-grow-0' />
    <Main class="flex-grow" />    
  </div>
</template>

<style scoped></style>
