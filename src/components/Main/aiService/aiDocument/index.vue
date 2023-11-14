<template>
  <AiBox class='h-screen overflow-hidden' :aiData='aiData' @updateData='updateData' />
</template>

<script setup lang='ts'>
import { computed, ref } from "vue";
import AiBox from './AiBox.vue';
import { AiData } from '../../../lib/recipeData'
import { useAiDocumentStore } from '../../../../stores/aiDocument';

const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성

const aiData = ref<AiData | undefined>(undefined);

let computedAiData = computed(() => aiDocumentStore.getAiData() as AiData | undefined);
// 갱신이 필요할 때 직접 할당
aiData.value = computedAiData.value;


// aiData.value = aiDocumentStore.getAiData() as AiData | undefined;

// 자식컴포넌트로부터 데이터가 업데이트 되면
const updateData = async (updatedData : AiData) => {
  aiDocumentStore.setAiData(updatedData);
  // aiData.value = Object.assign({}, aiDocumentStore.getAiData()) as AiData | undefined;
  // computedAiData = computed(() => aiDocumentStore.getAiData() as AiData | undefined);
  // aiData.value = computedAiData.value;
  // aiData.value.conditions.splice(0, aiData.value.conditions.length, ...updatedData.conditions);
  aiData.value.conditions = [...updatedData.conditions];
//
  // console.log("hereee" , aiData.value);
}

// console.log("aiData:", aiData.value);
</script>

<style scoped>


</style>