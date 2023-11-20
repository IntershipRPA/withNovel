<template>
  <div v-if="items.length > 0" ref="commandListContainer"
    class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded border border-stone-200 bg-white px-1 py-2 shadow-md transition-all">
    <button v-for="(item, index) in items"
      class="flex items-center w-full px-2 py-1 space-x-2 text-sm text-left rounded text-stone-900 hover:bg-stone-100"
      :class="index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''" :key="index" @click="selectItem(index)">
      <div class="flex items-center justify-center w-10 h-10 bg-white border rounded border-stone-200">
        <LoadingCircle v-if="item.title === 'Continue writing' && isLoading" />
        <!-- 아이콘 -->
        <!-- <component v-else :is="item.icon" size="18" /> -->
        <p>설비</p>
      </div>
      <div>
        <!-- 이름 -->
        <p class="font-medium">{{ item.title }}</p>
        <!-- 설명 -->
        <p class="text-xs text-stone-500">{{ item.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch, onMounted } from "vue";
import { Editor, Range } from "@tiptap/core";
import { SuggestionItem } from "./whelkExtension"; // type 지정
import LoadingCircle from "../../icons/loadingCircle.vue";
import { useCompletion } from "ai/vue";
import { getPrevText } from "../../../lib/editor";
import { useStorage } from "@vueuse/core";

// import axios from "axios";

const props = defineProps({
  items: {
    type: Array as PropType<SuggestionItem[]>,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  range: {
    type: Object as PropType<Range>,
    required: true,
  },
});

const selectedIndex = ref(0);

const { complete, isLoading } = useCompletion({
  id: "novel",
  api: "/api/generate",
  onResponse: (_) => {
    props.editor.chain().focus().deleteRange(props.range).run();
  },
  onFinish: (_prompt, completion) => {
    // highlight the generated text
    props.editor.commands.setTextSelection({
      from: props.range.from,
      to: props.range.from + completion.length,
    });
  },
  onError: (e) => {
    console.error(e);
  },
});

const commandListContainer = ref<HTMLDivElement>();

const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
function onKeyDown(e: KeyboardEvent) {
  if (navigationKeys.includes(e.key)) {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      selectedIndex.value =
        (selectedIndex.value + props.items.length - 1) % props.items.length;
      scrollToSelected();
      return true;
    }
    if (e.key === "ArrowDown") {
      selectedIndex.value = (selectedIndex.value + 1) % props.items.length;

      scrollToSelected();
      return true;
    }
    if (e.key === "Enter") {
      selectItem(selectedIndex.value);
      return true;
    }
    return false;
  }
}

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0;
  }
);

defineExpose({
  onKeyDown,
});

function selectItem(index: number) {
  const item = props.items[index];
  // localStorage.removeItem('whelk');  
  // console.log(`설비 : ${props.items[index].title}`);
  // // 로컬스토리지에 설비 선택한거 저장
  // useStorage('whelk', item.title);

  if (item) {
    if (item.title === "Continue writing") {
      
      if (isLoading.value) return;
      complete(
        getPrevText(props.editor, {
          chars: 5000,
          offset: 1,
        })
      );
    } else {
      props.command(item);
    }
  }
}

function updateScrollView(container: HTMLElement, item: HTMLElement) {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
}

function scrollToSelected() {
  const container = commandListContainer.value;
  const item = container?.children[selectedIndex.value] as HTMLElement;

  if (container && item) {
    updateScrollView(container, item);
  }
}

// const responseData = ref(null); // API 응답 데이터를 저장할 변수

// // API 인증 키 (API Key) 설정
// const apiKey = '2VUsy8DXgU7UltYDHQ+drH9T6gf4M5cWgEzh67DXRJwjfzWrQFnEGl6To3ODDZzLbXf+Pm/Z7awxIaIlRALQAQ=='; // 실제 API 키로 대체해야 합니다.
// const apiEndpoint = 'http://api.odcloud.kr/api/15072603/v1/uddi:c470f155-2d53-4feb-87cd-ff010c6a315d'; // 사용하려는 API의 엔드포인트 URL

// const fetchData = async () => {
//   try {
//     const response = await axios.get(apiEndpoint, {
//       params: {
//         serviceKey: apiKey, // API 키를 요청 매개변수로 추가
//         // 다른 요청 매개변수도 필요한 경우 여기에 추가
//         page: 1,
//         perPage: 5
//       },
//     });

//     // API 응답 데이터 처리
//     console.log(response.data.data);
//     // console.log(Array.isArray(response.data));
//     response.data.data.map((item: any) => { 
//       console.log(item.기인물명상세); 
//       console.log(item.기인물명상세코드); 
//       console.log(item.기인물명); 
//     });
//     responseData.value = response.data; // API 응답 데이터 저장
//   } catch (error) {
//     console.error('API 호출 중 오류 발생:', error);
//   }
// };

// // 컴포넌트가 마운트된 후 API 데이터 가져오기
// onMounted(() => {
//   fetchData();
// });
</script>
