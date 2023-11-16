<template>
  <div class="fixed top-16 left-1/2 transform -translate-x-1/2 p-2 px-20 bg-gray-800 opacity-75 text-white font-semibold tracking-wide border border-gray-400 rounded-lg">
    {{ props.msg }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
</style>
