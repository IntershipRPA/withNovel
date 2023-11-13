<template>
  <input type="text" v-model='localMessage' class="min-w-[245px] text-black "/>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits();

const localMessage = ref(props.modelValue);

</script>

<style scoped>
</style>