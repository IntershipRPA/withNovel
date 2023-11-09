<template>
  <div>
    <ConActGroupHeader />
    <!-- 조건 -->
    <ConditionElement v-for="condition in conditions" :key="condition.conditionID" :condition='condition' />
    <!-- 조건이 1개라도 없을 때 -->
    <AtLestOneWarning v-if='isAtLeastOneCondition' :message='"조건이 없습니다. 조건을 추가하세요."' />
    <!-- 조건 추가 버튼 -->
    <div
      class="bg-gray-100 hover:bg-gray-200 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2 " />조건 추가
    </div>
    <!-- 액션 -->
    <ActionElement v-for="action in actions" :key="action.actionID" :action='action' />
    <!-- 액션이 1개라도 없을 때 -->
    <AtLestOneWarning v-if='isAtLeastOneAction' :message='"액션이 없습니다. 액션을 추가하세요."' />
    <!-- 액션 추가 버튼 -->
    <div
      class="bg-amber-100 hover:bg-amber-200 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2" />액션 추가
    </div>
  </div>
</template>

<script setup lang='ts'>
import ConditionElement from './ConditionElement.vue'
import ActionElement from './ActionElement.vue'
import { Recipe, Condition, Action } from '../../../lib/recipeData';
import AtLestOneWarning from './AtLestOneWarning.vue';
import ConActGroupHeader from './ConActGroupHeader.vue';
import { PlusSquare, AlertTriangle } from "lucide-vue-next";
import { ref } from 'vue';

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
  actions: {
    type: Array as () => Action[],
    required: true,
  }
})

console.log("GroupNum:", props.groupKey, "conditions:", props.conditions, "actions:", props.actions)

const isAtLeastOneCondition = ref(props.conditions.length === 0)
const isAtLeastOneAction = ref(props.actions.length === 0)

</script>

<style></style>