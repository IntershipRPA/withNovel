<template>
  <div class="group flex items-stretch my-2 border rounded-lg">
    <div class="mr-2 bg-gray-200 hover:bg-gray-300 group-hover:bg-gray-300 rounded-lg p-2 justify-normal">
      조건{{ props.condition.conditionID }}
    </div>
    <div>
      <div class="border-b-2 flex justify-between p-2 pb-0">
        <div>
          <button type='button' class="text-blue-700 mr-2">
            <Copy :size="20" :stroke-width="1" />
          </button>
          <button type='button' class="text-blue-700">
            <ClipboardCopy :size="20" :stroke-width="1" />
          </button>
        </div>
        <div>
          <button type='button' @click='handleClickDelete'
            class="text-red-700 px-4 rounded-lg hover:bg-red-500 hover:text-white">
            <Trash2 :size="20" :stroke-width="1" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2 p-2">
        <label :for="`fac-con-${props.condition.conditionID}`">설비</label>
        <div class="col-span-3">
          <Input v-model="fac" :id="`fac-con-${props.condition.conditionID}`" @change="onFacUpdated" />
        </div>
        <label :for="`tag-con-${props.condition.conditionID}`">태그</label>
        <div class="col-span-3">
          <Input v-model='tag' :id="`tag-con-${props.condition.conditionID}`" @change="onTagUpdated" />
        </div>
        <label :for="`val-con-${props.condition.conditionID}`">수치값</label>
        <div class="col-span-3">
          <Input v-model='val' :id="`val-con-${props.condition.conditionID}`" @change="onValUpdated" />
        </div>
        <label :for="`unit-con-${props.condition.conditionID}`">단위값</label>
        <div class="col-span-3">
          <Input v-model='unit' :id="`unit-con-${props.condition.conditionID}`" @change="onUnitUpdated" />
        </div>
        <label :for="`range-con-${props.condition.conditionID}`">범위값</label>
        <div class="col-span-3">
          <Input v-model='range' :id="`range-con-${props.condition.conditionID}`" @change="onRangeUpdated" />
        </div>
        <label :for="`memo-con-${props.condition.conditionID}`">메모</label>
        <div class="col-span-3">
          <Input v-model='memo' :id="`memo-con-${props.condition.conditionID}`" @change="onMemoUpdated" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { ClipboardType, ClipboardCopy, Copy, Trash2 } from "lucide-vue-next";

import Input from './Input.vue'
import { AiData, Condition, Action } from '../../../lib/recipeData';

const props = defineProps({
  condition: {
    type: Object as () => Condition,
    required: true,
  },
})

const condition = ref(props.condition)
const fac = ref(props.condition.fac)
const tag = ref(props.condition.tag)
const val = ref(props.condition.value)
const unit = ref(props.condition.unit)
const range = ref(props.condition.range)
const memo = ref(props.condition.memo)

// console.log(props.condition.conditionID, props.condition)
const emits = defineEmits();

const handleClickDelete = () => {
  // console.log("handleClickDelete() 호출")
  emits("delete-condition", props.condition.conditionID)
}

const onFacUpdated = (e) => {
  condition.value.fac = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};
const onTagUpdated = (e) => {
  condition.value.tag = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};
const onValUpdated = (e) => {
  condition.value.val = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};
const onUnitUpdated = (e) => {
  condition.value.unit = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};
const onRangeUpdated = (e) => {
  condition.value.range = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};
const onMemoUpdated = (e) => {
  condition.value.memo = e.target.value;
  emits('update-condition', props.condition.conditionID, condition.value);
};



</script>

<style>
.row {
  display: flex;
  flex-direction: row;
}</style>