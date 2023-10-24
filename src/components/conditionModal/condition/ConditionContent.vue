<template>
  <div class="modal-family text-lg">
    <div class="first p-2.5 content-center">
      <p>{{ whelkMsg }}</p>
    </div>
    <div class="second p-2.5 content-center">
      <p>{{ tagMsg }}</p>
    </div>
    <ThirdModalChild class='third p-2.5 content-center' @tempSelected="updateTempValue" @unitSelected='updateUnitValue'
      @rangeSelected='updateRangeValue' />

    <MiniEditor class='p-2.5 content-center' :placeholder="'추가 메모를 작성하세요 …'" :storageKey="'memo'"/>
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

// 설비와 태그 불러오기
const whelkMsg = localStorage.getItem('whelk')
const tagMsg = localStorage.getItem('tag')

// 인풋에 입력한 값 불러오기
const temp = ref<number | null>(Number(localStorage.getItem('temp'))); // 온도
const unit = ref<string>(String(localStorage.getItem('unit'))); // 단위
const range = ref<string>(String(localStorage.getItem('range'))); // 범위
const memo = ref<string>(String(localStorage.getItem('memo'))); // 메모
const updateTempValue = (value: number) => {
  temp.value = value;
};
const updateUnitValue = (value: string) => {
  unit.value = value;
};
const updateRangeValue = (value: string) => {
  range.value = value;
};
const updateMemoValue = (value: string) => {
  memo.value = value;
};

const props = defineProps({
  // whelkMsg: { type: String, default: "test whelkMsg" },
  // tagMsg: { type: String, default: "test tagMsg" },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  // range: {
  //   type: Object as PropType<Range>,
  //   required: true,
  // },
})


// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

const handleConfirm = () => {
  closeModal();
  changeToConditionNode(); //conditionRule 노드변경 함수
};

const konwhowOBJ = useStorage<any[]>('konwhowOBJ', []); // 레시피 데이터 객채로 저장
const konwhowArr = useStorage<string[]>('konwhowArr', []); //레시피 저장 배열(상태관리? 배열 초기화 막아줌) / 빈배열을 인자로 가지고 있어 타입<string[]>을 지정해 줘야함

const changeToConditionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('memo');
  // Stauts 태그 선택시 값이 null인거 제외 시킴
  let str = "";
  if (tagMsg === "Status") {

    str = `"${whelkMsg}"의 "${tagMsg}"를 ${modalContent}`;

  } else {
    str = `"${whelkMsg}"의 "${tagMsg}"를 ${temp.value} ${unit.value} ${range.value} ${modalContent}`;
  }
  editor
    .chain()
    .focus()
    .insertContentAt({ from: editor.state.selection.$from.before(1), to: editor.state.selection.$from.after(1) }, str)
    .setConditionRule({
      attrs: {
        whelk: whelkMsg,
        tag: tagMsg,
        temp: temp.value,
        unit: unit.value,
        range: range.value,
        memo: modalContent,
      }
    })
    .run();

  let konwhow = `"${whelkMsg}"의 "${tagMsg}"를 ${temp.value} ${unit.value} ${range.value} ${modalContent}`;
  //  console.log(JSON.stringify(konwhow));

  konwhowArr.value.push(konwhow);
  localStorage.setItem('konwhowArr', JSON.stringify(konwhowArr.value)); // 로컬에 저장
  //  console.log(konwhowArr.value);

  //객체로 저장
  let whel = whelkMsg;
  let tag = tagMsg;
  let tempValue = temp.value;
  let unitValue = unit.value;
  let rangeValue = range.value;
  let modalText = modalContent;
  let obj = {};
  if (tag === "Status") {
    obj = { whel, tag, tempValue, unitValue, modalText };
  } else {
    obj = { whel, tag, tempValue, unitValue, rangeValue, modalText };
  }
  //  console.log(JSON.stringify(obj));
  konwhowOBJ.value.push(obj); //배열에 추가
  localStorage.setItem('konwhowOBJ', JSON.stringify(konwhowOBJ.value)); //로컬에 저장
  // 데이터 가져오기
  let gatData = localStorage.getItem('konwhowOBJ')

  let gatData2;
  if (gatData !== null) {
    gatData2 = JSON.parse(gatData);
  }
  console.log(`확인1 : ${JSON.stringify(gatData2[1])}`); //전체 가져올 때
  console.log(`확인2 : ${gatData2[1]?.whel}`); //값 하나만 가져올 때 JSON.stringify()쓰면 JSON문자열로 됨 "whel"
  console.log(`확인3 : ${gatData2[1]?.tag}`);
  console.log(`확인4 : ${gatData2[1]?.tempValue}`);

  /*
    localStorage는 무조건 문자열로 저장
    JSON 데이터를 문자열로 변환하거나, 특수문자를 포함한 문자열을 안전하게 다루기 위해 이스케이프 처리
  */
  // const data = localStorage.getItem("konwhowArr");
  // if(data !== null){
  //   console.log(data.replace(/\\/g, '').replace(/"/g, ''));
  // }


  localStorage.removeItem('konwhow');
  useStorage('konwhow', konwhow);//레시피
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
  height: 150px;
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