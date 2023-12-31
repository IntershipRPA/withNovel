<template>
  <div class="modal-family text-lg flex flex-col">
    <RecipeNameVue :savedName='savedAttrs.recipeName' />
    <div class='mb-5 content-center bg-amber-100 flex items-center rounded shadow-md h-10 px-8 p-5'>
      <!-- <span class="p-2.5">설비 Air Compressor</span>
      <span class="p-2.5">태그 Status</span>
      <span class="p-2.5">INIT: 일 때</span> -->
      <span>액션 : </span>
      <span>
        {{ action }}
      </span>
    </div>
    <div>
      <!-- 그룹별 조건 -->
      <template v-for="group in groups">
        <div v-if="conditions.some(item => item.group === group)" :key="group"
          class="rounded p-5 border-2 border-teal-400 mb-3">
          <span>액션을 실행시키기 위한 조건 {{ group }}</span>
          <template v-for="(condition, index) in conditions.filter(item => item.group === group)" :key="index">
            <ElementCondition :condition='condition' :num="index" :groups='groups' @update-group='updateGroup'
              @add-group='addGroup' />
          </template>
        </div>
      </template>
      <!-- 초기 조건 목록 -->
      <div class="waitingCondition">
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 'notSelected')"
          :key="index" :condition='condition' :num="index" :groups='groups' @update-group='updateGroup'
          @add-group='addGroup' />
      </div>
    </div>
    <div class='my-3 flex items-center flex-wrap justify-center content-between'>
      <div class="rounded px-5 py-2 border-2 mx-2 flex items-center my-2">
        <span class="text-gray-500">
          조건 불일치 알람 발생 :
        </span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'알람 내용을 작성하세요 …'"
          :storageKey="'recipe_alarmMsg'" :savedContent='savedAttrs.alarmMsg' />
      </div>
      <div class="rounded px-5 py-2 border-2 mx-2 flex items-center my-2">
        <span class="text-gray-500">전달 담당자 :</span>
        <MiniEditor class='inline-block min-w-min max-w-xl ml-4' :placeholder="'이름을 입력하세요.'"
          :storageKey="'recipe_alarmMsgTo'" :savedContent='savedAttrs.alarmMsgTo' />
      </div>
    </div>
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
import { MenuItem } from '@headlessui/vue';

const conditions = ref<Condition[]>([]);
const groups = ref<String[]>([]);
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
// console.log(props.formData)s
interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: string,
}

// 그룹화된 배열 만들기
const buildGroups = (arr: { group: string }[]): string[] => {
  const pattern = /^그룹\d+$/; // 그룹과 숫자로 이루어진 패턴
  const uniqueGroups: Set<string> = new Set();

  arr.forEach(item => {
    const group = item.group.trim();
    if (pattern.test(group)) {
      uniqueGroups.add(group);
    }
  });

  // '그룹1' 초기세팅 (지정되어있는 그룹이 하나도 없는 경우)
  if (uniqueGroups.size === 0) {
    uniqueGroups.add('그룹1');
  }
  const sortedGroups = [...uniqueGroups].sort(); // Set을 배열로 변환하고 오름차순으로 정렬
  return sortedGroups;
};


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

    // 그룹화된 배열 만들기
    groups.value = buildGroups(conditions.value);
  } else {
    alert("조건이 지정되지 않았습니다.")
  }
}

// 액션 가져오기
if (docs) {
  const actionElements = docs.filter((element) => element.type === "actionRule");
  if (actionElements.length > 0) {
    action.value = actionElements[0].content?.map(item => item.text).join('');
  } else {
    alert("액션이 지정되지 않았습니다.")
  }
}

// 그룹 추가
const addGroup = (value) => {
  console.log("addGroup()호출", value)
  // 어떤 그룹의 요소가 하나도 남아있지 않다면 해당 그룹 삭제 후, 이후 그룹을 하나씩 위로 이동하기 
  // 예시) groups.value = [그룹1 ,그룹2, 그룹3]에서 그룹2 삭제 -> groups.value = [그룹1, 그룹2]
  groups.value = buildGroups(conditions.value);
}

// 그룹 업데이트
const updateGroup = (value) => {
  console.log("updateGroup()호출", value)
  // 어떤 그룹의 요소가 하나도 남아있지 않다면 해당 그룹 삭제 후, 이후 그룹을 하나씩 위로 이동하기
  groups.value = buildGroups(conditions.value);
  conditions.value = conditions.value.sort((a, b) => a.group.localeCompare(b.group)); // 가나다 오름차순
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

const savedContent = modalStore.nodeViewProps?.node;

interface attrs {
  recipeName: string,
  action: string,
  conditions: Condition[],
  alarmMsg: string,
  alarmMsgTo: string,
  auto: boolean,
  activated: boolean,
}

// recipeRule로 저장된 레시피 속성들 세팅하기
const savedAttrs: attrs = {
  recipeName: savedContent?.attrs?.recipeName || '',
  action: savedContent?.attrs?.action || '',
  conditions: savedContent?.attrs?.conditions || [],
  alarmMsg: savedContent?.attrs?.alarmMsg || '',
  alarmMsgTo: savedContent?.attrs?.alarmMsgTo || '',
  auto: savedContent?.attrs?.auto || false,
  activated: savedContent?.attrs?.activated || false,
}

// 조건 그룹 세팅
function setConditionGroups(savedArr, arr) {
  const uniqueGroups: Set<string> = new Set();
  for (const savedObj of savedArr) {
    uniqueGroups.add(savedObj.group);
    for (const obj of arr) {
      if (obj.text === savedObj.text) {
        obj.andOr = savedObj.andOr;
        obj.group = savedObj.group;
      }
    }
  }
  // '그룹1' 초기세팅 (지정되어있는 그룹이 하나도 없는 경우)
  if (uniqueGroups.size === 0) {
    uniqueGroups.add('그룹1');
  }

  const sortedGroups = [...uniqueGroups].sort();
  groups.value = sortedGroups;    
}
setConditionGroups(savedAttrs.conditions, conditions.value)


const recipeStore = useRecipeStore();
// 레시피 저장
const saveRecipe = () => {
  const json = props.editor.getJSON();
  const getRecipes = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];

  // recipeID 계산하기
  const newRecipeID = getRecipes.length + 1;
  // 레시피 제목
  let recipeName = "";

  for (let item of json.content) {
    if (item.type === "recipeRule") {
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
  saveRecipe();
};


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
    alarmMsg: localStorage.getItem("recipe_alarmMsg"),
    alarmMsgTo: localStorage.getItem("recipe_alarmMsgTo"),
    auto: false,
    activated: false,
    conditions: conditions.value,
  }
  
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
      modalStore.nodeViewProps.deleteNode(); 
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