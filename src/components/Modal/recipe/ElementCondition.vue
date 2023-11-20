<template>
  <div class='flex items-center'>
    <span class='rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 flex items-center bg-gray-400'>
      <!-- 셀렉 박스 -->
      <select :name='`selected-value-${num}`'
        class="cursor-pointer h-full rounded border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm"
        v-model="condition.andOr" @change="handleSelectedValueChange(condition)">
        <option selected disabled>조건선택</option>
        <option v-for="option in props.groups" :key="option">{{ option }}</option>
        <option>그룹 추가+</option>
      </select>
    </span>
    <!-- 조건 내용 -->
    <span class='flex items-center rounded shadow-md bg-zinc-100 z-10 py-1 px-8 mb-2 mt-2 '>
      {{ condition.text }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import { onBeforeUpdate, onUpdated, ref } from 'vue';


const props = defineProps({
  condition: {
    type: Object as () => Condition,
    required: true,
  },
  num: {
    type: Number,
    required: false,
  },
  groups: {
    type: Array as () => string[],
    required: true,
  }
})

interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: number,
}

// function findMax(arr: string[]): number | undefined {
//   console.log("here",arr)
//   const numbers: number[] = arr.map(Number); // 문자열 배열을 숫자 배열로 변환
//   if (numbers.length === 0) return undefined; // 빈 배열이라면 undefined 반환
//   return Math.max(...numbers); // 숫자 배열에서 최댓값 반환
// }

function findMax(arr: string[]): number | undefined {
  const pattern = /^그룹(\d+)$/; // '그룹'과 숫자로 이루어진 패턴
  let maxNumber: number | undefined;

  arr.forEach(item => {
    const match = item.match(pattern); // 정규식과 매칭되는 부분 찾기
    if (match) {
      const currentNumber = Number(match[1]); // 매칭된 숫자 추출
      if (maxNumber === undefined || currentNumber > maxNumber) {
        maxNumber = currentNumber; // 최댓값 갱신
      }
    }
  });

  return maxNumber;
}

// 선택된 값이 변경될 때 처리
const handleSelectedValueChange = (condition) => {
  // console.log("변경됨", condition)
  if (condition.andOr === 'AND') {
    // console.log("Selected AND")
    condition.group = 'andGroup';
    emits('update-sharedData', condition.group); // 부모에게 변경을 알림
  }

  if (condition.andOr === 'OR') {
    // console.log("Selected OR")
    condition.group = 'orGroup';
    emits('update-sharedData', condition.group); // 부모에게 변경을 알림
  }

  if (condition.andOr === '그룹 추가+') {
    console.log("Selected 그룹 추가+")
    console.log(props.groups); // 가장 큰 값 출력

    const maxNumber: number | undefined = findMax(props.groups);
    console.log(maxNumber); // 가장 큰 값 출력
    if (maxNumber !== undefined) {
      console.log(props.groups);
      condition.group = `그룹${String(maxNumber + 1)}`;
      condition.andOr = `그룹${String(maxNumber + 1)}`;
    }
    emits('add-group', condition.group); // 부모에게 변경을 알림
  }
  else {
    console.log(condition.andOr)
    condition.group = condition.andOr;

    emits('update-group', condition.group); // 부모에게 변경을 알림
  }
};

// 이벤트 에미터를 통해 부모에게 변경 사항을 알림
const emits = defineEmits(['update-sharedData', 'add-group', 'update-group']);

</script>