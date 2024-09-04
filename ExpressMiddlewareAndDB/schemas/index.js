import mongoose from "mongoose";

let connect = () => {
  mongoose
    .connect(
      "mongodb+srv://@expressmongo.egahk.mongodb.net/?retryWrites=true&w=majority&appName=ExpressMongo",
      {
        dbName: "ExpressMongo",
      },
    )
    .catch((err) => console(err))
    .then(() => console.log("몽구 DB 연결 성공"));
};

export default connect;
