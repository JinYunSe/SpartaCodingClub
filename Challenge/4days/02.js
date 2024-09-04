const ArrayAllAdd = array => {
  return array
    .reduce((acc, cur) => {
      // acc 누산 결과를 저장할 변수
      // cur 현재 요소
      return acc.flatMap(
        // flat과 map을 합친 기능으로
        // 평탄화된 배열을 반환하는 기능
        element => cur.map(element2 => element + element2),
        // 누산 값의 요소에서
        // 현재값(배열)의 요소를 더한 값이 더해진 배열을 생성
        [0]
        //acc 초기값
      );
    })
    .sort((a, b) => a - b)[k - 1];
  // 정렬 및 찾고자 하는 번지 수
};

let n = 3;
let m = 3;
let k = 4;
//배열 개수, 배열 길이, 몇 번째 숫자

let array = [
  [1, 4, 7],
  [2, 5],
  [3, 6],
];
let sum = ArrayAllAdd(array);
console.log(sum);

n = 4;
m = 2;
k = 7;

array = [
  [1, 10],
  [2, 3],
  [4, 5],
  [6, 7],
];
sum = ArrayAllAdd(array);
console.log(sum);
