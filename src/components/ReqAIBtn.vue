<template>
  <div class="w-full flex justify-center">
    <button type="button" :class="className" @click='handleOnClick' >AI 요청</button>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { Editor } from '../../index';
import { requestAi } from "./requestAiBtn"
import { Recipe, Condition, Action } from '../lib/recipeData'


const props = defineProps({
  className: {
    type: String,
    default:
      "border-stone-200 bg-white p-4 px-8 sm:mb-[calc(20vh)] sm:rounded sm:border sm:px-8 sm:shadow-lg text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800",
  },
})

const message = ref("");

const handleOnClick = async() => {
  console.log("AI요청 버튼 클릭");

  const aiData : Recipe = await requestAi()
  console.log("AiData: ", aiData)
};




</script>
