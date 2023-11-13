<template>
  <div class="flex flex-col justify-items-center">
    <div
      class="p-2 px-12 bg-gray-400 min-w-[700px] w-full max-w-screen-lg border-stone-200 sm:rounded-lg flex justify-start">
      <span class="mr-8">입력 모드를 선택하세요.</span>
      <ElementChecked v-model='isAi' @update:modelValue="handleUpdateIsAi" />
    </div>
    <AiService v-if='isAi' />
    <FormService v-else />
  </div>
</template>

<script setup lang='ts'>
import ElementChecked from './ElementChecked.vue';
import FormService from './formService/index.vue'
import AiService from './aiService/index.vue'
import { ref } from 'vue';

const isAi = ref(false);

const handleUpdateIsAi = (value: boolean) => {
  if (value === true) {
    isAi.value = true;
  } else {
    isAi.value = false;
  }
}
</script>

<style scoped>
/* Tailwind CSS 클래스들을 여기에 적용 */
</style>