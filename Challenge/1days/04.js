// 문제 4
// 회전 초밥을 먹을 때,
// 접시들의 번호가 주어집니다.
// 이 중에서 임의의 연속된 접시를 선택하여 먹을 때,
// 가능한 모든 선택에서 가장 다양한 초밥 종류의 개수를 구하세요.
let MaximumNumberOfSushi = array => {
  let max = 0;
  for (let i = 0; i < array.length; i++) {
    let sushi = [];
    let count = 0;
    for (let j = i; j < array.length; j++) {
      if (sushi.includes(array[j])) break;
      sushi.push(array[j]);
      count++;
    }
    max = Math.max(max, count);
  }

  return max;
};

console.log(MaximumNumberOfSushi([1, 2, 1, 3, 2, 1, 4, 1]));
// 1, 2 담아서 => 2
// 1, 2, 1은 1이 중복이라 불가능

// 2, 1, 3 담아서 => 3
// 2, 1, 3, 2는 2가 중복이라 불가능
// 1, 3, 2, 담아서 => 3

// 3, 2, 1, 4 담아서 => 4
console.log(MaximumNumberOfSushi([1, 2, 1, 3, 2]));
// 1, 2 담아서 => 2
// 2, 1, 3 담아서 => 3
// 1, 3, 2 담아서 => 3
// 그래서 최대 개수 3
console.log(MaximumNumberOfSushi([1, 2]));

console.log(MaximumNumberOfSushi([1, 2, 3, 4, 5, 1, 6, 7, 8, 1, 9]));
//만약 정수님의 현재 코드라면

//[1, 2, 3, 4, 5, 1, 6, 7, 8, 1, 9]
// 1, 2, 3, 4, 5 => 5개
// 2, 3, 4, 5, 1, 6, 7, 8 => 8개
//가 나와야 하는데
