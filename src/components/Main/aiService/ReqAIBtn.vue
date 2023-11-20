<template>
  <div class="w-full flex justify-center">
    <button type="button" :class="className" @click='handleOnClick'>AI 요청</button>
    <Spinner v-if="loading" />
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
// import { Editor } from '../../../../index';
import { requestAi, getFacs, getTags } from "./requestAiBtn"
import { Recipe, Condition, Action, AiData } from '../../../lib/recipeData'
import { useAiDocumentStore } from '../../../stores/aiDocument';
import Spinner from '../../Spinner/Spinner.vue'

const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성

const props = defineProps({
  className: {
    type: String,
    default:
      "border-stone-200 bg-white p-4 px-8 sm:mb-[calc(20vh)] sm:rounded sm:border sm:px-8 sm:shadow-lg text-blue-700 font-semibold hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800",
  },
})

const loading = ref(false);

const handleOnClick = async () => {
  // console.log("AI요청 버튼 클릭");

  //이전 aiData가 있으면 삭제
  aiDocumentStore.closeAiDocument();

  try {
    loading.value = true; // Spinner를 표시

    //테스트 용
    // getFacs();
    // getTags();

    const aiData: AiData = await requestAi()
    console.log("AiData: ", aiData)

    // 스토어에 aiData 저장
    aiDocumentStore.setAiData(aiData);
    // aiDocument 열기
    aiDocumentStore.openAiDocument();
  } catch (error) {
    console.log("ai요청 실패")
  } finally {
    loading.value = false; // Spinner 감추기
  }
};




</script>
