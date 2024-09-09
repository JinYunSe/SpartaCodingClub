import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3019;

// 비밀 키는 외부에 노출되면 안됩니다! 그렇기 때문에, .env 파일을 이용해 비밀 키를 관리해야합니다.
// 현재는 학습을 위해 app.js에 두겠습니다.

const ACCESS_TOKEN_SECRET_KEY = `HanHae99`; // Access Token의 비밀 키를 정의합니다.
const REFERSH_TOKEN_SECRET_KEY = `Sparta`; // Refresh Token의 비밀 키를 정의합니다.

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).send("Hello Token!");
});

const tokenStorages = {}; // 리프레시 토큰을 관리할 객체

// Access Token을 생성하는 함수
const createAccessToken = id => {
  const accessToken = jwt.sign(
    { id: id }, // JWT 데이터
    ACCESS_TOKEN_SECRET_KEY, // Access Token의 비밀 키
    { expiresIn: "10s" } // Access Token이 10초 뒤에 만료되도록 설정합니다.
  );

  return accessToken;
};

// Refresh Token을 생성하는 함수
const createRefreshToken = id => {
  const refreshToken = jwt.sign(
    { id: id }, // JWT 데이터
    REFERSH_TOKEN_SECRET_KEY, // Refresh Token의 비밀 키
    { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  );

  return refreshToken;
};

/** Access Token, Refresh Token 발급 API **/
app.post("/tokens", (req, res) => {
  const { id } = req.body;
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken(id);

  //tokenStorages 객체 안에 refreshToken을 사용해서 해당하는 키를 정의한다.
  tokenStorages[refreshToken] = {
    id: id, // 사용자에게 전달받은 ID를 저장합니다.
    ip: req.ip, // 사용자의 IP 정보를 저장합니다.
    userAgent: req.headers["user-agent"],
    // 사용자가 어떤 방식으로 서버에 접속했는지 확인하기 위한 목적
    // ex) firefox, android, chrome 등 클라이언트가 서버에 보낸 요청 상태를 확인할 수 있다.
  };

  // 클라이언트에게 쿠키(토큰)를 할당
  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);

  return res
    .status(200)
    .json({ message: "Token이 정상적으로 발급되었습니다." });
});

/** 엑세스 토큰 검증 API **/
app.get("/tokens/validate", (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(400)
      .json({ errorMessage: "Access Token이 존재하지 않습니다." });
  }

  const payload = validateToken(accessToken, ACCESS_TOKEN_SECRET_KEY);
  if (!payload) {
    return res
      .status(401)
      .json({ errorMessage: "Access Token이 유효하지 않습니다." });
  }

  const { id } = payload;
  return res.json({
    message: `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.`,
  });
});

// Token을 검증하고 Payload를 반환합니다.
const validateToken = (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
};

// Refresh Token을 이용해서, AccessToken을 재발급 하는 API
app.post("/tokens/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res
      .status(400)
      .json({ errorMessage: "Refresh Token이 유효하지 않습니다" });

  const payload = validateToken(refreshToken, REFERSH_TOKEN_SECRET_KEY);
  if (!payload)
    return res.status(401).json({
      errorMessage: "Refresh Token이 정상적이지 않습니다.",
    });

  const userInfo = tokenStorages[refreshToken];
  //  나중에 데이터베이스로 구현하면 데이터베이스 조회로 수정하면 된다.

  if (!userInfo)
    return res.status(419).json({
      errorMessage: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
    });
  //419는 클라이언트가 서버에게 전달하는 정보가 일치하지 않는다.

  res.cookie("accessToken", createAccessToken(userInfo.id));
  return res.json({ massage: "Access Token을 새롭게 발급하였습니다." });
});

app.listen(PORT, () => {
  console.log(PORT + "포트로 서버가 열렸습니다!");
});
