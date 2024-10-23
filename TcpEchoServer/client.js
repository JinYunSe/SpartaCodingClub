import net from 'net';
import { writeHeader, readHeader } from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constant.js';

const HOST = 'localhost';
const PORT = '5555';

const client = new net.Socket();
//          net Class 객체의 Socket 메서드로 소켓을 만든다.

client.connect(PORT, HOST, () => {
  // 서버와 연결 과정
  console.log('Connected To The Server...');

  const message = 'Hello';
  const buffer = Buffer.from(message);
  // 서버 연결과 동시에 Hello라는 문자열을 버퍼에 담는다.

  const header = writeHeader(buffer.length, 11);
  // writeHeader()로 message와 header 합치기 buffer의 길이 만큼 만들어줍니다.
  // 먼저 우리가 만든 함수 writeHeader로 buffer의 길이
  // 만큼 지정하고 handerId를 10으로 설정합니다.
  const packet = Buffer.concat([header, buffer]);
  // 이제 header 배열과 buffer 배열을 합쳐서
  client.write(packet);
  // 서버에게 packet을 data로 전송합니다.
});

client.on('data', (data) => {
  const buffer = Buffer.from(data);
  // data에서 header를 자르기(subarray) 위해, Buffer에 담아준다.

  const { length, handlerId } = readHeader(buffer);
  console.log('length : ', length);
  console.log('handlerId : ', handlerId);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
  const message = buffer.subarray(headerSize);
  // handerSize ~ buffer.length - 1까지 자르기
  console.log(`server 에게 받은 메세지 : ${message}`);
});

client.on('close', () => {
  // 'close'는 서버와 클라이언트 양쪽의 연결이 끊겼을 경우
  // 이벤트와 달리, 양쪽 모두 닫혔음을 의미하고, 리소스 해제나 후속 작업을 처리할 때 유용하다.
  console.log('Connection Closed');
});

client.on('error', (err) => {
  console.log('Client error : ', err);
});
