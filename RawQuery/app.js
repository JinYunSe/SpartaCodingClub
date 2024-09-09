import express from "express";
import mysql from "mysql2";

const connect = mysql.createConnection({
  host: "express-database.c7amcq0a243z.ap-northeast-2.rds.amazonaws.com", //AWS RDS 엔드포인트
  user: "wlsdbstp", // AWS RDS 계정명
  password: "jinyunse1999^^", // AWS RDS 비밀번호
  database: "express_db", // 연결할 MySQL DB 이름
});

const app = express();
const PORT = 3017;

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// 테이블 생성 API
app.post("/api/tables/", async (req, res, next) => {
  const { tableName } = req.body;

  // 콜백 함수가 정상 수행하면(promise) 되면
  await connect.promise().query(`
        CREATE TABLE ${tableName}
        (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `); // DEAULT는 값을 주지 않아도 오른쪽에 할당된 값을 바로 넣어주는 문법
  // CURRENT_TIMESTAMP는 현재 시간을 제공하는 문법
  return res.status(201).json({ message: "테이블 생성에 성공하였습니다." });
});

// 테이블 조회 API
app.get("/api/tables", async (req, res, next) => {
  const [tableList] = await connect.promise().query(`SHOW TABLES`);
  // ShOWTABLE 이라는 명령어를 사용해서 DB에 있는 전체 Table을 배열형식으로 가져온다.
  const tableNames = tableList.map(table => Object.values(table)[0]);

  return res.status(200).json({ tableNames });
});

// 데이터 삽입 API
app.post("/api/tables/:tableName/items", async (req, res, next) => {
  //필요한 정보 : 테이블 이름, value들

  const { tableName } = req.params;
  // 사용할 table은 params(URL)로 전달 받을 예정
  const { name } = req.body;
  // table에 이름을 받아오기 때문에 name 사용

  await connect.promise().query(`
        INSERT INTO ${tableName}(name) VALUES('${name}')
    `);
  //INSERT INTO 사용할 테이블(필요한 Fields) VALUES(넣을 값)

  res.status(201).json({ message: "데이터 생성에 성공했습니다." });
});

// 데이터 조회 API
app.get("/api/tables/:tableName/items", async (req, res, next) => {
  const { tableName } = req.params;
  const [itemList] = await connect.promise().query(`
        SELECT name, createdAt FROM ${tableName}
    `);
  // 데이터들이 배열 형식으로 조회되기 때문에
  // [itemList] 로 검색된 결과를 배열로 받아준다.
  return res.status(200).json({ itemList });
  // 결과를 Client에게 전달한다.
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
