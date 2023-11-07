import axios from 'axios';

export const getContent = () => {
  console.log("getContent() 호출")
  const json = JSON.parse(localStorage.getItem("novel__content"));
  const arr = json.content.map(item => item.content.map(content => content.text).join(' '))
  const combinedText = arr.join('\n');
  // console.log(combinedText);
  return combinedText;
}

export const requestAi = async() => {
  const url = "http://127.0.0.1:5000/bard"; 
  const requestData = {
    message: getContent(),
  };
  console.log("질문:", requestData.message);
  try {
    const response = await axios.post(url, requestData);
    console.log("응답 데이터:", response.data);
  } catch (error) {
    console.error("오류 발생:", error);
  }
};