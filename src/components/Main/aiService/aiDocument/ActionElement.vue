<template>
  <div class="group mb-8 flex items-stretch my-2 border border-amber-200 rounded-lg">
    <div class="p-2 px-3 mr-2 bg-amber-200 hover:bg-amber-300 group-hover:bg-amber-300 rounded-lg ">
      액션
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
        <!-- <div>
          <button type='button' @click='handleClickDelete'
            class="text-red-700 px-4 rounded-lg hover:bg-red-500 hover:text-white">
            <Trash2 :size="20" :stroke-width="1" />
          </button>
        </div> -->
      </div>
      <div class="grid grid-cols-4 gap-2 p-2">
        <label :for="`fac-act`">설비</label>
        <div class="col-span-3">
          <Input v-model="fac" :id="`fac-act`" />
        </div>
        <label :for="`tag-act`">태그</label>
        <div class="col-span-3">
          <Input v-model='tag' :id="`tag-act`" />
        </div>
        <label :for="`val-act`">수치값</label>
        <div class="col-span-3">
          <Input v-model='val' :id="`val-act`" />
        </div>
        <label :for="`unit-act`">단위값</label>
        <div class="col-span-3">
          <Input v-model='unit' :id="`unit-act`" />
        </div>
        <label :for="`range-act`">범위값</label>
        <div class="col-span-3">
          <Input v-model='range' :id="`range-act`" />
        </div>
        <label :for="`memo-act`">메모</label>
        <div class="col-span-3">
          <Input v-model='memo' :id="`memo-act`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { ClipboardType, ClipboardCopy, Copy, Trash2 } from "lucide-vue-next";

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

// const actionID = ref(props.action.actionID)
const fac = ref(props.action.fac)
const tag = ref(props.action.tag)
const val = ref(props.action.value)
const unit = ref(props.action.unit)
const range = ref(props.action.range)
const memo = ref(props.action.memo)


// console.log(props.action.actionID, props.action)
const emits = defineEmits();

const handleClickDelete = () => {
  // console.log("handleClickDelete() 호출")
  emits("delete-action", props.action.actionID)
}

</script>

<style></style>