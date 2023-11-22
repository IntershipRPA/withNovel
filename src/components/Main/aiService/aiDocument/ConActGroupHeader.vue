<template>
  <div class="relative flex my-4 justify-center">
    <div class="absolute flex justify-center -mt-3 bg-gray-300 w-full rounded">액션을 실행시키기 위한 조건 그룹{{ props.groupKey }}</div>
    <!-- <span class="absolute flex justify-center -mt-2 px-6 bg-white mx-auto border-x-4 border-x-gray-600">액션을 실행시키기 위한 조건 그룹{{ props.groupKey }}</span> -->
    <!-- <div class="w-full border-b-4 border-b-gray-600"></div> -->
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
  groupKey: {
    type: Number,
    required: true,
  },
})


</script>

<style>

</style>