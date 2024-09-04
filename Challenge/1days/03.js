let stringReverse = string => {
  return string
    .split("")
    .reverse()
    .map(element => {
      const Ask = element.toLowerCase().charCodeAt();
      if (Ask >= 97 && Ask <= 122)
        return String.fromCharCode(((Ask - 97 + 1) % 26) + 97);
    })
    .join("");
};

console.log(stringReverse("hello"));
console.log(stringReverse("car"));
