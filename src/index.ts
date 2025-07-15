
import express from "express";
import sequelize from "./config/db";
import dotenv from 'dotenv'
import router from './routes/index'
import helmet from "helmet"
import cors from 'cors'
import bodyParser from "body-parser";
import { initDb } from "./models";
import path from "path";

dotenv.config()
const app = express();

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
//Routes
app.use("/api",router)


app.get("/", (req, res) => {
  res.send("Usat register api");
});
initDb()

// server and database runnig test
const port = process.env.PORT
app.listen(port, () => {
    sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });

  console.log(`Server is running on port ${port}`);
});
