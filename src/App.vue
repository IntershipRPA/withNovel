<script setup lang="ts">
import Editor from "./components/Editor.vue";
import LeftSide from "./components/LeftSide/index.vue";
import RightSide from "./components/RightSide/index.vue";
import ReqAIBtn from "./components/ReqAIBtn.vue";
</script>

<template>
  <div class="mt-8 flex items-stretch">
    <LeftSide class='flex-grow-0'/>
    <div class="flex-grow">
      <Editor class="http://localhost:3000/api/generate" />
      <ReqAIBtn class="max-w-screen-lg .w-full mx-auto" />
    </div>
    <RightSide class='flex-grow-0'/>
  </div>
</template>

<style scoped></style>
