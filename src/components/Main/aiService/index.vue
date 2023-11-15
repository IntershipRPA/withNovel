<template>
  <div class="flex items-stretch">
    <div>
      <Editor ref="childComponentRef" class="http://localhost:3000/api/generate" :defaultValue='defaultValue' />
      <ReqAIBtn class="max-w-screen-lg .w-full mx-auto" />
    </div>
    <AiDocument v-if="isAiDocumentOpen" />
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useAiDocumentStore } from '../../../stores/aiDocument';
import { useRecipeStore } from '../../../stores/recipes';
import Editor from "./Editor.vue";
import ReqAIBtn from "./ReqAIBtn.vue";
import AiDocument from "./AiDocument/index.vue";
import { defaultEditorContent2 } from "../../../lib/default-content2";


// 에디터 컨텐츠 설정
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성
const isJsonContentEmpty = Object.keys(recipeStore.jsonContent).length === 0 && recipeStore.jsonContent.constructor === Object;
const defaultValue = computed(() => isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent)

// 오른쪽 사이드바 설정
const AiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성
const isAiDocumentOpen = computed(() => AiDocumentStore.isAiDocumentOpen);

const emits = defineEmits();

// 에디터 감지
const childComponentRef = ref<any>(null);

// 에디터 가로폭 감지
onMounted(() => {
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      // console.log('자식 컴포넌트의 div 요소의 크기가 변경되었습니다:', entry.contentRect.width, entry.contentRect.height);
      emits("updateAiEditorWidth", entry.contentRect.width)
    }
  });
  const childComponent = childComponentRef.value;
  // 자식 컴포넌트의 div 요소에 접근하여 ResizeObserver로 감시
  const divElement = childComponent?.$refs.childDiv;
  if (divElement instanceof HTMLElement) {
    resizeObserver.observe(divElement); // 크기 변화 감지 시작
  }
});
</script>

<style></style>