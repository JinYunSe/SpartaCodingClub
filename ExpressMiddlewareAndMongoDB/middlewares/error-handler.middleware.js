export default (err, req, res, next) => {
  console.log("에러처리 미들웨어가 실행 됐습니다");
  console.error(err);

  //Joi에서 발생한 유효성 에러일 경우
  if (err.name === "ValidationError")
    return res.status(400).json({ errorMessage: err.message });

  // 그 밖의 서버 오류일 경우
  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생하였습니다!" });
};
