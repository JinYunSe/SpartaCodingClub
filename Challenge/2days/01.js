// 문제 1
// 주어진 문자열에서 중복된 문자를 제거하고, 남은 문자들을 원래 순서대로 반환하는 함수를 작성하세요.
/*
**제한사항:**

- 문자열의 길이는 1 이상 1000 이하입니다.
 */
let result = (string) => {
  let temp = new Set(string);
  //중복이 없는 문자 배열 생성
  console.log(temp);
  return [...temp].join('');
  //배열 안의 내용을 문자열로 변환
};

console.log(result('abbccdeff'));
