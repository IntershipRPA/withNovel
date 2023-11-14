<template>
  <AiBox class='h-screen overflow-hidden' :aiData='aiData' @updateData='updateData' />
</template>

<script setup lang='ts'>
import { computed, ref } from "vue";
import AiBox from './AiBox.vue';
import { Recipe } from '../../../lib/recipeData'
import { useRightSideStore } from '../../../stores/rightSide';

const rightSideStore = useRightSideStore(); // 스토어 인스턴스 생성

const aiData = ref<Recipe | undefined>(undefined);

let computedAiData = computed(() => rightSideStore.getAiData() as Recipe | undefined);

// 갱신이 필요할 때 직접 할당
aiData.value = computedAiData.value;


// aiData.value = rightSideStore.getAiData() as Recipe | undefined;

// 자식컴포넌트로부터 데이터가 업데이트 되면
const updateData = async (updatedData : Recipe) => {
  rightSideStore.setAiData(updatedData);
  // aiData.value = Object.assign({}, rightSideStore.getAiData()) as Recipe | undefined;
  computedAiData = computed(() => rightSideStore.getAiData() as Recipe | undefined);
  aiData.value = computedAiData.value;

  console.log("hereee" , aiData.value);
}

// console.log("aiData:", aiData.value);
</script>

<style scoped>


</style>