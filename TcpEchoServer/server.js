import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from './constant.js';
import handlers from './handlers/index.js';
// net 모듈 사용 이유 : TCP 서버를 기본적으로 만들어준다.

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected : ${socket.remoteAddress} : ${socket.remotePort}`);
  // 소켓으로 접속한 유저 주소와 포트 주소

  socket.on('connect', () => {});

  socket.on('data', (data) => {
    const buffer = Buffer.from(data);
    // data에서 header를 자르기(subarray) 위해, Buffer에 담아준다.

    // 서버가 클라이언트로부터 데이터를 받을 때 마다 발생
    // data는 버퍼 형태로 제공되며, 이를 문자열로 변환하거나 원하는 형식으로 처리할 수 있다.
    const { length, handlerId } = readHeader(buffer);
    console.log('length : ', length);
    console.log('handlerId : ', handlerId);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error : Message Length ${length}`);
      socket.write(`Error : Message Too Long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error : No Handler Found For ID  ${handlerId}`);
      socket.write(`Error Invalid Handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
    const message = buffer.subarray(headerSize);
    // 0 ~ headerSize 만큼 buffer의 내용을 자른다.

    console.log(`client 에게 받은 메세지 : ${message}`);

    const responseBuffer = handler(message);
    // Evnet에 따른 handler로 message를 처리합니다.
    // return 결과는 처리된 결과를 Buffer에 담은 배열입니다.

    const header = writeHeader(responseBuffer.length, handlerId);
    // Buffer에 담긴 메세지의 길이와 handerId로 Header를 만든다.

    const packet = Buffer.concat([header, responseBuffer]);
    // Header의 내용과 응답으로 돌려줄 메시지를 하나의 Buffer로 만들어 Client에게 보낸다.

    socket.write(packet);
    // data를 보낸 Client의 주소로 data를 그대로 되돌려 준다.
  });

  socket.on('end', () => {
    // 소켓의 다른 쪽에서 FIN 패킷을 보내아 데이터 전송이 완료 되었음을 나타낼 때 발생
    // => 클라이언트가 더 이상 데이터를 보내지 않을 때 발생합니다.

    console.log(`Client disconnected : ${socket.remoteAddress} : ${socket.remotePort}`);
    // 해당 소켓으로 접속한 유저와 연결이 끊겼을 경우 유저 주소와 포트 주소
  });

  socket.on('error', (error) => {
    // 에러가 발생했을 때 발생합니다. 이 이벤트 이후에 close 이벤트가 호출됩니다.
    console.log(`Socket error : ${error}`);
  });
});
// 서버 생성

// 서버 실행
server.listen(PORT, () => {
  console.log(`Echo Server listening on port ${PORT}`);
  console.log(server.address());
});
