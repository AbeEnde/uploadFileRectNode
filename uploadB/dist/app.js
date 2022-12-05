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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const Pool = require("pg").Pool;
const fs = require("fs");
const app = (0, express_1.default)();
app.use(cors());
app.use(fileupload());
app.use(express_1.default.static("files"));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
let file = {
    fileName: '',
    size: 0,
    uploadedDate: ''
};
const credentials = {
    user: "postgres",
    host: "localhost",
    database: "files",
    password: "123",
    port: 5432,
};
const pool = new Pool(credentials);
const date = () => {
    return new Date;
};
app.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = "INSERT INTO filestbl VALUES ($1, $2, $3)";
        const response = yield pool.query(template, [req.body.size, date(), req.body.name]);
        res.json({ status: "ok", results: { name: req.body.name, size: req.body.size, date: date() } });
    }
    catch (error) {
        console.log(error);
    }
}));
const getAll = (req, response) => {
    try {
        pool.query('SELECT * FROM filestbl', (error, data) => {
            if (error) {
                throw error;
            }
            const dat = JSON.stringify(data.rows);
            response.json({ status: 'ok', result: { dat } });
        });
    }
    catch (error) {
        console.log(error);
    }
};
app.get("/getFileList", getAll);
app.delete("/remove/:id", (req, res) => {
    try {
        const text = `DELETE FROM filestbl WHERE fileName = $1`;
        const values = [req.params.id];
        console.log(values);
        res.json({ status: 'ok', result: 'deleted' + req.params.id });
        return pool.query(text, values);
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map