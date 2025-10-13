require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/index");
const User = require("./models/user");
const Task = require("./models/task");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:5174", credentials: true })); // set your frontend origin
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


const PORT = process.env.PORT || 4000;

(async () => {
  await sequelize.sync({ alter: true }); // dev: keep sync simple
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();
