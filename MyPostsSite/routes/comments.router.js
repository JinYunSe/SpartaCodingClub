import express from "express";
import prisma from "../src/utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const CommentsRouter = express.Router();

CommentsRouter.post(
  "/posts/:postId/comments",
  authMiddleware,
  async (req, res) => {
    const { postId } = req.params; // 댓글을 작성할 게시글 찾기
    const { userId } = req.user; // 작성자 Id
    const { content } = req.body; // content
    const post = await prisma.Posts.findFirst({
      where: {
        postId: +postId,
      },
    });
    // 게시글 찾기

    if (!post)
      return res.json(404).json({ message: "게시글이 존재하지 않습니다." });

    const comment = await prisma.Comments.create({
      data: {
        userId: +userId, // 댓글 작성자 ID
        postId: +postId, // 댓글 작성 게시글 ID
        content: content,
      },
    });

    return res.status(201).json({ data: comment });
  }
);

// 댓글 전체조회 API
CommentsRouter.get("/posts/:postId/comments", async (req, res, next) => {
  const { postId } = req.params;

  const post = await prisma.Posts.findFirst({
    where: {
      postId: +postId,
    },
  });

  if (!post)
    return res.json(404).json({ message: "게시글을 찾을 수 없습니다." });

  const comments = await prisma.Comments.findMany({
    where: {
      postId: +postId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({ data: comments });
});

export default CommentsRouter;
