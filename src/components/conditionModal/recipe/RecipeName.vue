<template>
  <div class="rounded-lg px-5 py-2 border-2 mx-2 flex items-center my-5">
    <div class="text-gray-500">
      레시피 이름 :
    </div>
    <MiniEditor class="ml-4" :placeholder='"레시피 이름을 입력해주세요."' :storage-key='"recipe_name"' :savedContent='props.savedName' />
  </div>
</template>

<script setup lang='ts'>
import { onUpdated, ref } from 'vue';
import MiniEditor from '../minimalEditor/MiniEditor.vue';

const props = defineProps({
  savedName: {
    type: String, // 문자열 데이터 타입을 지정
  }
});


// const recipeName = ref<String>('');
// const updateRecipeName = (value: string) =>{
//   recipeName.value = value;
// }
// console.log(recipeName.value);
// onUpdated(() => {
//   console.log(recipeName.value);
// })
</script>