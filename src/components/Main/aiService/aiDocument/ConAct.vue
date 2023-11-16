<template>
  <div>
    <ConActGroupHeader :groupKey='$props.groupKey' />
    <!-- 조건 -->
    <ConditionElement v-for="condition in conditions" :key="condition.conditionID" :condition='condition'
      @deleteCondition='deleteCondition' @updateCondition='updateCondition' />
    <!-- 조건이 1개라도 없을 때 -->
    <AtLestOneWarning v-if='isAtLeastOneCondition' :message='"조건이 없습니다. 조건을 추가하세요."' />
    <!-- 조건 추가 버튼 -->
    <div @click='handleClickAddCondition'
      class="bg-gray-100 hover:bg-gray-300 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2 " />조건 추가
    </div>
    <!-- 액션 -->
    <!-- <ActionElement v-for="action in actions" :key="action.actionID" :action='action' 
      @deleteAction='deleteAction' /> -->
    <!-- 액션이 1개라도 없을 때 -->
    <!-- <AtLestOneWarning v-if='isAtLeastOneAction' :message='"액션이 없습니다. 액션을 추가하세요."' /> -->
    <!-- 액션 추가 버튼 -->
    <!-- <div @click='handleClickAddAction'
      class="bg-amber-100 hover:bg-amber-300 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2" />액션 추가
    </div> -->
  </div>
</template>

<script setup lang='ts'>
import ConditionElement from './ConditionElement.vue'
import ActionElement from './ActionElement.vue'
import { AiData, Condition, Action } from '../../../lib/recipeData';
import AtLestOneWarning from './AtLestOneWarning.vue';
import ConActGroupHeader from './ConActGroupHeader.vue';
import { PlusSquare, AlertTriangle } from "lucide-vue-next";
import { computed, ref, watch, reactive } from 'vue';

// console.log("ConAct.vue is mounted")

const props = defineProps({
  groupKey: {
    type: Number,
    required: true,
  },
  conditions: {
    type: Array as () => Condition[],
    required: true,
  },
  // actions: {
  //   type: Array as () => Action[],
  //   required: true,
  // },
  aiData: {
    type: Object as () => AiData,
  }
})

// console.log("GroupNum:", props.groupKey, "conditions:", props.conditions, "actions:", props.actions)

const isAtLeastOneCondition = ref(props.conditions.length === 0)
// const isAtLeastOneAction = ref(props.actions.length === 0)

const conditions = ref(props.conditions)
// const actions = ref(props.actions)
const aiData = ref(props.aiData)
// const aiData = reactive(props.aiData);

// watch([() => props.conditions, () => props.actions, () => props.aiData], ([newConditions, newActions, newAiData], [oldConditions, oldActions, oldAiData]) => {
watch([() => props.conditions, () => props.aiData], ([newConditions, newAiData], [oldConditions, oldAiData]) => {
  // // props.parentProp가 변경되면 호출되는 콜백 함수
  // console.log('Conditions 변경:', oldConditions, '->', newConditions);
  // console.log('Actions 변경:', oldActions, '->', newActions);

  conditions.value = newConditions;
  // actions.value = newActions;
  aiData.value = newAiData;
});

// 자식컴포넌트로부터 데이터가 업데이트 되면
const emits = defineEmits();

const handleClickAddCondition = () => {
  console.log("조건 추가 버튼 clicked")
  addCondition();
}

// 조건 추가
const addCondition = () => {
  if (aiData && aiData.value) {
    const maxConditionID: number = computed(() => Math.max(...conditions.value.map((item: Condition) => item.conditionID))).value;

    const newCondition: Condition = {
      conditionID: maxConditionID + 1, // 부모로부터 가장 마지막 조건 ID 받아와야함
      andGroup: props.groupKey,
      fac: '',
      tag: '',
      value: '',
      unit: '',
      range: '',
      memo: '',
    }
    // conditions.value = [...conditions.value, newCondition]
    aiData.value.conditions.push(newCondition);

    // 데이터 업데이트를 부모에게 전달
    emits("update-data", aiData.value)
  } else {
    console.warn("aiData is undefined");
  }
}


// 조건 삭제
const deleteCondition = (targetID: number) => {
  if (aiData && aiData.value) {
    // conditionID를 받아서 인덱스 추출
    const indexToRemove = aiData.value.conditions.findIndex((condition: Condition) => condition.conditionID === targetID);
    // console.log(indexToRemove, "삭제")
    if (indexToRemove !== -1) {
      aiData.value.conditions.splice(indexToRemove, 1);

      // 삭제 후 빈 자리를 채우기 위해 id 재조정
      for (let i = indexToRemove; i < aiData.value.conditions.length; i++) {
        aiData.value.conditions[i].conditionID = i + 1;
      }
    }
    emits("update-data", aiData.value)
  } else {
    console.warn("aiData is undefined");
  }
}

// 조건 업데이트
const updateCondition = (targetID: number, updatedCondition: Condition) => {
  console.log("updateCondition호출")
  if (aiData && aiData.value) {
    // conditionID를 받아서 인덱스 추출
    const indexToUpdate = aiData.value.conditions.findIndex((condition: Condition) => condition.conditionID === targetID);
    // console.log(indexToUpdate, "업데이트")
    // console.log(updatedCondition)
    if (indexToUpdate !== -1) {
      // aiData.value = { ...aiData.value, conditions: [...aiData.value.conditions] };
      aiData.value.conditions[indexToUpdate] = updatedCondition
    }
    emits("update-data", aiData.value)
  } else {
    console.warn("aiData is undefined");
  }
}

</script>

<style></style>