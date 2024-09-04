// 문제 5
// 양의 정수가 주어질 때,
// 숫자에서 k개의 자릿수를 제거하여 얻을 수 있는 가장 큰 수를 구하세요.
/*
**제한사항:**

- **`number`**는 최대 1,000,000자리까지 입력될 수 있습니다.
- **`k`**는 1 이상 **`len(number)`** - 1 이하입니다.
*/

let maximumSliceNumber = (number, k) => {
  let max = [];
  number = number.toString();
  for (let i = 0; i < number.length - k + 1; i++) {
    max.push(number.substring(i, i + k));
  }
  return Math.max(...max);
};

console.log(maximumSliceNumber(1924, 1));
console.log(maximumSliceNumber(1924, 2));
console.log(maximumSliceNumber(1924, 3));
console.log(maximumSliceNumber(1924, 4));
