import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 최상위 경로
const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  //../protobuf 폴더 내에 .proto로 끝나는 파일들을 읽어오기 위한 함수
  // 매개변수로는 dir로 디렉토리 경로와 fileList라는 배열로 향후 확장성을 위해 존재하는 중 입니다.
  const files = fs.readdirSync(dir);
  // 해당 폴더의 파일들을 읽어온다.
  files.forEach((file) => {
    // 읽어온 파일들에서
    const filePath = path.join(dir, file);
    // 파일의 확장자와 위치를 붙여 경로를 만들어줍니다.

    // 만약 읽어온 무언가가 디렉토리이면
    if (fs.statSync(filePath).isDirectory()) {
      // 재귀 함수 형태로 다시 그 읽어온 디렉토리를 넣어 파일을 읽어오게 만들어줍니다.
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      // 만약 읽어온 무언가가 파일이고, .proto 파일이면
      fileList.push(filePath);
      // 리스트에 추가해줍니다.
    }
  });

  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();
    // protobuf에서 new 연산자로 Root() 객체를 만들어줍니다.

    await Promise.all(protoFiles.map((file) => root.load(file)));
    // Promise.all로 파일들을 한 번에 읽어옵니다.

    // protoMessages를 사용하기 위해서 protoMessages에 내용물을 맵핑하기 위해 packetNames를 가져옵니다.
    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[namespace][type] = root.lookupType(typeName);
      }
    }
    console.log(protoMessages);
    console.log('Protobuf 파일이 로드 됐습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다 : ', error);
  }
};

export const getProtoMessages = () => {
  // console.log('protoMessages:', protoMessages); // 디버깅을 위해 추가
  return { ...protoMessages };
};
