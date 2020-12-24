import express from "express";
// import redis from "redis";
let app = express();
let port  = process.env.PORT || 4500;
app.use(express.json());
import indexRoutes from "./routes/index";


app.use('/api', indexRoutes);
app.listen(port, () => console.log(`port working on ${port}`));
