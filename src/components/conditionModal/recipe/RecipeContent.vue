<template>
  <div class="modal-family text-lg flex flex-col">
    <RecipeNameVue />
    <div class='mb-5 content-center bg-amber-100 flex items-center rounded-lg shadow-md h-10 px-8'>
      <!-- <span class="p-2.5">설비 Air Compressor</span>
      <span class="p-2.5">태그 Status</span>
      <span class="p-2.5">INIT: 일 때</span> -->
      <span>액션 : </span>
      <span>
        {{ action }}
      </span>
    </div>
    <div>
      <!-- AND 조건-->
      <div v-if="conditions.some(item => item.group === 1)" class="rounded-lg p-5 border-2 border-teal-400 mb-3">
        <span>AND 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 1)" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- OR 조건-->
      <div v-if="conditions.some(item => item.group === 2)" class="rounded-lg p-5 border-2 border-rose-600">
        <span>OR 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 2)" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- 초기 조건 목록 -->
      <div class="waitingCondition">
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 3)" :key="index"
          :condition='condition' :num="index" />
      </div>
    </div>
    <div class='my-5 flex items-center'>
      <div class="rounded-lg px-5 py-2 border-2 mx-2 flex items-center">
        <span class="text-gray-500">
          조건 불일치 알람 발생 :
        </span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'알람 내용을 작성하세요 …'"
          :storageKey="'recipe_alarmMsg'" />
      </div>
      <div class="rounded-lg px-5 py-2 border-2 mx-2 flex items-center">
        <span class="text-gray-500">전달 담당자 :</span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'이름을 입력하세요.'"
          :storageKey="'recipe_alarmMsgTo'" />
      </div>
    </div>
    <!-- <div>
      <ElementChecked />
    </div> -->
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
  <DeleteBtn @click.stop="handleDelete" />
</template>

<script setup lang="ts">
import { PropType, computed, onUpdated, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import DeleteBtn from '../DeleteBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import ElementCondition from './ElementCondition.vue';
import RecipeNameVue from './RecipeName.vue';
import ElementChecked from './ElementChecked.vue';
import { timestamp } from '@vueuse/core';

// onUpdated(() => {
//   // console.log("선택완료", selectedAndOr.value)
// });


const conditions = ref<Condition[]>([]);
const action = ref('DEFAULT ACTION TEXT');

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: number,
}

// 조건 가져오기
const docs = props.editor.getJSON()?.content;

if (docs) {
  const conditionElements = docs.filter((element) => element.type === "conditionRule");
  if (conditionElements.length > 0) {
    conditions.value = conditionElements.map((element) => ({
      text: element.content?.map(item => item.text).join(''),
      isChecked: false,
      andOr: '조건선택',
      group: 3
    }));
  } else {
    alert("조건이 지정되지 않았습니다.")
  }
}

// 액션 가져오기
if (docs) {
  const actionElements = docs.filter((element) => element.type === "actionRule");
  if (actionElements.length > 0) {
    action.value = actionElements[0].content?.map(item => item.text).join('');
    // action.value = actionElements[0].content[0].text;
  } else {
    alert("액션이 지정되지 않았습니다.")
  }
}



// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

// 완료버튼 클릭
const handleConfirm = () => {
  closeModal();
  changeToRecipeNode(); //recipeRule 노드변경 함수
};

// 조건 문자열 변환
const conditionsArrToString = (arr, andOr, delimiter = '$') => {
  const conditionString = arr.filter(item => item?.andOr === andOr).map(item => item?.text);
  return conditionString.join(delimiter);
}

// onUpdated(() => {

//   console.log(conditionsArrToString(conditions.value, 'AND'));
//   console.log(conditionsArrToString(conditions.value, 'OR'));
// })

// 레시피 노드 전환
const changeToRecipeNode = () => {
  const editor = props.editor;
  // const modalContent = localStorage.getItem('modal__content');
  const selection = editor.state.selection;
  // 커서가 있는 줄을 찾기
  const lineStart = selection.$from.before(1) // 현재 블록(줄) 시작 위치
  const lineEnd = selection.$from.after(1)   // 현재 블록(줄) 종료 위치
  // console.log("here@@@###!!!", lineStart, lineEnd);

  

  const attrs = {
    recipeName: localStorage.getItem("recipe_name"),
    action: action.value,
    // andCondition: 'test44',
    // orCondition: 'test44',
    andCondition: conditionsArrToString(conditions.value, 'AND'),
    orCondition: conditionsArrToString(conditions.value, 'OR'),
    alarmMsg: localStorage.getItem("recipe_alarmMsg"),
    alarmMsgTo: localStorage.getItem("recipe_alarmMsgTo"),
    auto: false,
    activated: false,
  }

  editor
    .chain()
    .focus()

    // .deleteRange({ from: lineStart, to: lineEnd })
    .setRecipeRule(attrs)

    .insertContent(`레시피 지정 완료`)
    .run();

  // 로컬스토리지 키 삭제
  localStorage.removeItem('recipe_name');
  localStorage.removeItem('recipe_alarmMsg');
  localStorage.removeItem('recipe_alarmMsgTo');
};




const handleDelete = () => {
  deleteRecipeNode();
  closeModal();
};

const deleteRecipeNode = () => {
  const editor = props.editor;

  // 삭제 전 객체로 저장
  const location = editor.state.selection.$anchor; // 커서 위치 정보 가져오기
  const locationNum = location?.path[1];
  const json = editor.getJSON();
  // 해당 노드의 정보를 담은 객체
  const contentObj = json?.content[locationNum];
  const contentText = contentObj?.content[0]?.text;

  // console.log("here", contentText);

  // 노드 삭제
  if (contentObj.type == "recipeRule") {
    editor.commands.unsetRecipe({
      text: contentText,
      editor: editor,
    });
  }
}

</script>

<style scoped>
.modal-family {
  /* justify-content: center; */
  align-items: center;
  /* flex-wrap: wrap; */
  margin: auto;
  margin-top: 60px;
  margin-bottom: 70px;
  min-width: 1080px;
  min-height: 150px;
  max-height: 480px;
  overflow-y: auto;
  /* background-color: aquamarine; */
}

.first {
  background-color: #ffc5e4;
}

.second {
  background-color: #bedcff;
}

.third {
  /* background-color: rgb(145, 150, 255); */
}
</style>