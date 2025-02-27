import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRoute from "./route/productsRoute.js";
import memberRouter from "./route/memberRoute.js";
import cartRoute from "./route/cartRoute.js";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://10.64.188.181:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/img_pd", express.static("img_pd"));
app.use("/img_mem", express.static("img_mem"));
app.use(productsRoute);
app.use(memberRouter);
app.use(cartRoute);
// const { Pool } = pkg;
const port = process.env.PORT;
app.listen(port, () => {
  console.log("port", port);
});
