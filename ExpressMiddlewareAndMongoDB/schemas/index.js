import mongoose from "mongoose";

let connect = () => {
  mongoose
    .connect(
      "mongodb+srv://wlsdbstp1234:jinyunse1999^^@expressmongo.egahk.mongodb.net/?retryWrites=true&w=majority&appName=ExpressMongo",
      {
        dbName: "ExpressMongo",
      },
    )
    .catch((err) => console(err))
    .then(() => console.log("몽구 DB 연결 성공"));
};

export default connect;
