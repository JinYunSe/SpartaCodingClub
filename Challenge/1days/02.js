// 문제 2
// 주어진 배열에서 짝수와 홀수의 개수를 각각 세는 함수를 작성하세요.
// 함수는 [짝수 개수, 홀수 개수]의 배열을 반환해야 합니다.

/*
**제한사항:**

- 배열의 길이는 1 이상 1000 이하입니다.
- 배열의 원소는 1 이상 1000 이하의 자연수입니다.
*/

let even = array => {
  return array.filter(element => {
    return element % 2 == 0;
  }).length;
};

let odd = array => {
  return array.filter(element => {
    return element % 2 == 1;
  }).length;
};

let evenOdd = array => {
  return [even(array), odd(array)];
};
console.log(evenOdd([1, 2, 3, 4, 5, 6, 7]));
