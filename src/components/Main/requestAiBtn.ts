import axios from 'axios';
import { Recipe, Condition, Action } from '../../lib/recipeData'

export const getContent = () => {
  console.log("getContent() 호출")
  const json = JSON.parse(localStorage.getItem("novel__content"));
  const arr = json.content.map(item => item.content.map(content => content.text).join(' '))
  const combinedText = arr.join('\n');
  // console.log(combinedText);
  return combinedText;
}

export const requestAi = async () => {
  const url = "http://127.0.0.1:5000/bard";
  const requestData = {
    message: getContent(),
  };
  console.log("질문:", requestData.message);
  try {
    const response = await axios.post(url, requestData);
    console.log("응답 데이터:", response.data);

    if (response.data.message !== '서버 오류') {
      try {
        //"json" 문자열을 제거
        const jsonString = response.data.message.replace(/^json\s+/i, "");
        console.log("JSON문자열 제거한 스트링:", jsonString);

        const jsonData = JSON.parse(jsonString);

        console.log("JSON파싱:", jsonData)

        return jsonData

      } catch (error) {
        console.error("JSON 파싱 오류:", error);
      }
    } else{
      // 서버 오류 발생시 실행
      throw new Error("서버가 요청데이터를 받아오지 못했습니다.");
    }
  } catch (error) {
    console.error("오류 발생:", error);
    throw new Error("requestAi()오류 서버연결 또는 쿠키값을 확인하세요.");
  }
};