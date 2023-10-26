<template>
  <label class="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
    <input
      type="checkbox"
      name="autoSaver"
      class="sr-only"
      :checked="isChecked"
      @change="handleCheckboxChange"
    />
    <span
      class="slider mr-3 flex h-26 w-50 items-center rounded-full p-1 duration-200"
      :class="isChecked ? 'bg-green-700' : 'bg-gray-700'"
    >
      <span
        class="dot h-18 w-18 rounded-full bg-white duration-200"
        :class="isChecked ? 'translate-x-6' : ''"
      ></span>
    </span>
    <span class="label flex items-center text-sm font-medium text-black">
      <span class="pl-1"> {{ isChecked ? '레시피 활성화' : '레시피 비활성화' }} </span>
    </span>
  </label>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const isChecked = ref<boolean>(false);

const handleCheckboxChange = () => {
  isChecked.value = !isChecked.value;
}
</script>

<style scoped>
.slider{
  height: 26px;
  width: 50px;
}
.dot{
  height: 18px;
  width: 18px;
}
</style>