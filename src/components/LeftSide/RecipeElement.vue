<template>
  <button class="flex justify-start p-2 mb-2 hover:bg-gray-200 border-stone-200 bg-white sm:rounded-lg sm:border text-sm">
    레시피 {{ props.recipeKey }}
  </button>
</template>

<script setup lang='ts'>

const props = defineProps({
  recipeKey : {
    type: Number,
    required : true,
  }
})

</script>

<style>

</style>