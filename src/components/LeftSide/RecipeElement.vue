<template>
  <div
    class="flex relative justify-start p-2 mb-2 hover:bg-white border-stone-200 bg-gray-200 sm:rounded-lg sm:border text-sm cursor-pointer"
    @mouseover="showCloseButton = true" @mouseleave="showCloseButton = false">
    <span>레시피 {{ props.recipeKey }} {{ props.recipeName }}</span>
    <span v-if="showCloseButton" @click='handleClick'
    class="fixed absolute right-4 cursor-pointer rounded-full bg-transparent p-1 -mt-1 group hover:bg-red-500 ">
      <!-- <span class="rounded-full bg-transparent hover:bg-red-500"> -->
        <Trash2 :size="20" :stroke-width="1" class="text-red-500 group-hover:text-white" />
      <!-- </span> -->
    </span>
  </div>
  <!-- <span
      v-if="showCloseButton"
      class="text-red fixed absolute right-4 opacity-0 transition-opacity duration-300 pointer-events-none"
    >
      X
    </span> -->
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { ClipboardX, X, Trash2 } from 'lucide-vue-next';


const props = defineProps({
  recipeKey: {
    type: Number,
    required: true,
  },
  recipeName: {
    type: String,
    required: true,
  }
})

const showCloseButton = ref(false);

const emits = defineEmits();

const handleClick = () => {
  // console.log("레시피키", props.recipeKey)
  emits("discard-recipeKey", props.recipeKey)
}

</script>

<style scoped></style>