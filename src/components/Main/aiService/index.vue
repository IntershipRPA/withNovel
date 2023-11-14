<template>
  <div class="flex items-stretch">
    <div>
      <Editor class="http://localhost:3000/api/generate" :defaultValue='defaultValue' />
      <ReqAIBtn class="max-w-screen-lg .w-full mx-auto" />
    </div>
    <AiDocument v-if="isAiDocumentOpen" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useAiDocumentStore } from '../../../stores/aiDocument';
import { useRecipeStore } from '../../../stores/recipes';
import Editor from "./Editor.vue";
import ReqAIBtn from "./ReqAIBtn.vue";
import AiDocument from "./AiDocument/index.vue";
import { defaultEditorContent2 } from "../../../lib/default-content2";


// 에디터 컨텐츠 설정
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성
const isJsonContentEmpty = Object.keys(recipeStore.jsonContent).length === 0 && recipeStore.jsonContent.constructor === Object;
// const defaultValue = isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent
const defaultValue = computed(() => isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent)
//

// 오른쪽 사이드바 설정
const AiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성
const isAiDocumentOpen = computed(() => AiDocumentStore.isAiDocumentOpen);

</script>

<style></style>