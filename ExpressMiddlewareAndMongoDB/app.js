import express from "express";
import connect from "./schemas/index.js";
import router from "./router/todo.router.js";
import ErrorHander from "./middlewares/error-handler.middleware.js";

const app = express();
const PORT = 3000;

connect();

app.use(express.json()); // 미드웨어 1
app.use(express.urlencoded({ extended: true })); // 미드웨어 2
app.use(express.static("./assets")); // 미드웨어 3

// // 미드웨어 4
// app.use((req, res, next) => {
//   console.log("Request URL : ", req.originalUrl, " - ", new Date());
//   next();
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

// 미드웨어 5
app.use("/api", router);
{
  // 에러 처리 핸들링 미들웨어 등록
  app.use(ErrorHander);
}

app.listen(PORT, () => {
  console.log(PORT, "에 접속했습니다");
});
