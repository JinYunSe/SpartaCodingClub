const insertSort = array => {
  for (let i = 1; i < array.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (array[i] < array[j]) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i--;
      } else break;
    }
  }
  return array;
};
// console.log 제거 했습니다

let num = [2, 6, 4, 9, 1];
console.log(...insertSort(num));
