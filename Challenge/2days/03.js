// 문제 3
// 주어진 문자열을 요약하는 함수
// str = "aaabbbc" // 출력 : "a3/b3/c1"
// str = "ahhhz"   // 출력 : "a1/h4/z1"

let stringSummary = (string) => {
  let obj = {};
  // 단어를 담을 객체
  string.split('').forEach((element) => {
    // 문자열을 단어 배열로 변경
    if (!obj[element]) obj[element] = 1;
    // 단어가 객체에 없으면
    // 단어를 key로, 1를 value로 생성
    else obj[element]++;
    // 단어가 존재하면 value 증가
  });
  let result = '';
  Object.keys(obj).forEach((key) => {
    result += key + obj[key] + '/';
    // 단어와 value 붙여쓰기
  });
  return result.substring(0, result.length - 1);
};

console.log(stringSummary('aaabbbc'));
