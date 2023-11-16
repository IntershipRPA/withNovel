<template>
  <div class="spinner flex-col">
    <div class="spinner-wrapper z-10" >
    </div>
    <div class="text-white text-lg font-extrabold z-20 mb-6">ai 요청 진행중입니다.</div>
    <LoadingCircle :dimensions='"w-12 h-12"' class='z-20'/>
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
</style>