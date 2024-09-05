const mongoose = require("mongoose");
const mongooseConnection = require("./config/db");
const app = require('./app');
const PORT = 5000;

app.get('/', (req, res) => {
  res.send("SERVER IS RUNNING");
});

mongooseConnection.on("connected", async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongooseConnection.on("error", (err) => {
  console.error("Failed to connect to MongoDB:", err);
});
