<template>
  <button type="button" @click='handleClickToggle' class="p-2 border-stone-200 bg-gray-200 text-blue-800 hover:text-white sm:rounded sm:border hover:bg-blue-800" 
  :class="localToggle ? '' : 'sm:shadow-lg -mt-2 bg-white'" >
    <ArrowLeftToLine v-if="localToggle" />
    <AlignJustify v-else />
  </button>
</template>


<script setup lang='ts'>
import { AlignJustify, ArrowLeftToLine } from 'lucide-vue-next';
import { onUpdated, ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits();

const localToggle = ref(props.modelValue);

const handleClickToggle = () => {

  localToggle.value = !localToggle.value;
  emit('update:modelValue', localToggle.value);
};

// onUpdated(() => {
//   console.log(props.modelValue)
// })

</script>

<style>

</style>