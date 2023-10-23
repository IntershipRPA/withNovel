<template>
  <div class='flex items-center' >
    <span class='rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 flex items-center bg-gray-400'>
      <!-- 셀렉 박스 -->
      <select :name='`selected-value-${num}`'
        class="cursor-pointer h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm"
        v-model="condition.andOr" @change="handleSelectedValueChange(condition)">
        <option selected disabled>조건선택</option>
        <option>AND</option>
        <option>OR</option>
      </select>
    </span>
    <!-- <span :class="condition.isChecked ? 'bg-sky-550' : 'bg-gray-500'" -->
    <!-- 체크 박스 -->
    <!-- <span class='rounded-l-lg shadow-md -z-4 h-10 px-3 pr-7 my-2 -mr-4 flex items-center bg-gray-300'>
      <input type="checkbox" class="cursor-pointer focus:outline-none w-6 h-6 rounded-lg" v-model="condition.isChecked" />
    </span> -->
    <!-- 조건 내용 -->
    <span class='flex items-center rounded-lg shadow-md bg-zinc-100 z-10 py-1 px-8 mb-2 mt-2 '>
      {{ condition.text }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { onBeforeUpdate, onUpdated, ref } from 'vue';

onUpdated(() => {
  // console.log("선택완료", props.num)
});

const props = defineProps({
  condition: {
    type: Object as () => Condition,
    required: true,
  },
  num: {
    type: Number,
    required: false,
  },
})

interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: number,
}

// 선택된 값이 변경될 때 처리
const handleSelectedValueChange = (condition) => {
  // console.log("변경됨", condition)
  if (condition.andOr === 'AND') {
    // console.log("Selected AND")
    condition.group = 1;
    emits('update:sharedData', condition.group); // 부모에게 변경을 알림
  }

  if (condition.andOr === 'OR') {
    // console.log("Selected OR")
    condition.group = 2;
    emits('update:sharedData', condition.group); // 부모에게 변경을 알림
  }
};

// 이벤트 엠미터를 통해 부모에게 변경 사항을 알림
const emits = defineEmits(['update:sharedData']);

</script>