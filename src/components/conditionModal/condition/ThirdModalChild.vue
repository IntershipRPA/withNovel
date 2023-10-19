<template>
  <div>
    <!-- Winding Temp 테그 선택 했을 때 -->
    <div class="relative mt-2 rounded-md shadow-sm bottom-1" v-if="tagMsg === 'Winding Temp'">
      <input type="text" name="temp" id="temp"
        class="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 lg:text-lg"
        placeholder="00.00"
        v-model="tempValue"
        @input="onTempInput" />
      <div class="absolute inset-y-0 right-16 flex ">
        <select id="unit" name="unit"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-0 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm lg:text-lg"
          v-model="unitValue"
          @change='onUnitSelected'>
          <option value="℃">℃</option>
          <option value="℉">℉</option>
        </select>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center">
        <select id="range" name="range"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-0 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm lg:text-lg"
          v-model="rangeValue"
          @change='onRangeSelected'>
          <option value="이상">이상</option>
          <option value="이하">이하</option>
          <option value="초과">초과</option>
          <option value="미만">미만</option>
        </select>
      </div>
    </div>

<!-- Press 테그 선택 했을 때 -->
    <div class="relative mt-2 rounded-md shadow-sm bottom-1" v-if="tagMsg === 'Press'">
      <input type="text" name="press" id="press"
        class="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 lg:text-lg"
        placeholder="00.00"
        v-model="tempValue"
        @input="onTempInput" />
      <div class="absolute inset-y-0 right-16 flex ">
        <select id="unit" name="unit"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-0 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm lg:text-lg"
          v-model="bar"
          @change='onBarSelected'>
          <option value="bar">bar</option>
        </select>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center">
        <select id="range" name="range"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-0 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm lg:text-lg"
          v-model="rangeValue"
          @change='onRangeSelected'>
          <option value="이상">이상</option>
          <option value="이하">이하</option>
          <option value="초과">초과</option>
          <option value="미만">미만</option>
        </select>
      </div>
    </div>


<!-- Status 테그 선택 했을 때 -->
    <div class="relative mt-2 rounded-md shadow-sm bottom-1" v-if="tagMsg === 'Status'">
      <input type="text" name="status" id="status"
        class="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 lg:text-lg"
        v-model="tempValue"
        @input="onTempInput" />
      <div class="absolute inset-y-0 right-16 flex ">
        <select id="unit" name="unit"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-0 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm lg:text-lg"
          v-model="started"
          @change='onStartedSelected'>
          <option value="started">started</option>
          <option value="init">init</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
const tagMsg = localStorage.getItem('tag');
const props = defineProps({
  message3: { type: String, default: "test3 message" },
  // tempValue: { type: String, default: "tempValue"},
  // unitValue: { type: String, default:"℃"},
  // range: { type: String, default:"이상"},
})

const tempValue = ref<number | null>(null);
const unitValue = ref<string>("℃");
const rangeValue = ref<string>("이상");
const bar = ref<string>("bar");
const started = ref<string>("started");

const emits = defineEmits(['tempSelected', 'unitSelected', 'rangeSelected', 'barSelected', 'startedSelected']);

const onTempInput = () => {
  emits('tempSelected', tempValue.value);
};

const onUnitSelected = () => {
  emits('unitSelected', unitValue.value);
};

const onRangeSelected = () => {
  emits('rangeSelected', rangeValue.value);
};

const onBarSelected = () => {
  emits('barSelected', bar.value);
};
const onStartedSelected = () => {
  emits('startedSelected', started.value);
};

</script>