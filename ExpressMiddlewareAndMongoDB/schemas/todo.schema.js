import mongoose from "mongoose";

// 물리적인 스키마를 바탕으로 작성
const TodoSchema = new mongoose.Schema({
  value: {
    type: String, // DB에 저장될 데이터 타입
    required: true, // DB에 필수 요소 표기
    // MYSQL에서 NOT NULL 같은 개념
  },
  order: {
    type: Number,
    required: true, // DB에 필수 요소 표기
    // MYSQL에서 NOT NULL 같은 개념
  },
  doneAt: {
    type: Date,
    required: false, // DB 필수 요소는 아님
    // NULL(데이터 없음) 가능
  },

  // value, order, doneAt 하나하나가
  // DB에서 fields 또는 colum이 된다.

  // value, order, doneAt에 해당 하는
  // 데이터가 생긴다면 그 데이터를 tupple, row라고 부른다.
});

// 프론트엔드로 서빙하기 위한 코드(몰라도 괜찮다!!)
TodoSchema.virtual("todoId").get(() => {
  return this._id.toHexString();
});

// 프론트엔드로 서빙하기 위한 코드(몰라도 괜찮다!!)
TodoSchema.set("toJSON", {
  virtual: true,
});

// TodoSchema를 바탕으로 Todo 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Todo", TodoSchema);
