<template>
  <div class="text-red-600 text-center py-2 mb-2 border border-red-600 rounded-lg flex justify-center ">
    <AlertTriangle class="mr-2 h-6 w-6 " />{{ props.message }}
  </div>
</template>

<script setup lang='ts'>
import { AlertTriangle } from "lucide-vue-next";

const props = defineProps({
  message: {
    type: String,
    required: true,
    default: "메세지 전달 없음",
  }
})
</script>

<style></style>