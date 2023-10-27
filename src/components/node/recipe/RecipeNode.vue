<template>
  <NodeViewWrapper>
    <div class="block flex items-end">
      <div class="rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 px-8 mb-2 mt-2 py-5 items-center">
        <!-- <span class="label">Vue Component</span>

        <div class="content">
          <button @click="increase">
            This button has been clicked {{ node.attrs.count }} times.
          </button>
        </div> -->

        <NodeViewContent class="nodeViewContent" />
      </div>
      <span class="recipe-tail cursor-pointer rounded-r-lg shadow-md bg-green-400 hover:bg-green-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max">
        레시피
      </span>
    </div>
    <div>
      <div class='block flex -mt-4 pl-6'>
        <span
          class="recipe-btn-activated cursor-pointer rounded-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white flex items-center min-w-max">
          활성화
        </span>
        <span
          class="recipe-btn-auto cursor-pointer rounded-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max">
          자동화
        </span>
        <span
          class="recipe-btn-run cursor-pointer rounded-lg shadow-md bg-red-400 hover:bg-red-500 z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max">
          실행하기
        </span>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { Editor } from '@tiptap/core';

const props = defineProps({
  ...nodeViewProps,
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const increase = () => {
  props.updateAttributes({
    count: props.node.attrs.count + 1,
    // count: 10,
  });
  console.log("btn클릭")
};


</script>



<style lang="scss">
.recipe {
  background: #a2fa94;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin-top: 1.5rem;
  padding: 1rem;
}

.nodeViewContent {
  margin: 2.5rem 1rem 1rem;
  padding: 0.5rem;
  border: 2px dashed #0D0D0D20;
  border-radius: 0.5rem;
}
</style>
