<template>
  <div class="group flex items-stretch my-2 border border-amber-200 rounded-lg">
    <div class="mr-2 bg-amber-200 hover:bg-amber-300 group-hover:bg-amber-300 rounded-lg p-2">
      액션{{ actionID }}
    </div>
    <div class="grid grid-cols-4 gap-2 p-2">
      <label :for="`fac-act-${actionID}`">설비</label>
      <div class="col-span-3">
        <Input v-model="fac" :id="`fac-act-${actionID}`" />
      </div>
      <label :for="`tag-act-${actionID}`">태그</label>
      <div class="col-span-3">
        <Input v-model='tag' :id="`tag-act-${actionID}`" />
      </div>
      <label :for="`val-act-${actionID}`">수치값</label>
      <div class="col-span-3">
        <Input v-model='val' :id="`val-act-${actionID}`" />
      </div>
      <label :for="`unit-act-${actionID}`">단위값</label>
      <div class="col-span-3">
        <Input v-model='unit' :id="`unit-act-${actionID}`" />
      </div>
      <label :for="`range-act-${actionID}`">범위값</label>
      <div class="col-span-3">
        <Input v-model='range' :id="`range-act-${actionID}`" />
      </div>
      <label :for="`memo-act-${actionID}`">메모</label>
      <div class="col-span-3">
        <Input v-model='memo' :id="`memo-act-${actionID}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Input from './Input.vue'
import { Recipe, Condition, Action } from '../../../lib/recipeData';

const props = defineProps({
  action: {
    type: Object as () => Action,
    required: true,
  },
})

// const fac = ref('Comp Motor')
// const tag = ref('Winding Temp')
// const val = ref('50')
// const unit = ref('화씨')
// const range = ref('미만')
// const memo = ref('모터 권선이 소손되지 않도록 주의')

const actionID = ref(props.action.actionID)
const fac = ref(props.action.fac)
const tag = ref(props.action.tag)
const val = ref(props.action.value)
const unit = ref(props.action.unit)
const range = ref(props.action.range)
const memo = ref(props.action.memo)


console.log(props.action.actionID, props.action)

</script>

<style></style>