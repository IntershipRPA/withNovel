<template>
  <label class="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
    <input type="checkbox" name="autoSaver" class="sr-only" :checked="props.toggle" @change="handleCheckboxChange" />
    <span class="px-2 mr-3 text-black rounded-lg bg-white" @click="setModelValue(true)">
      form입력
    </span>
    <span class="slider flex h-26 w-50 items-center rounded-full p-1 duration-200 bg-gray-700">
      <span class="dot h-18 w-18 rounded-full bg-white duration-200"
        :class="props.toggle ? 'translate-x-6' : ''"></span>
    </span>
    <span class="px-2 ml-3 text-black rounded-lg bg-white" @click="setModelValue(false)">
      ai입력
    </span>
  </label>
</template>

<script setup lang="ts">
// import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  toggle: {
    type: Boolean,
    required: true,
  },
});

// console.log(props.toggle)


const setModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const handleCheckboxChange = () => {
  const updatedValue = !props.toggle;
  // 변경된 값을 부모 컴포넌트로 전달
  emit('update:modelValue', updatedValue);
};

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.slider {
  height: 26px;
  width: 50px;
}

.dot {
  height: 18px;
  width: 18px;
}
</style>
