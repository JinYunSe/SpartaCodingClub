import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constant.js';

// 해더를 읽는 함수
export const readHeader = (buffer) => {
  return { length: buffer.readUInt32BE(0), handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE) };

  // 앞의 4Byte가 TotalLength(전체) 길이니깐
  // 전체 길이는 앞에서부터 32bit를 읽어옵니다(빅인디안 방식)
  // 32bit = 4Byte

  // handlerId 또한, buffer에서 읽어올 것인데 2Byte이기 때문에 readUInt16BE로 읽어옵니다.
  // 16bit = 2Byte
  // 이때, 시작 위치는 TotalLength를 읽어온 이후 위치부터이기 떄문에
  // constant.js에 상수로 적은 TOTAL_LENGTH_SIZE를 offset 값으로 적어줍니다.
};

// 해더를 쓰는 함수
export const writeHeader = (messageLength, handlerId) => {
  //                  messageLength : 메시지(message)의 길이
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  // Buffer에 길이와 핸들러 Id를 적어줘야 하기 때문에
  // headerSize로 constant.js의 TOTAL_LENGTH_SIZE + HANDLER_ID로 할당해줍니다.
  const buffer = Buffer.alloc(headerSize);
  // 그리고 Buffer.alloc(headerSize)로 headerSize만큼의 Byte 배열을 만들어줍니다.

  buffer.writeUint32BE(messageLength + headerSize, 0);
  // 이제 Byte 배열에 앞에서 부터 32bit(4Byte) 만큼 써 줄 것 입니다.
  // buffer에 쓸 내용은 message의 길이와 headerSize(해더) 크기를 같이 써준 크기가 돼야 합니다.
  // => 우리가 전송하는 진짜 Byte 크기

  buffer.writeUint16BE(handlerId, TOTAL_LENGTH_SIZE);
  // 마지막으로, handlerId도 Total_LENGTH_SIZE 다음 위치부터 크기 만큼 작성해줍니다.
  return buffer;
};
