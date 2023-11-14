<template>
  <input type="text" v-model='localMessage' class="min-w-[245px] text-black "/>
</template>

<script setup lang='ts'>
import { onUpdated, ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits();

const localMessage = ref(props.modelValue);

// onUpdated(() => {
//   console.log(localMessage.value)
// })

</script>

<style scoped>
</style>