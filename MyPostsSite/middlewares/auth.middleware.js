import prisma from "../src/utils/prisma/index.js";

// 1. 클라이언트로 부터 **쿠키(Cookie)**를 전달받습니다.
// 2. **쿠키(Cookie)**가 **Bearer 토큰** 형식인지 확인합니다.
// 3. 서버에서 발급한 **JWT가 맞는지 검증**합니다.
// 4. JWT의 `userId`를 이용해 사용자를 조회합니다.
// 5. `req.user` 에 조회된 사용자 정보를 할당합니다.
// 6. 다음 미들웨어를 실행합니다.

export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) throw new Error("로그인이 필요합니다.");

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      res.clearCookie("authorization");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    // req.user의 정보를 user 정보로 제공해준다.
    req.user = user;

    // 다음 미들웨어가 호출될 수 있도록 next()를 사용한다.
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}
