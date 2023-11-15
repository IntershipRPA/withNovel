<template>
  <div class="spinner">
    <div class="spinner-wrapper" >
    </div>
    <span class="text-white">ai 요청 진행중입니다.</span>
    <LoadingCircle :dimensions='"w-12 h-12"' />
  </div>
</template>

<script setup lang='ts'>
import LoadingCircle from '../icons/loadingCircle.vue';
</script>

<style scoped>
.spinner {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}

.spinner-wrapper {
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
  min-width: 820px;
  max-width: 1080px;
  min-height: 280px;
  max-height: 630px;
  background-color: white;
  border-radius: 10px;
  /* background: rgba(255, 255, 255, 0.3); */
  backdrop-filter: blur(240px);
}
</style>