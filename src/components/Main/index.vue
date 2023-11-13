<template>
  <div class="flex items-stretch">
    <div>
      <Editor class="http://localhost:3000/api/generate" />
      <ReqAIBtn class="max-w-screen-lg .w-full mx-auto" />
    </div>
    <RightSide v-if="isRightSideOpen" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useRightSideStore } from '../../stores/rightSide';
import Editor from "./Editor.vue";
import ReqAIBtn from "./ReqAIBtn.vue";
import RightSide from "./RightSide/index.vue";

// 오른쪽 사이드바 설정
const rightSideStore = useRightSideStore(); // 스토어 인스턴스 생성
const isRightSideOpen = computed(() => rightSideStore.isRightSideOpen);

</script>

<style></style>