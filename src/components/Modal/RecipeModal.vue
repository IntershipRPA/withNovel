<template>
   
    <div>
      <textarea placeholder="레시피 입력"></textarea>
    </div>
    <ConfirmBtn @click.stop="handleConfirm" />
    <DeleteBtn @click.stop="handleDelete" />
  </template>
  
  <script setup lang="ts">
  import { PropType, Ref, computed, ref } from "vue";
  import { Editor, Range } from '@tiptap/core';
  import { useModalStore } from '../../stores/modal';
  
  // 모달 설정
  const modalStore = useModalStore(); // 스토어 인스턴스 생성
  
  const closeModal = () => {
    modalStore.closeModal(); // 모달 닫기
  };
  
  const props = defineProps({
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
   
  })


  const stopPropagation = (event) => {
    event.stopPropagation();
  };
  // 삭제
  const handleDelete = () => {
  deleteActionNode();
  closeModal();
};

  // 완료 버튼 클릭
const handleConfirm = () => {
  closeModal();
  changeToActionNode(); //actionRule 노드변경 함수
};

const deleteActionNode = () => {
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
  if (contentObj.type == "actionRule") {
    editor.commands.unsetAction({
      text: contentText,
      editor: editor,
    });
  }
}
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















const changeToActionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('modal__action') ?? ''; // null이면 빈 문자열 반환

  // Stauts 태그 선택시 값이 null인거 제외 시킴
  let str = "";
  if (tagMsg.value === "Status") {
    str = `${range.value} ${modalContent}`;
  } else {
    str = `${temp.value} ${unit.value} ${range.value} ${modalContent}`;
  }


  let attrs = {
    fac: facMsg,
    tag: tagMsg,
    temp: String(temp.value),
    unit: unit.value,
    range: range.value,
    memo: modalContent
  };

  editor
    .chain()
    .focus()
    .deleteRange(getRange())
    .setActionRule(attrs)
    .setFacility({ facility: facMsg.value })
    .insertContent(facMsg.value)
    .unsetFacility()
    .insertContent('의 ')
    .setTag({ tag: tagMsg.value })
    .insertContent(tagMsg.value)
    .unsetTag()
    .insertContent('를 ')
    .insertContent(str)
    .run();


};










  </script>
  
  <style scoped>
  
  textarea {
      width: 100%;
      height: 6.25em;
      border: none;
      resize: none;
    }
  .modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
  }
  
  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    height: 100%;
    width: 100%;
  }
  
  .modal-content {
    z-index: 1;
    position: relative;
    min-width: 820px;
    max-width: 1080px;
    min-height: 280px;
    max-height: 630px;
    background-color: white;
    border-radius: 10px;
    /* background: rgba(255, 255, 255, 0.3); */
    backdrop-filter: blur(240px);
  }
  
  .close-btn {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  </style>