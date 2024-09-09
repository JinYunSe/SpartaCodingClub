import express from "express";
import expressSession from "express-session";

const app = express();
const PORT = 3019;

app.use(express.json());
app.use(
  expressSession({
    secret: "express-session-secret-key",
    // 세션을 암호화하는 비밀 키를 설정
    resave: false,
    // 클라이언트 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false,
    // 세션이 초기화되지 않았을 때 세션을 저장할지 설정
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      //ms, second, minutes, hours 1일로 설정
    },
  })
);

// 세션 등록 API
app.post("/sessions", (req, res, next) => {
  const { userId } = req.body;

  req.session.userId = userId;

  return res.status(201).json({ message: "세션을 설정했습니다." });
});

// 세션 조회 API
app.get("/sessions", (req, res, next) => {
  console.log(req.session);
  return res.status(200).json({
    message: "세션을 조회했습니다",
    session: req.session.userId ?? null, // 세션에 저장된 userId를 조회합니다.
  });
});

app.listen(PORT, () => {
  console.log(PORT + "포트로 서버가 열렸습니다!.");
});
