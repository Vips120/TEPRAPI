"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeuser = exports.updateuser = exports.createuser = exports.userbyId = exports.users = void 0;
const util_1 = require("util");
const db_1 = require("../db");
const index_1 = require("../redis/index");
const GET_ASYNC = util_1.promisify(index_1.client.get).bind(index_1.client);
const SET_ASYNC = util_1.promisify(index_1.client.setex).bind(index_1.client);
exports.users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield GET_ASYNC('users');
        if (reply) {
            console.log('cached using');
            return res.status(200).json(reply);
        }
        ;
        let fetchallusers = yield db_1.pool.query('SELECT * FROM users');
        //   console.log(fetchallusers);
        let response = yield SET_ASYNC('users', 35, JSON.stringify(fetchallusers.rows));
        console.log('new data cached', response);
        return res.status(200).json(fetchallusers.rows);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
    // res.send(fetchallusers);
});
exports.userbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        let user = yield db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
        if (user.rowCount === 0) {
            return res.status(404).send({ message: 'Invalid user id' });
        }
        ;
        return res.status(200).json(user.rows);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
});
exports.createuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.body;
        console.log(name);
        console.log(email);
        let user = yield db_1.pool.query(`INSERT INTO users(name,email) VALUES($1,$2)`, [name, email]);
        return res.status(200).send({ message: 'user inserted' });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
});
exports.updateuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.id);
        let user = yield db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
        // console.log(user);
        if (user.rowCount === 0) {
            return res.status(404).send({ message: 'Invalid user id' });
        }
        ;
        let newuser = yield db_1.pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3', [req.body.name, req.body.email, req.params.id]);
        return res.status(200).send({ message: 'user updated' });
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
});
exports.removeuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id]);
        if (user.rowCount === 0) {
            return res.status(404).send({ message: "Invalid userid" });
        }
        ;
        let removeuser = yield db_1.pool.query(`DELETE FROM users where id=$1`, [req.params.id]);
        return res.status(200).send({ message: `${req.params.id} is removed` });
    }
    catch (error) {
        return res.status(500).send(error.mesage);
    }
});
