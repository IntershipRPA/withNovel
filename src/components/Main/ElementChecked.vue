<template>
  <label class="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
    <input type="checkbox" name="autoSaver" class="sr-only" :checked="props.toggle" @change="handleCheckboxChange" />
    <!-- <span class="px-3 h-6 flex items-center justify-center mr-3 text-sm font-semibold rounded-full " 
    :class="props.toggle ? 'text-black' : 'bg-gray-700'" @click="setModelValue(true)">
      form 입력
    </span> -->
    <span class="slider flex items-center rounded-full p-1 duration-200 bg-gray-700">
      <span class="text-sm z-10 font-semibold absolute left-4 text-gray-200">form입력</span>
      <!-- <span class="dot h-18 w-18 rounded-full bg-white duration-200" -->
      <span class="dot z-20 absolute rounded-full bg-white duration-200 text-black text-sm font-semibold flex items-center justify-center"
        :class="props.toggle ? 'translate-x-24' : ''">{{ props.toggle ? 'ai입력' : 'form입력' }}</span>
      <span class="text-sm z-10 font-semibold absolute right-8 text-gray-200">ai입력</span>
    </span>
    <!-- <span class="px-3 h-6 flex items-center justify-center ml-3 text-sm font-semibold rounded-full " 
    :class="props.toggle ? 'bg-gray-700' : 'text-black'" @click="setModelValue(false)">
      ai 입력
    </span> -->
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
  height: 32px;
  /* width: 50px; */
  width: 193px;
}

.dot {
  height: 24px;
  /* width: 18px; */
  width: 88px;
}
</style>
