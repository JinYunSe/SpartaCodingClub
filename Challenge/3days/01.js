const doosanScore = Math.floor(Math.random() * 100 - 0 + 1);
const kiaScore = Math.floor(Math.random() * 100 - 0 + 1);
//임의의 점수 부여

console.log("현재 두산 점수 : " + doosanScore);
console.log("현재 기아 점수 : " + kiaScore);

const result = doosanScore > kiaScore ? 0 : kiaScore - doosanScore + 4;

console.log("필요한 안타 개수 : " + result);
