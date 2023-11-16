<template>
  <div class="modal-family text-lg">
    <div class="first p-2.5 content-center relative -top-2.5 ">
      <div>
        <p class="text-sm text-gray-400 mb-1 ">
          선택한 설비
        </p>
        <p class='rounded-md shadow-sm border-2 ring-gray-300 px-4 py-1'>
          {{ facMsg }}
        </p>
      </div>
    </div>
    <div class='mr-4'>의</div>
    <div class="second p-2.5 content-center relative -top-2.5 ">
      <div>
        <p class="text-sm text-gray-400 mb-1 ">
          선택한 태그
        </p>
        <p class='rounded-md shadow-sm border-2 ring-gray-300 px-4 py-1'>
          {{ tagMsg }}
        </p>
      </div>
    </div>
    <div class='mr-4'>를</div>
    <ThirdModalChild class='third p-2.5 content-center' @tempSelected="updateTempValue" @unitSelected='updateUnitValue'
      @rangeSelected='updateRangeValue' :tagMsg='tagMsg' :temp='temp' :unit='unit' :range='range' />
    <div class="min-w-full mb-20 px-14">
      <MiniEditor class='p-2.5 content-center' :placeholder="'추가 메모를 작성하세요 …'" :storageKey="'modal__condition'"
        :savedContent='savedAttrs.memo' />
    </div>
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
  <DeleteBtn @click.stop="handleDelete" />
</template>

<script setup lang="ts">
import { PropType, computed, onUpdated, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from '../ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import DeleteBtn from '../DeleteBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import { useStorage } from "@vueuse/core";

const facMsg = ref<String>('선택 설비 없음');
const tagMsg = ref<String>('선택 태그 없음');
//console.log(JSON.parse(JSON.stringify(tagMsg.value)))
// let unitValue = "";
// if (JSON.parse(JSON.stringify(tagMsg.value)) === "Press") {
//   unitValue = "bar";
// } else {
//   unitValue = "℃";
// }

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

// "novel__content"에서 해당 노드 정보 불러오기
const getContent = () => {
  const allData = props.editor.getJSON();
  const location = props.editor.state.selection.$anchor; // 커서 위치 정보 가져오기
  const locationNum = location?.path[1];
  const contentObj = allData?.content[locationNum];
  return contentObj;
};


// 설비, 태그 데이터 초기 세팅
const setDataFacilityTag = () => {
  const content = getContent().content;

  if (content) {
    const facilityItem = content.find(item => item.marks?.some(mark => mark.type === 'facilityMark'));
    if (facilityItem && facilityItem.marks[0].attrs) {
      facMsg.value = facilityItem.marks[0].attrs.facility;
    }

    const tagItem = content.find(item => item.marks?.some(mark => mark.type === 'tagMark'));
    if (tagItem && tagItem.marks[0].attrs) {
      tagMsg.value = tagItem.marks[0].attrs.tag;
    }
  }
}
setDataFacilityTag();


// 조건 노드로 설정되어있을 때 설정할 속성값
interface attrs {
  fac: string,
  tag: string,
  temp: string,
  unit: string,
  range: string,
  memo: string
}

// "novel__content"에서 불러온 노드정보 저장
const savedContent = getContent();

// 조건 노드로 설정되어있을 때 "novel__content"에서 가져와서 값 저장.
const savedAttrs: attrs = {
  fac: savedContent?.attrs?.fac,
  tag: savedContent?.attrs?.tag,
  temp: savedContent?.attrs?.temp,
  unit: savedContent?.attrs?.unit,
  range: savedContent?.attrs?.range,
  memo: savedContent?.attrs?.memo,
}

// savedAttrs의 속성 값이 undefined인지 확인하고 초기값 설정
const initialTemp = 
  savedAttrs.temp !== undefined 
    ? savedAttrs.temp 
    : tagMsg.value === "Press"
    ? 0
    : tagMsg.value === "Winding Temp"
    ? 0
    : "";
const initialUnit =
  savedAttrs.unit !== undefined
    ? savedAttrs.unit
    : tagMsg.value === "Press"
    ? "bar"
    : tagMsg.value === "Status"
    ? "started"
    : tagMsg.value === "Winding Temp"
    ? "℃"
    : "";
const initialRange = 
  savedAttrs.range !== undefined 
    ? savedAttrs.range
    : tagMsg.value === "Press"
    ? "이상"
    : tagMsg.value === "Winding Temp"
    ? "이상"
    : "";

const temp = ref<number | null>(initialTemp); // 온도
const unit = ref<string>(initialUnit); // 단위
const range = ref<string>(initialRange); // 범위

// ThirdModalChild.vue 인풋에 입력한 값 불러오기
const updateTempValue = (value: number) => {
  temp.value = value;
};
const updateUnitValue = (value: string) => {
  unit.value = value; 
  // console.log("updateUnitValue: " + value, unit.value);
};
const updateRangeValue = (value: string) => {
  range.value = value;
};


// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  // 로컬스토리지 키 삭제
  localStorage.removeItem('modal__condition');

  modalStore.closeModal(); // 모달 닫기
};

// 완료 버튼 클릭
const handleConfirm = () => {
  changeToConditionNode(); //conditionRule 노드변경 함수
  closeModal();
};

// 현재 커서의 위치의 내용을 지울 범위 지정 함수
const getRange = () => {
  // 기존의 Tiptap 에디터 상태와 노드 가져오기
  const editorState = props.editor.view.state;
  const { selection } = editorState;

  // 현재 커서의 위치 가져오기
  const $cursor = selection?.$cursor;

  // 현재 커서가 위치한 행의 시작과 끝 위치 찾기
  const from = $cursor.before($cursor.depth) + 1; // 행의 시작
  const to = $cursor.after($cursor.depth) - 1;   // 행의 끝

  return { from, to }
}

// 조건 노드로 변경
const changeToConditionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('modal__condition') ?? ''; // null이면 빈 문자열 반환
  // Stauts 태그 선택시 값이 null인거 제외 시킴
  // let str = "";
  // if (tagMsg.value === "Status") {
  //   str = `${unit.value} ${modalContent}`;
  // } else {
  //   str = `${temp.value}${unit.value} ${range.value} ${modalContent}`;
  // }

  const attrs: attrs = {
    fac: facMsg.value,
    tag: tagMsg.value,
    temp: String(temp.value),
    unit: unit.value,
    range: range.value,
    memo: modalContent
  };


  editor
    .chain()
    .focus()
    .deleteRange(getRange())
    .setConditionRule(attrs)
    // .setFacility({ facility: facMsg.value })
    // .insertContent(facMsg.value)
    // .unsetFacility()
    // .insertContent('의 ')
    // .setTag({ tag: tagMsg.value })
    // .insertContent(tagMsg.value)
    // .unsetTag()
    // .insertContent('를 ')
    // .insertContent(str)
    .run();
  };

const handleDelete = (e) => {
  deleteConditionNode(e);
  closeModal();
};

const deleteConditionNode = (e) => {
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
  if (contentObj.type == "conditionRule") {
    editor.commands.unsetCondition({
      text: contentText,
      editor: editor,
    });
  }
}
</script>

<style scoped>
.modal-family {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: auto;
  margin-top: 60px;
  width: 742px;
  min-height: 250px;
  max-height: 480px;
  overflow-y: auto;
  /* background-color: aquamarine; */
}

.first {
  /* background-color: #ffc5e4; */
}

.second {
  /* background-color: #bedcff; */
}

.third {
  /* background-color: rgb(145, 150, 255); */
}
</style>