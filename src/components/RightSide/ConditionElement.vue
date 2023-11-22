<template>
  <div class="flex items-stretch my-4 border rounded">
    <div class="mr-4 bg-gray-200 hover:bg-gray-300 rounded p-2">
      조건1
    </div>
    <div class="grid grid-cols-4 gap-2 p-2">
      <div>설비</div>
      <div class="col-span-3">
        <Input v-model='fac' />
      </div>
      <div>태그</div>
      <div class="col-span-3">
        <Input v-model='tag' />
      </div>
      <div>수치값</div>
      <div class="col-span-3">
        <Input v-model='val' />
      </div>
      <div>단위값</div>
      <div class="col-span-3">
        <Input v-model='unit' />
      </div>
      <div>범위값</div>
      <div class="col-span-3">
        <Input v-model='range' />
      </div>
      <div>메모</div>
      <div class="col-span-3">
        <Input v-model='memo' />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Input from './Input.vue'

const fac = ref('Comp Motor')
const tag = ref('Winding Temp')
const val = ref('50')
const unit = ref('화씨')
const range = ref('미만')
const memo = ref('모터 권선이 소손되지 않도록 주의')

</script>

<style>
.row {
  display: flex;
  flex-direction: row;
}
</style>