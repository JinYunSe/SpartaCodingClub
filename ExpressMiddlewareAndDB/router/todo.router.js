import express from "express";
import Joi from "joi";
import Todo from "../schemas/todo.schema.js";

const router = express.Router();

const createTodoSchema = Joi.object({
  value: Joi.string().min(1).max(50).required(),
});

// 할일 등록 API
// (중요) async를 줘서 비동기 함수로 구현한다.
router.post("/todos", async (req, res, next) => {
  try {
    // 쿨라이언트에게 전달받은 데이터를 검증합니다.
    const validation = await createTodoSchema.validateAsync(req.body);

    // 클라이언트에게 전달받은 value 데이터를 변수에 저장합니다.
    const { value } = validation;

    const todoMaxOrder = await Todo.findOne().sort("-order").exec();

    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    const todo = new Todo({ value, order });

    await todo.save();

    return res.status(201).json({ todo: todo });
  } catch (error) {
    // Router 다음에 있는 에러 처리 미들웨어를 실행한다.
    next(error);
  }
});

// 해야할 일 조회 API
router.get("/todos", async (req, res) => {
  // Todo 모델을 이용해, MongoDB에서 값이 가장 높은 order을 찾습니다
  let todos = await Todo.find().sort("-order").exec();
  //                  find함수로 찾은 모든 데이터를
  //                  -order로 내림차순해서 가져옵니다.

  // 찾은 "해야할 일"을 클라이언트에게 전달
  return res.json({ todos });
});

// 해야할 일 순서 변경, 완료/해제, 내용 변경 API
router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, doneAt, value } = req.body;

  // 현재 나의 order가 무엇인지 알아야한다.
  const currentTodo = await Todo.findById(todoId).exec();
  //            findById()를 통해 todoId에 해당하는 id를 가져올 것이다.

  if (!currentTodo)
    return res
      .status(404)
      .json({ errorMessge: "존재하지 않는 해야할 일 입니다." });

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    //                  findOne({order})를 줘서 찾고자하는
    //                  데이터 값만을 가져 옵니다.
    //                  Todo.findOne({order : order}) 와 동일
    //                  객체 분해할당 조립으로 생략함

    if (targetTodo) {
      // 변경 대상이 존재할 때만 변경
      targetTodo.order = currentTodo.order;
      // 변경 대상의 순위를 현재 해야하는 순위로 바꾼다.
      // (할 일을 앞 당겨준다.)
      await targetTodo.save();
      // 실제 데이터 베이스에 저장
    }

    currentTodo.order = order;
    // 현재 순서의 대상을 내가 지정한 순서로 변경
    // (할 일을 뒤로 미뤄준다.)
  }

  // 할 일 내용 수정
  if (value) currentTodo.value = value;

  if (doneAt !== undefined) currentTodo.doneAt = doneAt ? new Date() : null;
  // done이 undefined가 아닐 경우 done을 비교해
  // true이면 완료한 날짜와 시간을
  // null이나 false일 경우 null을 넣어줍니다.
  await currentTodo.save();

  return res.status(200).json({});
});

// 할 일 삭제
router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();

  //  해당하는 일이 없을 경우
  if (!todo)
    return res
      .status(404)
      .json({ errorMessge: "존재하지 않는 해야할 일 정보입니다." });

  await Todo.deleteOne({ _id: todo.id });
  // Todo.deleteOne으로 찾고자 하는 id에 해당하는
  // 객체를 제거해줍니다.

  return res.status(200).json({});
});

export default router;
