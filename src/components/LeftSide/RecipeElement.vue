<template>
  <div
    class="flex relative justify-start p-2 mb-2 hover:bg-gray-200 border-stone-200 bg-white sm:rounded-lg sm:border text-sm"
    @mouseover="showCloseButton = true" @mouseleave="showCloseButton = false">
    <span>레시피 {{ props.recipeKey }}</span>
    <span v-if="showCloseButton" @click='handleClick'
    class="text-red-500 fixed absolute right-4 cursor-pointer">
      <Trash2 :size="20" :stroke-width="1" />
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