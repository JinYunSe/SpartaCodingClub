//문제1

//두 자연수 a와 b가 주어질 때,이 둘의 최대공약수를 구하는 함수를 작성하시오.

/*
**제한사항:**

- a, b는 1 이상 1000 이하의 자연수입니다.
*/

let leastCommonDivisor = (a, b) => {
  let temp = null;
  if (a < b) {
    temp = b;
    b = a;
    a = temp;
  }
  do {
    temp = a % b;
    a = b;
    b = temp;
  } while (temp != 0);
  return a;
  //유클리드 호제법을
  //이용한 풀이
};
let greatestCommonMultiple = (a, b) => {
  let least = leastCommonDivisor(a, b);
  return (a * b) / least;
  // 두 수 곱하기 / 최소 공약수 = 최대 공배수
};
let least = leastCommonDivisor(24, 81);
let greatest = greatestCommonMultiple(81, 24);
console.log("최소 공약수 : " + least);
console.log("최대 공배수 : " + greatest);
