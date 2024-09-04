// 문제 2
//주어진 배열에서 최솟값과 최댓값을 찾고,
//[최솟값, 최댓값] 형태의 배열을 반환하는 함수를 작성하세요.

/*
 **제한사항:**

- 배열의 길이는 1 이상 1000 이하입니다.
- 배열의 원소는 -1000 이상 1000 이하의 정수입니다.
*/
let maxFunc = (array) => {
  return Math.max(...array);
  // 배열 요소에서 최댓값 생성
};

let minFunc = (array) => {
  return Math.min(...array);
  // 배열 요소에서 최솟값 생성
};

let minMaxFunc = (array) => {
  return [minFunc(array), maxFunc(array)];
};

let arr = Array.from(
  { length: Math.floor(Math.random() * 1000) + 1 },
  (_, i) => Math.floor(Math.random() * 2001) + -1000,
);
// -1000 ~ 1000 난수 발생

console.log(arr);
console.log(minMaxFunc(arr));
