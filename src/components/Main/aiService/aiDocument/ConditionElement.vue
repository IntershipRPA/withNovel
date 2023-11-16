<template>
  <div class="group flex items-stretch my-2 border rounded-lg bg-white">
    <div class="mr-2 bg-gray-200 hover:bg-gray-300 group-hover:bg-gray-300 rounded-lg p-2 justify-normal">
      조건{{ props.condition.conditionID }}
    </div>
    <div>
      <div class="border-b-2 flex justify-between p-2 pb-0">
        <div>
          <button type='button' ref="copyBtn" class="copy-btn text-blue-700 mr-2" @click='copyBtnClick'>
            <Copy :size="20" :stroke-width="1" />
          </button>
          <button type='button' ref="pasteBtn" class="paste-btn text-blue-700">
            <ClipboardCopy :size="20" :stroke-width="1" @click='pasteBtnClick' />
          </button>
        </div>
        <div>
          <button type='button' ref="deleteBtn" @click='handleClickDelete'
            class="text-red-700 p-1 -mt-1 rounded-full hover:bg-red-500 hover:text-white">
            <Trash2 :size="20" :stroke-width="1" />
          </button>
        </div>
      </div>
      <div :key="componentKey" class="grid grid-cols-4 gap-2 p-2">
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ClipboardType, ClipboardCopy, Copy, Trash2 } from "lucide-vue-next";
import tippy from "tippy.js";

import Input from './Input.vue'
import { AiData, Condition, Action } from '../../../lib/recipeData';
import { useAiDocumentStore } from '../../../../stores/aiDocument';
// import { useRecipeStore } from '../../../../stores/recipes';

const copyBtn = ref<HTMLDivElement | null>(null);
const pasteBtn = ref<HTMLDivElement | null>(null);
const deleteBtn = ref<HTMLDivElement | null>(null);
const componentKey = ref<number>(0);

const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성
// const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성

const props = defineProps({
  condition: {
    type: Object as () => Condition,
    required: true,
  },
})

const condition = ref(props.condition)
const fac = ref(props.condition.fac)
const tag = ref(props.condition.tag)
const val = ref(props.condition.val)
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

// 복사 붙여넣기 툴팁
onMounted(() => {
  // 마운트되면 tippy를 초기화합니다.
  initTippy();
});

function initTippy() {
  // ref로 참조된 요소를 확인하고 tippy를 적용합니다.
  if (copyBtn.value) {
    tippy(copyBtn.value, {
      // content: "복사",
      content: "<span class='opacity-60 text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-stone-800 text-white'>복사</span>",
      allowHTML: true
    });

    tippy(copyBtn.value, {
      // content: 'Global content',
      content: "<span class='opacity-60 text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-stone-800 text-white'>복사 완료!</span>",
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

    tippy(pasteBtn.value, {
      content: "<span class='opacity-60 text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-stone-800 text-white'>붙여넣기</span>",
      allowHTML: true,
    });

    tippy(pasteBtn.value, {
      content: "<span class='opacity-60 text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-stone-800 text-white'>붙여넣기 완료!</span>",
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

    tippy(deleteBtn.value, {
      content: "<span class='opacity-60 text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-stone-800 text-white'>삭제</span>",
      allowHTML: true,
    });
  }
}

// onMounted(() => {
//   tippy('.copy-btn', {
//     // content: "복사",
//     content: "<span class='text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-white'>복사</span>",
//     allowHTML: true
//   });

//   tippy('.copy-btn', {
//     // content: 'Global content',
//     content: "<span class='text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-white'>복사 완료!</span>",
//     arrow: true,
//     trigger: 'click',
//     hideOnClick: false,
//     allowHTML: true,
//     onShow(instance) {
//       setTimeout(() => {
//         instance.hide();
//       }, 1500);
//     }
//   });

//   tippy('.paste-btn', {
//     content: "<span class='text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-white'>붙여넣기</span>",
//     allowHTML: true,
//   });

//   tippy('.paste-btn', {
//     content: "<span class='text-sm px-2 p-1 rounded-lg shadow-md border-stone-200 bg-white'>붙여넣기 완료!</span>",
//     allowHTML: true,
//     arrow: true,
//     trigger: 'click',
//     hideOnClick: false,
//     onShow(instance) {
//       setTimeout(() => {
//         instance.hide();
//       }, 1500);
//     }
//   });

// })

// 복사
const copyBtnClick = () => {
  // console.log("copyBtnClick호출")
  aiDocumentStore.element = condition.value;
}

// 붙여넣기
const pasteBtnClick = () => {
  // console.log("pasteBtnClick호출")
  // console.log(aiDocumentStore.element)

  fac.value = aiDocumentStore.element.fac;
  tag.value = aiDocumentStore.element.tag;
  val.value = aiDocumentStore.element.val;
  unit.value = aiDocumentStore.element.unit;
  range.value = aiDocumentStore.element.range;
  memo.value = aiDocumentStore.element.memo;

  condition.value.fac = aiDocumentStore.element.fac;
  condition.value.tag = aiDocumentStore.element.tag;
  condition.value.val = aiDocumentStore.element.val;
  condition.value.unit = aiDocumentStore.element.unit;
  condition.value.range = aiDocumentStore.element.range;
  condition.value.memo = aiDocumentStore.element.memo;
  emits('update-condition', props.condition.conditionID, condition.value);
  componentKey.value += 1
}

watch(componentKey, () => {
  nextTick(() => {
    initTippy();
  });
});

</script>

<style>
.row {
  display: flex;
  flex-direction: row;
}
</style>