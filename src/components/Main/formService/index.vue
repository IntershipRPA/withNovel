<template>
  <div class="flex items-stretch">
    <div>
      <Editor class="http://localhost:3000/api/generate" :defaultValue='defaultValue' />
     
    </div>
    
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useAiDocumentStore } from '../../../stores/aiDocument';
import { useRecipeStore } from '../../../stores/recipes';
import Editor from "./Editor.vue";

import { defaultEditorContent2 } from "../../../lib/default-content2";


// 에디터 컨텐츠 설정
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성
const isJsonContentEmpty = Object.keys(recipeStore.jsonContent).length === 0 && recipeStore.jsonContent.constructor === Object;
console.log(recipeStore.jsonContent)
// const defaultValue = isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent
const defaultValue = computed(() => isJsonContentEmpty ? defaultEditorContent2 : recipeStore.jsonContent)
console.log(defaultValue.value)



</script>

<style></style>