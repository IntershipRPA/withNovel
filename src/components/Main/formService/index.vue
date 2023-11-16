<template>
  <div class="flex items-stretch">
    <div>
      <Editor ref="childComponentRef" class="http://localhost:3000/api/generate" :defaultValue='defaultValue' />
    </div>
    
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, computed } from 'vue';
import { useAiDocumentStore } from '../../../stores/aiDocument';
import { useRecipeStore } from '../../../stores/recipes';
import Editor from "./Editor.vue";
import { defaultEditorContent2 } from "../../../lib/default-content2";

const emits = defineEmits();

// 에디터 감지
const childComponentRef = ref<any>(null);

// 에디터 가로폭 감지
onMounted(() => {
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      // console.log('자식 컴포넌트의 div 요소의 크기가 변경되었습니다:', entry.contentRect.width, entry.contentRect.height);
      emits("updateFormEditorWidth", entry.contentRect.width)
    }
  });
  const childComponent = childComponentRef.value;
  // 자식 컴포넌트의 div 요소에 접근하여 ResizeObserver로 감시
  const divElement = childComponent?.$refs.childDiv;
  if (divElement instanceof HTMLElement) {
    resizeObserver.observe(divElement); // 크기 변화 감지 시작
  }
});

// 에디터 컨텐츠 설정
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성
const isJsonContentEmpty = Object.keys(recipeStore.jsonContent).length === 0 && recipeStore.jsonContent.constructor === Object;
//console.log(recipeStore.jsonContent)
// const defaultValue = isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent
const defaultValue = computed(() => isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent)
//console.log(defaultValue.value)

</script>

<style></style>