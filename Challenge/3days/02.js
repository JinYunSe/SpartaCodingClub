let maxLength = (nums, k) => {
  let max = -1;
  for (let i = 0; i < nums.length; i++) {
    let count = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) count++;
      if (count > k) break;
      max = Math.max(max, j - i + 1);
    }
  }
  return max;
};

const nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
const k = 2;
const obj = maxLength(nums, k);
console.log(obj);
