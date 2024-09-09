import express from "express";
import prisma from "../src/utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const PostsRouter = express.Router();

// 게시글 생성 API
PostsRouter.post("/posts", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { title, content } = req.body;

  const post = await prisma.Posts.create({
    data: {
      userId: +userId,
      title,
      content,
    },
  });

  return res.status(201).json({ data: post });
});

// 게시글 전체 조회 API
PostsRouter.get("/posts", async (req, res, next) => {
  const posts = await prisma.Posts.findMany({
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      postId: "desc",
    },
  });
  return res.status(200).json({ data: posts });
});

// 게시글 검색 조회 API
PostsRouter.get("/posts/:postId", async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.Posts.findFirst({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post)
    return res.status(204).json({ message: "게시글이 존재하지 않습니다" });

  return res.status(200).json({ data: post });
});

export default PostsRouter;
