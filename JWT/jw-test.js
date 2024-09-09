import jwt from "jsonwebtoken";

const token = jwt.sign({ myPayloadData: 1234 }, "mysecretkey");
console.log(token);

// jwt payload 검증 코드
const decodeValueByVerify = jwt.verify(token, "sdfsdfdsds");
console.log(decodeValueByVerify);

// jwt payload 복호화
const decodeValue = jwt.decode(token);
console.log(decodeValue);
