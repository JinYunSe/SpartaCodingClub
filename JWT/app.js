import express from "express";
import JWT from "jsonwebtoken";

const app = express();
const PORT = 5002;

app.use(express.json());

app.post("/login", (req, res, next) => {
  const user = {
    userId: 203,
    email: "dddd@naver.com",
    name: "이름 없음",
  };

  // 사용자 정보를 JWT로 생성
  const userJWT = JWT.sign(
    user, // user 변수의 데이터를 payload에 할당
    "secretOrPrivateKey", // JWT의 비밀키(아무 값이나 와도 된다) 문자열 할당
    { expiresIn: "1h" } // JWT의 인증 만료시간을 1시간으로 설정
  );

  // userJWT 변수를 sparta 라는 이름을 가진 쿠키에
  // Bearer 토큰 형식으로 할당
  res.cookie("sparta", userJWT);
  return res.status(200).end();
});

app.listen(PORT, (req, res, next) => {
  console.log(PORT + "로 서버가 열렸습니다!");
});
