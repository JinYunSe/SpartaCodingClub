let LowPriceMove = (S, M, E) => {
  let current = S;
  let index = 0;
  let costObj = {};
  while (M.length !== HowManyTimes(S, M)) {
    if ((current = M[index][0])) {
    }
  }
};
let HowManyTimes = (S, M) => {
  let count = 0;
  for (let i = 0; i < M.length; i++) if (S === M[i][0]) count++;
  return count;
};
const M = [
  [1, 2, 2],
  [1, 3, 3],
  [2, 3, 2],
  [2, 4, 4],
  [3, 4, 1],
  [4, 5, 2],
];
// [도시, 이동할 도시, 비용]
// 내가 1도시에 있으면 [1,2,2],[1,3,3] 이용가능

// 내가 2도시에 있으면 [2,3,2],[2,4,4] 이용가능
const S = 1,
  E = 5;
// 시작도시, 끝 도시

console.log(LowPriceMove(S, M, E));
