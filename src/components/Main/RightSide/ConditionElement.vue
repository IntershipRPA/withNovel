<template>
  <div class="group flex items-stretch my-2 border rounded-lg">
    <div class="mr-2 bg-gray-200 hover:bg-gray-300 group-hover:bg-gray-300 rounded-lg p-2">
      조건{{ conditionID }}
    </div>
    <div class="grid grid-cols-4 gap-2 p-2">
      <label :for="`fac-con-${conditionID}`">설비</label>
      <div class="col-span-3">
        <Input v-model="fac" :id="`fac-con-${conditionID}`" />
      </div>
      <label :for="`tag-con-${conditionID}`">태그</label>
      <div class="col-span-3">
        <Input v-model='tag' :id="`tag-con-${conditionID}`" />
      </div>
      <label :for="`val-con-${conditionID}`">수치값</label>
      <div class="col-span-3">
        <Input v-model='val' :id="`val-con-${conditionID}`" />
      </div>
      <label :for="`unit-con-${conditionID}`">단위값</label>
      <div class="col-span-3">
        <Input v-model='unit' :id="`unit-con-${conditionID}`" />
      </div>
      <label :for="`range-con-${conditionID}`">범위값</label>
      <div class="col-span-3">
        <Input v-model='range' :id="`range-con-${conditionID}`" />
      </div>
      <label :for="`memo-con-${conditionID}`">메모</label>
      <div class="col-span-3">
        <Input v-model='memo' :id="`memo-con-${conditionID}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Input from './Input.vue'
import { Recipe, Condition, Action } from '../../../lib/recipeData';

const props = defineProps({
  condition: {
    type: Object as () => Condition,
    required: true,
  },
})

// const fac = ref('Comp Motor')
// const tag = ref('Winding Temp')
// const val = ref('50')
// const unit = ref('화씨')
// const range = ref('미만')
// const memo = ref('모터 권선이 소손되지 않도록 주의')

const conditionID = ref(props.condition.conditionID)
const fac = ref(props.condition.fac)
const tag = ref(props.condition.tag)
const val = ref(props.condition.value)
const unit = ref(props.condition.unit)
const range = ref(props.condition.range)
const memo = ref(props.condition.memo)

console.log(props.condition.conditionID, props.condition)

</script>

<style>
.row {
  display: flex;
  flex-direction: row;
}
</style>