<template>
  <div class="group mb-8 flex items-stretch my-2 border border-amber-200 rounded">
    <div class="p-2 px-3 mr-2 bg-amber-200 hover:bg-amber-300 group-hover:bg-amber-300 rounded ">
      액션
    </div>
    <div>
      <div class="border-b-2 flex justify-between p-2 pb-0">
        <div>
          <button type='button' class="copy-btn text-blue-700 mr-2">
            <Copy :size="20" :stroke-width="1" @click='copyBtnClick' />
          </button>
          <button type='button' class="paste-btn text-blue-700">
            <ClipboardCopy :size="20" :stroke-width="1" @click='pasteBtnClick' />
          </button>
        </div>
        <!-- <div>
          <button type='button' @click='handleClickDelete'
            class="text-red-700 px-4 rounded hover:bg-red-500 hover:text-white">
            <Trash2 :size="20" :stroke-width="1" />
          </button>
        </div> -->
      </div>
      <div :key="componentKey" class="grid grid-cols-4 gap-2 p-2">
        <label :for="`fac-act`">설비</label>
        <div class="col-span-3">
          <Input v-model="fac" :id="`fac-act`" @change="onFacUpdated" />
        </div>
        <label :for="`tag-act`">태그</label>
        <div class="col-span-3">
          <Input v-model='tag' :id="`tag-act`" @change="onTagUpdated" />
        </div>
        <label :for="`val-act`">수치값</label>
        <div class="col-span-3">
          <Input v-model='val' :id="`val-act`" @change="onValUpdated" />
        </div>
        <label :for="`unit-act`">단위값</label>
        <div class="col-span-3">
          <Input v-model='unit' :id="`unit-act`" @change="onUnitUpdated" />
        </div>
        <label :for="`range-act`">범위값</label>
        <div class="col-span-3">
          <Input v-model='range' :id="`range-act`" @change="onRangeUpdated" />
        </div>
        <label :for="`memo-act`">메모</label>
        <div class="col-span-3">
          <Input v-model='memo' :id="`memo-act`" @change="onMemoUpdated" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { ClipboardType, ClipboardCopy, Copy, Trash2 } from "lucide-vue-next";
import tippy from "tippy.js";

import Input from './Input.vue'
import { AiData, Condition, Action } from '../../../lib/recipeData';
import { useAiDocumentStore } from '../../../../stores/aiDocument';

const componentKey = ref<number>(0);

const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성

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

const action = ref(props.action)
const fac = ref(props.action.fac)
const tag = ref(props.action.tag)
const val = ref(props.action.val)
const unit = ref(props.action.unit)
const range = ref(props.action.range)
const memo = ref(props.action.memo)


// console.log(props.action.actionID, props.action)
const emits = defineEmits();

// const handleClickDelete = () => {
//   // console.log("handleClickDelete() 호출")
//   emits("delete-action", props.action.actionID)
// }

const onFacUpdated = (e) => {
  action.value.fac = e.target.value;
  emits('update-action', action.value);
};
const onTagUpdated = (e) => {
  action.value.tag = e.target.value;
  emits('update-action', action.value);
};
const onValUpdated = (e) => {
  action.value.val = e.target.value;
  emits('update-action', action.value);
};
const onUnitUpdated = (e) => {
  action.value.unit = e.target.value;
  emits('update-action', action.value);
};
const onRangeUpdated = (e) => {
  action.value.range = e.target.value;
  emits('update-action', action.value);
};
const onMemoUpdated = (e) => {
  action.value.memo = e.target.value;
  emits('update-action', action.value);
};

// 복사 붙여넣기 툴팁
onMounted(() => {
  tippy('.copy-btn', {
    // content: "복사",
    content: "<span class='opacity-60 text-sm px-2 p-1 rounded shadow-md border-stone-200 bg-white bg-stone-800 text-white'>복사</span>",
    allowHTML: true
  });

  tippy('.copy-btn', {
    // content: 'Global content',
    content: "<span class='opacity-60 text-sm px-2 p-1 rounded shadow-md border-stone-200 bg-white bg-stone-800 text-white'>복사 완료!</span>",
    arrow: true,
    trigger: 'click',
    hideOnClick: false,
    allowHTML: true,
    onShow(instance) {
      setTimeout(() => {
        instance.hide();
      }, 1500);
    }
  });

  tippy('.paste-btn', {
    content: "<span class='opacity-60 text-sm px-2 p-1 rounded shadow-md border-stone-200 bg-white bg-stone-800 text-white'>붙여넣기</span>",
    allowHTML: true,
  });

  tippy('.paste-btn', {
    content: "<span class='opacity-60 text-sm px-2 p-1 rounded shadow-md border-stone-200 bg-white bg-stone-800 text-white'>붙여넣기 완료!</span>",
    allowHTML: true,
    arrow: true,
    trigger: 'click',
    hideOnClick: false,
    onShow(instance) {
      setTimeout(() => {
        instance.hide();
      }, 1500);
    }
  });
})

// 복사
const copyBtnClick = () => {
  // console.log("copyBtnClick호출")
  aiDocumentStore.element = action.value;
}

// 붙여넣기
const pasteBtnClick = () => {
  // console.log("pasteBtnClick호출")
  
  fac.value = aiDocumentStore.element.fac;
  tag.value = aiDocumentStore.element.tag;
  val.value = aiDocumentStore.element.val;
  unit.value = aiDocumentStore.element.unit;
  range.value = aiDocumentStore.element.range;
  memo.value = aiDocumentStore.element.memo;
  
  action.value.fac = aiDocumentStore.element.fac;
  action.value.tag = aiDocumentStore.element.tag;
  action.value.val = aiDocumentStore.element.val;
  action.value.unit = aiDocumentStore.element.unit;
  action.value.range = aiDocumentStore.element.range;
  action.value.memo = aiDocumentStore.element.memo;

  console.log(action.value)
  emits('update-action', action.value);
  componentKey.value += 1

}

</script>

<style></style>