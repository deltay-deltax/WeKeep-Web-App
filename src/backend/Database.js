const mongoose = require("mongoose");

const uri =
  "mongodb+srv://arunfrancistellis8:YBJ8KoGLIymLBq3W@wekeepcluster.pycucwp.mongodb.net/?retryWrites=true&w=majority&appName=WeKeepCluster";
mongoose
  .connect(uri)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("failed");
    console.log(err);
  });
