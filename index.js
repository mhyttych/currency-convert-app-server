const express = require("express");
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Currency conversion app");
})

// start server
app.listen(process.env.PORT || 5000, () => console.log("server started"));

// routes
app.use("/api/convert", require("./routes/convert"));

// error handler
app.use(errorHandler);
