<template>
  <div>
    <input type="text" v-model="message" class='border-black border-2 border-solid' />
    <button type="button" @click="handleOnClick">AI요청</button>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const message = ref("");

const handleOnClick = async () => {
  console.log("AI요청 버튼 클릭");

  const url = "http://127.0.0.1:5000/bard"; 
  const requestData = {
    message: message.value, 
  };

  try {
    const response = await axios.post(url, requestData);
    console.log("응답 데이터:", response.data);
  } catch (error) {
    console.error("오류 발생:", error);
  }
};
</script>
