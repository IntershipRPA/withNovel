<template>
  <!-- <input ref="inputField" type="text" v-model='localMessage' class="min-w-[245px] text-black " /> -->
  <textarea ref="inputField"  v-model='localMessage' rows="1" cols="32" wrap="hard" style="resize: none; overflow: hidden;" @input="handleInput"></textarea>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';

const props = defineProps(['modelValue']);

const localMessage = ref(props.modelValue);
const inputField = ref<HTMLTextAreaElement | null>(null);

onMounted(() => {
  // adjustTextareaHeight(inputField.value);
  adjustTextareaHeight(inputField.value);
});

const adjustTextareaHeight = (element : HTMLTextAreaElement | null) => {
  const textarea = element;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

const handleInput = (event : Event) => {
  if (event.target instanceof HTMLTextAreaElement) {
    adjustTextareaHeight(event.target);
  }
};
</script>

<style scoped></style>