import express from "express";
import prisma from "../utils/prisma/index.js";

const router = express.Router();

// 게시글 등록 API
router.post("/posts", async (req, res, next) => {
  const { title, content, password } = req.body;
  const post = await prisma.Posts.create({
    data: {
      title,
      content,
      password,
    },
  });
  // 데이터 삽입을 SQL에서는 Insert Into지만,
  // Prisma에서는 prisma.지정한테이블이름.create({data : {values}})
  // 로 가능하다.
  return res.status(201).json({ data: post });
});

// 게시글 조회 API
router.get("/posts", async (req, res, next) => {
  const posts = await prisma.Posts.findMany({
    select: {
      postId: true,
      title: true,
      content: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  //prisma.테이블 이름.findMany({ select : {값들 출력 여부 : true(출력)},})
  //findMany : 테이블 전체 조회
  //findFirst : 조건에 맞는 첫 번 째 행(tupple, row, recode)을 제공한다.
  //findFirstOrThrow : 조건에 맞는 첫 번째 레코드를 찾는데 없을 경우 예외를 발생.
  //findUnique : Unique 필드를 기반 조건에 맞는 첫 번째 레코드만 제공한다.
  //findUniqueOrThrow : Unique 필드를 기반 조건에 맞는 첫 번째 레코드를 찾는데 없을 경우 예외 발생
  return res.status(200).json({ data: posts });
});

// 특정 게시글 조회 API
router.get("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.Posts.findFirst({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  // where : {테이블의 Colum : 찾고자 하는 값 가진 변수}
  //으로 비교를 먼저한다! 이때, postId는 Int 형이기 때문에,
  //Number(찾고자 하는 값 가진 변수)
  //ParseInt(찾고자 하는 값 가진 변수)
  //+ 찾고자 하는 값 변수
  //(덧셈으로 인식해서 암묵적 형변환이 발생했을거라 생각한다.)
  //로 해야 정상 동작하게 된다.

  // 조건에 부합하는 row는
  // select : {Colum : true}로 출력여부를 결정해줄 수 있다.
  return res.status(200).json({ data: post });
});

// 게시글 수정 API
router.put("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, password } = req.body;

  const post = await prisma.Posts.findUnique({
    where: {
      postId: +postId,
    },
  });
  //findFirst도 가능하지만
  //findUnique로 중복이 없는 값을 통해
  //찾고자 하는 row를 찾는다.

  if (!post) res.status(404).json({ massage: "게시글이 존재하지 않습니다." });
  // 찾고자 하는 row가 없다면

  if (post.password !== password)
    res.status(401).json({ massage: "비밀번호가 일치하지 않습니다" });
  // 찾고자 하는 row의 password와 Client가 제공한 password가 다르다면

  await prisma.Posts.update({
    where: {
      postId: +postId,
      password: password,
    },
    data: {
      title: title,
      content: content,
    },
  });

  //prisma.테이블 이름
  //.update({where:{테이블 Colum Name : 찾고자 하는 Colum Name}
  //,data : {변경할 Colum Name},})
  // where 조건에 row를 찾고
  // data를 row에 Colum 값 변경한다.

  //return res.status(201).json({ data: "게시글이 수정되었습니다." });
  const updatedPost = await prisma.Posts.findUnique({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 수정된 게시글 정보를 클라이언트에게 반환
  return res.status(200).json({ data: updatedPost });
});

// 게시글 삭제 API
router.delete("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { password } = req.body;
  // 게시글을 작성한 사람인지 확인을 위해 사용

  let post = await prisma.Posts.findFirst({
    where: {
      postId: +postId,
    },
  });
  // 게시글 유무 판단 및 비밀번호 비교를 위해 select 문 사용
  if (!post) res.status(404).json({ massage: "게시글을 찾지 못 했습니다" });

  if (post.password !== password)
    res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });

  await prisma.Posts.delete({
    where: {
      postId: +postId,
    },
  });
  // 모든 조건을 만족했다면 게시글 Id를 비교해 해당 게시글을 삭제한다.

  // 삭제 및 즉시 조회 코드
  // post = await prisma.Posts.findMany({
  //   select: {
  //     postId: true,
  //     title: true,
  //     content: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });
  // return res.status(200).json({ data: post });

  return res.status(200).json({ massage: "게시글이 삭제 됐습니다." });
});

export default router;
