"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import redis from "redis";
let app = express_1.default();
let port = process.env.PORT || 4500;
app.use(express_1.default.json());
const index_1 = __importDefault(require("./routes/index"));
app.use('/api', index_1.default);
app.listen(port, () => console.log(`port working on ${port}`));
