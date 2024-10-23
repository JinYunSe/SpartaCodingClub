const handler11 = (data) => {
  const processData = data.toString().split('').reverse().join('');
  // Buffer 형태로 온 배열을 문자열로 바꿔줍니다.
  // 배열로 만들어 배열을 뒤집어줍니다.
  // 뒤집은 배열을 문자열로 다시 바꿔줍니다.
  return Buffer.from(processData);
  // 처리된 결과를 다시 Buffer에 넣어 반환해줍니다.
};

export default handler11;
