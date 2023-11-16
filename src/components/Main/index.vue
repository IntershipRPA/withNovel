<template>
  <div :key="componentKey" class="flex flex-col justify-items-center">
    <div ref="resizingElement" :style="{ width: dynamicWidth }"
      class="p-1 px-12 bg-gray-400 min-w-[700px] w-full max-w-screen-lg border-stone-200 sm:rounded-lg flex justify-center">
      <!-- <span class="mr-8">입력 모드를 선택하세요.</span> -->
      <ElementChecked :toggle='toggleValue' @update:modelValue="handleUpdateIsAi" />
    </div>
    <AiService v-if='toggleValue' @updateAiEditorWidth='updateAiEditorWidth' />
    <FormService v-else @updateFormEditorWidth='updateFormEditorWidth' />
  </div>
</template>

<script setup lang='ts'>
import ElementChecked from './ElementChecked.vue';
import FormService from './formService/index.vue'
import AiService from './aiService/index.vue'
import { useServiceStore } from '../../stores/serviceToggle';
import { useRecipeStore } from '../../stores/recipes';

import { computed, ref, watch } from 'vue';

// key를 이용한 리로드
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성
const componentKey = ref(0);
watch(
  () => recipeStore.reloadMainComponent,
  () => {
    // 상태가 변경되었을 때 컴포넌트의 key 값을 변경하여 강제로 리로드
    componentKey.value += 1;
  }
);

// 서비스 토글
const serviceToggle = useServiceStore(); // 스토어 인스턴스 생성

const toggleValue = computed(() => serviceToggle.service==="aiService" ? true : false)

const handleUpdateIsAi = (value: boolean) => {
  if (value === true) {
    serviceToggle.setAiService();
  } else {
    serviceToggle.setFormService();
  }
}

// 에디터 가로폭 감지 받아오기
const resizingElement = ref(null);
const dynamicWidth = ref('700px'); // 초기 너비 설정

const updateAiEditorWidth = (width: number) => {
  const updatedWidth = width+(48*2)+2; // 너비+패딩*2+테두리두께
  if(toggleValue.value === true){ // ai에디터로 적용
    dynamicWidth.value = `${updatedWidth}px`
  }
}
const updateFormEditorWidth = (width: number) => {
  const updatedWidth = width+(48*2)+2; // 너비+패딩*2+테두리두께
  if(toggleValue.value === false){ // form에디터로 적용
    dynamicWidth.value = `${updatedWidth}px`
  }
}

</script>

<style scoped>

</style>