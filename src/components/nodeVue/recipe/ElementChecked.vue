<template>
  <label class="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
    <input type="checkbox" name="autoSaver" class="sr-only" :checked="props.modelValue" @change="handleCheckboxChange" />
    <span class="slider mr-3 flex h-26 w-50 items-center rounded-full p-1 duration-200"
      :class="props.modelValue ? 'bg-emerald-700' : 'bg-gray-700'">
      <span class="dot h-18 w-18 rounded-full bg-white duration-200"
        :class="props.modelValue ? 'translate-x-6' : ''"></span>
    </span>
    <span class="label flex items-center text-sm font-medium">
      <span class="pl-1" :class="props.modelValue ? ' text-black' : ''">
        {{ props.modelValue ? props.checkedString : props.unCheckedString }}
      </span>
    </span>
  </label>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  checkedString: {
    type: String,
    required: true,
  },
  unCheckedString: {
    type: String,
    required: true,
  },
})

const handleCheckboxChange = () => {
  // 로컬 상태를 변경
  const updatedValue = !props.modelValue;
  // 변경된 값을 부모 컴포넌트로 전달
  emit('update:modelValue', updatedValue);
  // emit('update:modelValue', props.modelValue);
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
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