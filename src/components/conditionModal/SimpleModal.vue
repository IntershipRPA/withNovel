<template>
  <div class="modal">
    <div class="modal-wrapper" @click="closeModal">
    </div>
    <div class="modal-content" @click.stop="stopPropagation">
      <!-- X 버튼 -->
      <button type="button" @click.stop="closeModal"
        class="close-btn bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <span class="sr-only">Close menu</span>
        <!-- Heroicon name: outline/x -->
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <!-- 본문 -->
      <div class="modal-family text-lg">
        <div class="first p-2.5 content-center">
          <p>{{ whelkMsg }}</p>
        </div>
        <div class="second p-2.5 content-center">
          <p>{{ tagMsg }}</p>
          <!-- <p>선택 태그</p> -->
        </div>
        <ThirdModalChild class='third p-2.5 content-center'/>
        <MiniEditor class='p-2.5 content-center '/>
      </div>
      <button @click.stop="closeModal" type="button"
        class="confirm-btn text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">완료</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import MiniEditor from './minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';

const whelkMsg = localStorage.getItem('whelk')
const tagMsg = localStorage.getItem('tag')

const props = defineProps({
  whelkMsg: { type: String, default: "test whelkMsg" },
  tagMsg: { type: String, default: "test tagMsg" }
})

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const stopPropagation = (event) => {
  event.stopPropagation();
};
</script>

<style scoped>
.modal {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 100%;
}

.modal-content {
  z-index: 1;
  position: relative;
  width: 820px;
  height: 280px;
  background-color: white;
  border-radius: 10px;
  /* background: rgba(255, 255, 255, 0.3); */
  backdrop-filter: blur(240px);
}

.close-btn {
  position: absolute;
  right: 0px;
  top: 0px;
}

.confirm-btn {
  position: absolute;
  right: 50px;
  bottom: 20px;
}

.modal-family {
  display: flex;
  /* 또는 inline-flex */
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /* 수평 방향으로 아이템을 정렬 */
  /* left: 50%;  */
  /* transform: translateX(-50%); */
  /* top: 14%; */
  margin: auto;
  margin-top: 60px;
  width: 742px;
  height: 150px;
  /* background-color: aquamarine; */
}
.first {
  background-color: #ffc5e4;
}

.second {
  background-color: #bedcff;
}

.third {
  /* background-color: rgb(145, 150, 255); */
}</style>