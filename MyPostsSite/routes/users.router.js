import express from "express";
import prisma from "../src/utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

const UsersRouter = express.Router();

// 1. `email`, `password`, `name`, `age`, `gender`, `profileImage`를 **body**로 전달받습니다.
// 2. 동일한 `email`을 가진 사용자가 있는지 확인합니다.
// 3. **Users** 테이블에 `email`, `password`를 이용해 사용자를 생성합니다.
// 4. **UserInfos** 테이블에 `name`, `age`, `gender`, `profileImage`를 이용해 사용자 정보를 생성합니다.

// 회원가입 API
UsersRouter.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, name, age, gender, profileImage } = req.body;
    const isExistUser = await prisma.Users.findFirst({
      where: {
        email,
      },
    });
    if (isExistUser)
      return res.status(409).json({ message: "이미 존재하는 이메일 입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, userInfo] = await prisma.$transaction(
      async tx => {
        // User 테이블에 값 넣기
        const user = await tx.Users.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

        // UserInfos 테이블에 값 넣기
        const userInfo = await tx.UserInfos.create({
          data: {
            userId: user.userId,
            //생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
            name,
            age,
            gender: gender.toUpperCase(), //성별 대문자로 변환
            profileImage,
          },
        });
        return [user, userInfo];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
    return res.status(201).json({ massage: "회원가입에 성공했습니다" });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
UsersRouter.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  // 로그인에 성공하면, 사용자의 userId를 바탕으로 세션을 생성합니다.
  req.session.userId = user.userId;

  //        cookie 이름, Bearer 토큰 형식으로 token 정보 전달
  return res.status(200).json({ message: "로그인 성공" });
});

// **[게시판 프로젝트] 사용자 정보 조회 API 비즈니스 로직**

// 1. 클라이언트가 **로그인된 사용자인지 검증**합니다.
// 2. 사용자를 조회할 때, 1:1 관계를 맺고 있는 **Users**와 **UserInfos** 테이블을 조회합니다.
// 3. 조회한 사용자의 상세한 정보를 클라이언트에게 반환합니다.

/** 사용자 조회 API **/
UsersRouter.get("/users", authMiddleware, async (req, res, next) => {
  //               로그인 된 사용자인지 검증을
  //               auth.middleware.js에서 할 수 있게 넘겨줍니다.
  //               로그인 된 사용자라면 예외처리문에서 통과 돼
  //               아래의 로직이 실행될 것 입니다.
  //               로그인 안 된 사용자라면 예외처리로
  //               Client에게 Response가 갈 것 입니다.
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      userInfos: {
        //userInfos는 schema.prisma에서 관계를 형성할 때 사용한 Colum명으로 적어야 합니다.
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

// 사용자 정보 변경 API
UsersRouter.patch("/users", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const userInfo = await prisma.userInfos.findFirst({
      where: {
        userId: +userId,
      },
    });
    if (!userInfo)
      return res
        .status(404)
        .json({ mssage: "사용자 정보가 존재하지 않습니다." });

    await prisma.$transaction(
      async tx => {
        await tx.UserInfos.update({
          where: {
            userId: +userId,
          },
          data: {
            ...updatedData,
            //spread 연산자로 변경사항이 있는 값만 변경해준다.
          },
        });

        //반복문과 조건문으로 변경이 있는 데이터만 변경을 조회한다.
        for (let key in updatedData) {
          if (userInfo[key] !== updatedData[key]) {
            await tx.UserHistories.create({
              data: {
                userId: +userId,
                changedField: key,
                // key가 변경된 값이기 때문에 key를 제공한다.
                oldValue: String(userInfo[key]),
                // 이전 값은 userInfo에 있으니깐 userInfo[key]로 값을 전달
                newValue: String(updatedData[key]),
                // 새로운값은 updatedData가 갖고 있어 때문에 updatedDaya[key]로 값을 전달
              },
            });
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res
      .status(200)
      .json({ massage: "사용자 정보 변경에 성공하였습니다." });
  } catch (err) {
    next(err);
  }
});

export default UsersRouter;
