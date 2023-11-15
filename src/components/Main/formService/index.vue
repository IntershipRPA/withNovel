<template>
  <div class="flex items-stretch">
    <div>
      <Editor ref="childComponentRef" class="http://localhost:3000/api/generate" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Editor from "./Editor.vue";

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


</script>

<style></style>