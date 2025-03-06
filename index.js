import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRoute from "./route/productsRoute.js";
import memberRouter from "./route/memberRoute.js";
import cartRoute from "./route/cartRoute.js";
// import ส่วนที่ติดตั้งเข้ามา
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
// ใช้ File
import fs from "fs"

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
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use("/img_pd", express.static("img_pd"));
app.use("/img_mem", express.static("img_mem"));
app.use(productsRoute);
app.use(memberRouter);
app.use(cartRoute);

// swagger
const swaggerfile = fs.readFileSync('service/swagger.yaml','utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc))
app.use('/',swaggerUI.serve,swaggerUI.setup(swaggerDoc))
// const { Pool } = pkg;

const port = process.env.PORT;
app.listen(port, () => {
  console.log("port", port);
});
