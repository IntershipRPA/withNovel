<template>
  <div class="flex flex-col justify-items-center">
    <div
      class="p-2 px-12 bg-gray-400 min-w-[700px] w-full max-w-screen-lg border-stone-200 sm:rounded-lg flex justify-start">
      <span class="mr-8">입력 모드를 선택하세요.</span>
      <ElementChecked :toggle='toggleValue' @update:modelValue="handleUpdateIsAi" />
    </div>
    <AiService v-if='toggleValue' />
    <FormService v-else />
  </div>
</template>

<script setup lang='ts'>
import ElementChecked from './ElementChecked.vue';
import FormService from './formService/index.vue'
import AiService from './aiService/index.vue'
import { useServiceStore } from '../../stores/serviceToggle';

import { computed, ref } from 'vue';

const serviceToggle = useServiceStore(); // 스토어 인스턴스 생성

const toggleValue = computed(() => serviceToggle.service==="aiService" ? true : false)


const handleUpdateIsAi = (value: boolean) => {
  if (value === true) {
    serviceToggle.setAiService();
  } else {
    serviceToggle.setFormService();
  }
}
</script>

<style scoped>

</style>