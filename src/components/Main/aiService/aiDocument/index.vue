<template>
  <AiBox class='h-screen overflow-hidden' :aiData='aiData' @updateData='updateData' />
</template>

<script setup lang='ts'>
import { computed, ref } from "vue";
import AiBox from './AiBox.vue';
import { Recipe } from '../../../lib/recipeData'
import { useAiDocumentStore } from '../../../../stores/aiDocument';

const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성

const aiData = ref<Recipe | undefined>(undefined);

let computedAiData = computed(() => aiDocumentStore.getAiData() as Recipe | undefined);

// 갱신이 필요할 때 직접 할당
aiData.value = computedAiData.value;


// aiData.value = aiDocumentStore.getAiData() as Recipe | undefined;

// 자식컴포넌트로부터 데이터가 업데이트 되면
const updateData = async (updatedData : Recipe) => {
  aiDocumentStore.setAiData(updatedData);
  // aiData.value = Object.assign({}, aiDocumentStore.getAiData()) as Recipe | undefined;
  // computedAiData = computed(() => aiDocumentStore.getAiData() as Recipe | undefined);
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