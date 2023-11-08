<template>
  <div>
    <ConditionElement v-for="condition in conditions" :key="condition.conditionID" :condition='condition' />
    <div class="bg-gray-100 hover:bg-gray-200 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2 " />조건 추가
    </div>
    <ActionElement v-for="action in actions" :key="action.actionID" :action='action' />
    <div class="bg-amber-100 hover:bg-amber-200 text-center py-2 mb-8 rounded-lg flex justify-center cursor-pointer text-gray-600 ">
      <PlusSquare class="mr-2" />액션 추가
    </div>
  </div>
</template>

<script setup lang='ts'>
import ConditionElement from './ConditionElement.vue'
import ActionElement from './ActionElement.vue'
import { Recipe, Condition, Action } from '../../../lib/recipeData';
import { PlusSquare } from "lucide-vue-next";

console.log("ConAct.vue is mounted")

const props = defineProps({
  conditions: {
    type: <Condition>[],
    required: true,
  },
  actions: {
    type: <Action>[],
    required: true,
  }
})

console.log(props.conditions)
console.log(props.actions)

</script>

<style></style>