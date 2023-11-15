import axios from 'axios';
import { Recipe, Condition, Action } from '../../lib/recipeData'

export const getContent = () => {
  try {
    // console.log("getContent() 호출")
    const json = JSON.parse(localStorage.getItem("aiService__content"));
    // console.log(json);
    const arr = json.content.map(item => (item.content || []).map(content => (content.text || [])).join(' '))
    // console.log(arr);
    const combinedText = arr.join('\n');
    // console.log(combinedText);
    return combinedText;

  } catch (error) {
    console.log("getContent() 에러")
  }
}

export const getFacs = () => {
  console.log("getFacs()호출")
  try {
    const json = JSON.parse(localStorage.getItem("aiService__content"));
    const jsonContent = json.content.map(item => item.content || [])
    // mark.type이 'facilityMark'인 객체만 추출
    const facilityMarks = jsonContent
      .flat() // 다차원 배열을 펼침
      .filter(item => item.type === 'text' && item.marks && item.marks.some(mark => mark.type === 'facilityMark'))
      .map(item => item.marks.filter(mark => mark.type === 'facilityMark')[0]);
    // console.log(facilityMarks);

    if (facilityMarks) {
      const facs = facilityMarks.map(item => item.attrs?.facility)
      const combinedFacs = facs.join(', ');
      console.log("facs는", combinedFacs)
      return combinedFacs;
    }
  } catch (error) {
    console.log("getFacs() 에러")
    throw new Error("getFacs()의 반환값을 받아오지 못했습니다.");
  }
}

export const getTags = () => {
  console.log("getTags()호출")
  try {
    const json = JSON.parse(localStorage.getItem("aiService__content"));
    const jsonContent = json.content.map(item => item.content || [])

    // mark.type이 'tagMark'인 객체만 추출
    const tagMarks = jsonContent
      .flat() // 다차원 배열을 펼침
      .filter(item => item.type === 'text' && item.marks && item.marks.some(mark => mark.type === 'tagMark'))
      .map(item => item.marks.filter(mark => mark.type === 'tagMark')[0]);

    if (tagMarks) {
      const tags = tagMarks.map(item => item.attrs?.tag)
      const combinedTags = tags.join(', ');
      console.log("tags는", combinedTags)
      return combinedTags;
    }
  } catch (error) {
    console.log("getTags() 에러")
    throw new Error("getTags()의 반환값을 받아오지 못했습니다.");
  }
}

export const requestAi = async () => {
  const url = "http://127.0.0.1:5000/bard";
  const requestData = {
    message: getContent(),
    facs: getFacs(),
    tags: getTags(),
  };
  console.log("질문:", requestData.message);
  try {
    const response = await axios.post(url, requestData);
    console.log("서버응답 데이터:", response.data);

    if (response.data.message !== '서버 오류') {
      try {
        //"json" 문자열을 제거
        const jsonString = response.data.message.replace(/^json\s+/i, "");
        console.log("JSON문자열 제거한 스트링:", jsonString);

        const jsonData = JSON.parse(jsonString);

        // console.log("JSON파싱:", jsonData)

        return jsonData

      } catch (error) {
        console.error("JSON 파싱 오류:", error);
      }
    } else {
      // 서버 오류 발생시 실행
      throw new Error("서버가 요청데이터를 받아오지 못했습니다.");
    }
  } catch (error) {
    console.error("오류 발생:", error);
    throw new Error("requestAi()오류 서버연결 또는 쿠키값을 확인하세요.");
  }
};