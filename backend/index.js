const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/dbConfig");
const image = require("./src/routes/imageRoutes");
const documents = require("./src/routes/documentRoutes");
const connectCloudinary = require("./src/config/cloudinary");

dotenv.config()
const app = express()
app.use(express.json())
connectCloudinary()

app.use("/images", image)
app.use("/documents", documents)

app.listen(process.env.PORT, async() => {
    await connectDb()
  console.log(`Server running on port ${process.env.PORT}`);
});