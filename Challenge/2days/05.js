// 문제 5
// 주어진 문자열이 유효한 괄호 조합인지 확인하는 함수를 작성하세요.
// 유효한 조합은 모든 여는 괄호가 올바르게 닫혀야 하며, 괄호의 순서도 일치해야 합니다
/*
**제한사항:**

- 문자열의 길이는 1 이상 1000 이하입니다.
- 괄호는 `()`, `{}`, `[]`의 세 종류입니다.
*/

let Parentheses = (string) => {
  string = string.split('').map((element) => {
    if (element === '(') return 1;
    // '('은 1로
    else if (element === '{') return 2;
    // '{'은 2로
    else if (element === '[') return 3;
    // '['은 3으로
    else if (element === ')') return -1;
    // ')'은 -1로
    else if (element === '}') return -2;
    // '}'은 -2로
    else return -3;
    // ']'은 -3으로 설정
  });
  let temp = [];
  // + 값만 담을 배열
  for (let i of string) {
    // 입력 받은 괄호들 순회
    if (i > 0) temp.push(i);
    //'(','{','[' 이면 배열에 담기
    else if (temp.pop() + i !== 0) return false;
    // ')', '}', ']'이면 temp의 값을 가져와 i와 더한다.
    // (temp.pop()을 했을 때 temp에 값이 없어도 temp.pop() + i 작동)
    // 더한 값이 0이 아니면 순서가 잘못된 괄호
  }
  return temp.length === 0;
  // 배열 내부에 0 값이 없다면 true
};

console.log(Parentheses('(){}{}[]'));
console.log(Parentheses('[{}][{{}}][({({})})]'));
console.log(Parentheses('[{]'));
console.log(Parentheses('[{(]'));
console.log(Parentheses('[{('));
console.log(Parentheses('(]'));
console.log(Parentheses('}]'));
console.log(Parentheses('([)]'));
