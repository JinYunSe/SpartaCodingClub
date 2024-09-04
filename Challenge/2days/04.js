// 문제 4
// 주어진 배열에서 두 수를 선택하여 그 합이 주어진 target 값과
// 일치하는지 확인하는 함수를 작성하세요.
// 일치하는 경우 true, 그렇지 않은 경우 false를 반환하세요.
/*
**제한사항:**

- 배열의 길이는 2 이상 1000 이하입니다.
- 배열의 원소는 1 이상 1000 이하의 자연수입니다.
*/

let sumArray = (array, target) => {
  array = array.sort((a, b) => a - b);
  //배열을 오름차순 정렬 합니다.
  array.some((element, index, arr) => {
    //some 함수로 조건에 부합하는 경우 true, 아닐 경우 false를 반환 합니다.
    return arr.includes(target - element, index + 1);
    // includes 함수로 target - element 값이
    // 해당 element 뒤 배열 요소에 있는지 살펴봅니다.
    // 오름 차순정렬했기 때문에 가능
  });
};

let array = Array.from(
  { length: Math.floor(Math.random() * 1000) + 2 },
  (_, i) => Math.floor(Math.random() * 1000) + 1,
);

let target = Math.floor(Math.random() * 2000);
console.log(sumArray(array, target));
