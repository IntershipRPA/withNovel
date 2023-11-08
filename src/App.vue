<script setup lang="ts">
import LeftSide from "./components/LeftSide/index.vue";
import Main from "./components/Main/index.vue";
</script>

<template>
  <div class="mt-8 flex items-stretch">
    <LeftSide class='flex-grow-0' />
    <Main class="flex-grow" />    
  </div>
</template>

<style scoped></style>
