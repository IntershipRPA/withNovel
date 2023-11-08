<template>
  <AiBox class='h-screen overflow-hidden' :aiData='aiData' />
</template>

<script setup lang='ts'>
import { ref } from "vue";
import AiBox from './AiBox.vue';
import { Recipe } from '../../../lib/recipeData'
import { useRightSideStore } from '../../../stores/rightSide';

const rightSideStore = useRightSideStore(); // 스토어 인스턴스 생성

const aiData = ref<Recipe>({});
aiData.value = rightSideStore.getAiData();

console.log("aiData:", aiData.value);
</script>

<style scoped>


</style>