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
      @rangeSelected='updateRangeValue' @startedSelected='updateRangeValue' :tagMsg='tagMsg'/>
    <div class="min-w-full mb-20 px-14">
      <MiniEditor class='p-2.5 content-center' :placeholder="'추가 메모를 작성하세요 …'" :storageKey="'modal__condition'" />
    </div>
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
  <DeleteBtn @click.stop="handleDelete" />
</template>

<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import DeleteBtn from '../DeleteBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import { useStorage } from "@vueuse/core";

const facMsg = ref<String>('설비');
const tagMsg = ref<String>('태그');


// 인풋에 입력한 값 불러오기
const temp = ref<number | null>(0); // 온도
const unit = ref<string>("℃"); // 단위
  const range = ref<string>(tagMsg.value === "Status" ? "started" : "이상");; // 범위
const updateTempValue = (value: number) => {
  temp.value = value;
};
const updateUnitValue = (value: string) => {
  unit.value = value;
};
const updateRangeValue = (value: string) => {
  range.value = value;
};

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

// "novel__content"에서 해당 노드 정보 불러오기
const getContent = () => {
  const allData = props.editor.getJSON();
  // console.log(allData);
  const location = props.editor.state.selection.$anchor; // 커서 위치 정보 가져오기
  const locationNum = location?.path[1];
  const contentObj = allData?.content[locationNum];
  // console.log(contentObj)
  return contentObj;
};

const setDataFacilityTag = () => {
  // console.log(getContent().content?.filter(item => item.marks?.some(mark => mark.type === 'tagMark')).filter(item => item.marks?.some(mark => mark.type === 'tagMark')));
  // console.log(getContent().content?.filter(item => item.marks?.some(mark => mark.type === 'tagMark'))[0].marks[0].attrs?.tag);
  facMsg.value = getContent().content?.filter(item => item.marks?.some(mark => mark.type === 'facilityMark'))[0].marks[0].attrs?.facility;
  tagMsg.value = getContent().content?.filter(item => item.marks?.some(mark => mark.type === 'tagMark'))[0].marks[0].attrs?.tag;
}

// 설비, 태그 데이터 초기 세팅
setDataFacilityTag();

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

// 완료 버튼 클릭
const handleConfirm = () => {
  closeModal();
  changeToConditionNode(); //conditionRule 노드변경 함수
};

// const konwhowOBJ = useStorage<any[]>('konwhowOBJ', []); // 레시피 데이터 객채로 저장
// const konwhowArr = useStorage<string[]>('konwhowArr', []); //레시피 저장 배열(상태관리? 배열 초기화 막아줌) / 빈배열을 인자로 가지고 있어 타입<string[]>을 지정해 줘야함

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

  return {from, to}
}

// 조건 노드로 변경
const changeToConditionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('modal__condition') ?? ''; // null이면 빈 문자열 반환
  // Stauts 태그 선택시 값이 null인거 제외 시킴
  let str = "";
  if (tagMsg.value === "Status") {
    str = `${range.value} ${modalContent}`;
  } else {
    str = `${temp.value}${unit.value} ${range.value} ${modalContent}`;
  }

  editor
    .chain()
    .focus()
    .deleteRange(getRange())
    .setConditionRule({
      attrs: {
        fac: facMsg.value,
        tag: tagMsg.value,
        temp: temp.value,
        unit: unit.value,
        range: range.value,
        memo: modalContent,
      }
    })
    .setFacility({ facility: facMsg.value })
    .insertContent(facMsg.value)
    .unsetFacility()
    .insertContent('의 ')
    .setTag({tag: tagMsg.value})
    .insertContent(tagMsg.value)
    .unsetTag()
    .insertContent('를 ')
    .insertContent(str)
    // .insertContentAt({ from: editor.state.selection.$from.before(1), to: editor.state.selection.$from.after(1) }, str)
    .run();


  // let konwhow = `"${facMsg.value}"의 "${tagMsg.value}"를 ${temp.value} ${unit.value} ${range.value} ${modalContent}`;
  // //  console.log(JSON.stringify(konwhow));

  // konwhowArr.value.push(konwhow);
  // localStorage.setItem('konwhowArr', JSON.stringify(konwhowArr.value)); // 로컬에 저장
  //  console.log(konwhowArr.value);

  //객체로 저장
  // let fac = facMsg.value;
  // let tag = tagMsg.value;
  // let tempValue = temp.value;
  // let unitValue = unit.value;
  // let rangeValue = range.value;
  // let modalText = modalContent;
  // let obj = {};
  // if (tag === "Status") {
  //   obj = { fac, tag, tempValue, unitValue, modalText };
  // } else {
  //   obj = { fac, tag, tempValue, unitValue, rangeValue, modalText };
  // }
  // //  console.log(JSON.stringify(obj));
  // konwhowOBJ.value.push(obj); //배열에 추가
  // localStorage.setItem('konwhowOBJ', JSON.stringify(konwhowOBJ.value)); //로컬에 저장
  // // 데이터 가져오기
  // let gatData = localStorage.getItem('konwhowOBJ')

  // let gatData2;
  // if (gatData !== null) {
  //   gatData2 = JSON.parse(gatData);
  // }
  // console.log(`확인1 : ${JSON.stringify(gatData2[1])}`); //전체 가져올 때
  // console.log(`확인2 : ${gatData2[1]?.whel}`); //값 하나만 가져올 때 JSON.stringify()쓰면 JSON문자열로 됨 "whel"
  // console.log(`확인3 : ${gatData2[1]?.tag}`);
  // console.log(`확인4 : ${gatData2[1]?.tempValue}`);

  /*
    localStorage는 무조건 문자열로 저장
    JSON 데이터를 문자열로 변환하거나, 특수문자를 포함한 문자열을 안전하게 다루기 위해 이스케이프 처리
  */
  // const data = localStorage.getItem("konwhowArr");
  // if(data !== null){
  //   console.log(data.replace(/\\/g, '').replace(/"/g, ''));
  // }


  // localStorage.removeItem('konwhow');
  // useStorage('konwhow', konwhow);//레시피
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