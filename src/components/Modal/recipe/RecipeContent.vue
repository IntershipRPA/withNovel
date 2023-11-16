<template>
  <div class="modal-family text-lg flex flex-col">
    <RecipeNameVue :savedName='savedAttrs.recipeName' />
    <div class='mb-5 content-center bg-amber-100 flex items-center rounded-lg shadow-md h-10 px-8 p-5'>
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
      <div v-if="conditions.some(item => item.group === 'andGroup')" class="rounded-lg p-5 border-2 border-teal-400 mb-3">
        <span>AND 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 'andGroup')" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- OR 조건-->
      <div v-if="conditions.some(item => item.group === 'orGroup')" class="rounded-lg p-5 border-2 border-rose-600">
        <span>OR 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 'orGroup')" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- 초기 조건 목록 -->
      <div class="waitingCondition">
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 'notSelected')"
          :key="index" :condition='condition' :num="index" />
      </div>
    </div>
    <div class='my-3 flex items-center flex-wrap justify-center content-between'>
      <div class="rounded-lg px-5 py-2 border-2 mx-2 flex items-center my-2">
        <span class="text-gray-500">
          조건 불일치 알람 발생 :
        </span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'알람 내용을 작성하세요 …'"
          :storageKey="'recipe_alarmMsg'" :savedContent='savedAttrs.alarmMsg' />
      </div>
      <div class="rounded-lg px-5 py-2 border-2 mx-2 flex items-center my-2">
        <span class="text-gray-500">전달 담당자 :</span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'이름을 입력하세요.'"
          :storageKey="'recipe_alarmMsgTo'" :savedContent='savedAttrs.alarmMsgTo' />
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
import ConfirmBtn from '../ConfirmBtn.vue';
import DeleteBtn from '../DeleteBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import ElementCondition from './ElementCondition.vue';
import RecipeNameVue from './RecipeName.vue';
import { useStorage } from "@vueuse/core";
import { RecipeData } from "../../../lib/recipeData";
import { useRecipeStore } from "../../../stores/recipes";

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
  formData: {
    type: Object as () => RecipeData,
    required: true,
  },
})
const formData = ref(props.formData)
console.log(props.formData)
interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: string,
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
      group: 'notSelected',
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
  // 로컬스토리지 키 삭제
  localStorage.removeItem('recipe_name');
  localStorage.removeItem('recipe_alarmMsg');
  localStorage.removeItem('recipe_alarmMsgTo');
  modalStore.nodeViewProps = {}; // 레시피 노드정보 삭제

  modalStore.closeModal(); // 모달 닫기
};


// // "novel__content"에서 해당 노드 정보 불러오기
// const getContent = () => {
//   // const allData = props.editor.getJSON();
//   const location = props.editor.state.selection.$anchor; // 커서 위치 정보 가져오기
//   const locationNum = location?.path[1];
//   const contentObj = docs[locationNum];
//   return contentObj;
// };

// const savedContent = getContent();
const savedContent = modalStore.nodeViewProps?.node;

interface attrs {
  recipeName: string,
  action: string,
  andCondition: string,
  orCondition: string,
  alarmMsg: string,
  alarmMsgTo: string,
  auto: boolean,
  activated: boolean,
  // count: number,
}

const savedAttrs: attrs = {
  recipeName: savedContent?.attrs?.recipeName,
  action: savedContent?.attrs?.action,
  andCondition: savedContent?.attrs?.andCondition,
  orCondition: savedContent?.attrs?.orCondition,
  alarmMsg: savedContent?.attrs?.alarmMsg,
  alarmMsgTo: savedContent?.attrs?.alarmMsgTo,
  auto: savedContent?.attrs?.auto,
  activated: savedContent?.attrs?.activated,
  // count: savedContent?.attrs?.count,
}


// and조건과 or조건으로 이미 지정되어 있다면
// conditions에서 일치하는 text를 찾고 andOr을 부여하고 해당 그룹으로 위치를 이동시킨다.
if (savedAttrs.andCondition || savedAttrs.orCondition) {
  // string을 '$'로 구분하여 -> Array 로 바꾸는 함수
  function stringToArray(str, delimiter = '$') {
   
    if (typeof str === 'string') {
      return str.split(delimiter);
    } else {
      return [];
    }
  }

  // 비교 함수
  type AndOrType = 'AND' | 'OR';
  function findCommonElements(andOr: AndOrType, savedArr, arr) {
    if (andOr === 'AND') {
      for (const text of savedArr) {
        for (const obj of arr) {
          if (obj.text === text) {
            obj.andOr = 'AND';
            obj.group = 'andGroup';
          }
        }
      }
    }

    if (andOr === 'OR') {
      for (const text of savedArr) {
        for (const obj of arr) {
          if (obj.text === text) {
            obj.andOr = 'OR';
            obj.group = 'orGroup';
          }
        }
      }
    }
  }

  // and/or 세팅을 실행하기
  const andConditions = stringToArray(savedAttrs.andCondition)
  const orConditions = stringToArray(savedAttrs.orCondition)

  if (andConditions) {
    findCommonElements("AND", andConditions, conditions.value)
  }

  if (orConditions) {
    findCommonElements("OR", orConditions, conditions.value)
  }

}


const recipeStore = useRecipeStore();
// 레시피 저장
const saveRecipe = () => {
  const json = props.editor.getJSON();
  const getRecipes = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];

  // recipeID 계산하기
  const newRecipeID = getRecipes.length + 1;
  // 레시피 제목
  let recipeName = "";

  for(let item of json.content) {
    if(item.type === "recipeRule") {
        recipeName = item.attrs.recipeName;
        break;
    }
  }
  console.log(recipeName)


  const recipeData = {
    "recipeName": recipeName,
    "recipeID": newRecipeID,
    "recipeType": "formService",
    "content": {
      "text": json,
      "formDocument": formData.value
    }
  }

  getRecipes.push(recipeData)
  localStorage.setItem("recipes", JSON.stringify(getRecipes));

  recipeStore.forceReloadLeftSideComponent() // LeftSide화면 강제 리로드
}




// 완료버튼 클릭
const handleConfirm = () => {
  changeToRecipeNode(); //recipeRule 노드변경 함수
  closeModal();
  // getRecipe();
  saveRecipe();
};

// 조건 문자열 변환

const conditionsArrToString = (arr, andOr: string, delimiter = '$') => {
//  console.log("arr : ", arr); //레시피 등록할 때
 
  const conditionString = arr.filter(item => item?.andOr === andOr).map(item => item?.text);
  let str1 = "";
  let str2 = "";
  let str3 = "";

  if (conditionString.length > 0) {
    str1 = conditionString[0];
    str2 = conditionString[1];
    str3 = conditionString[2];
    // console.log("conditionString : ", conditionString[0])
    // console.log("conditionString : ", conditionString[1])
    // console.log("conditionString : ", conditionString[2])
    // console.log(str1);
    return conditionString.join(delimiter);
  } else {
    // console.log('레시피 내에', andOr, '조건 선택 없음');
    return '';
  }
  
}

// 현재 커서의 위치의 내용을 지울 범위 지정 함수
const getRange = () => {
  // 기존의 Tiptap 에디터 상태와 노드 가져오기
  const editorState = props.editor.view.state;
  const { selection } = editorState;

  // 현재 커서의 위치 가져오기
  const $cursor = selection?.$cursor;
  const from = $cursor.before($cursor.depth) + 1; // 행의 시작
  const to = $cursor.after($cursor.depth) - 1;   // 행의 끝

  return { from, to }
}
// 레시피 수정시 위로 올라가는거
const recipeChange = () => {
  // 기존의 Tiptap 에디터 상태와 노드 가져오기
  const editorState = props.editor.view.state;
  const { selection } = editorState;

  // 현재 커서의 위치 가져오기
  const $cursor = selection?.$cursor;
  const from = $cursor.before($cursor.depth) + 1; // 행의 시작 레시피제목 시작점
  const to = $cursor.after($cursor.depth) - 1;   // 행의 끝

  return { from, to }
}

// 레시피 노드 전환
const changeToRecipeNode = () => {
  const editor = props.editor;

  const attrs: attrs = {
    recipeName: localStorage.getItem("recipe_name"),
    action: action.value,
    andCondition: conditionsArrToString(conditions.value, 'AND'),
    orCondition: conditionsArrToString(conditions.value, 'OR'),
    alarmMsg: localStorage.getItem("recipe_alarmMsg"),
    alarmMsgTo: localStorage.getItem("recipe_alarmMsgTo"),
    auto: false,
    activated: false,
    // count: 0,
  }
  // console.log(attrs)
  // 이미 레시피가 있는 상태로 모달창을 열었는지 확인하는 함수
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  if (isEmptyObject(modalStore.nodeViewProps)) {
    // console.log("레시피 첫세팅")
    editor
      .chain()
      .focus()
      .deleteRange(getRange())
      .setRecipeRule(attrs)
      .run();
  
  } else {
     //   modalStore.nodeViewProps.deleteNode(); 
      // savedContent.exitCode();
      // editor.commands.exitCode()
      // modalStore.nodeViewProps.resetNode();
     console.log("레시피 수정")
// .deleteRange(getRange()) 범위지정 삭제
    editor
      .chain()
      .focus()
      .createParagraphNear()
      .deleteRange(recipeChange())
      .setRecipeRule(attrs)
      .run();
  }

};




const handleDelete = () => {
  deleteRecipeNode();
  closeModal();
};

const deleteRecipeNode = () => {

  modalStore.nodeViewProps.deleteNode()

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
  min-width: 900px;
  min-height: 150px;
  max-height: 480px;
  overflow-y: auto;

  margin-left: 16px;
  margin-right: 16px;
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