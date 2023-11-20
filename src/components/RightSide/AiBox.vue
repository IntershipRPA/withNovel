<template>
  <div class="flex-col mx-auto max-w-screen-lg p-12 px-18 min-w-[518px] sm:rounded sm:border sm:px-12 sm:shadow-lg">
    <div class='text-xl mb-8'>
      AI 응답 요청 결과
    </div>
    <!-- <ConAct v-for='(condition, index) in conditions.filter(item => item.group === 'orGroup')' :key="index"/> -->
    <ConAct class='my-8'/>
    <ConAct class='my-8'/>
    <button type="button"
      class='border-stone-200 bg-white p-4 px-8 sm:mb-[calc(20vh)] sm:rounded sm:border sm:px-8 sm:shadow-lg text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'>
      레시피 저장
    </button>
    <!-- <TestBard /> -->
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import TestBard from "./TestBard.vue";
import ConAct from './ConAct.vue';

const conditions = ref<Condition[]>([]);

interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: string,
}

</script>

<style scoped></style>