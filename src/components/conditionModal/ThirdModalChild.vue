<template>
  <div>
    <!-- {{ message3 }} -->
    <!-- <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label> -->
    <div class="relative mt-2 rounded-md shadow-sm">

      <input type="text" name="price" id="price"
        class="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="00.00">
      <div class="pointer-events-none absolute inset-y-0 left-12 bottom-0.5 flex items-center pl-3">
        <span class="text-gray-500 sm:text-sm">℃</span>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center">
        <!-- <label for="currency" class="sr-only">Currency</label> -->
        <select id="currency" name="currency"
          class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
          <option>이상</option>
          <option>이하</option>
          <option>초과</option>
          <option>미만</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  message3: { type: String, default: "test3 message" }
})



</script>