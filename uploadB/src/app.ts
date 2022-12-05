
import express, { response } from 'express';
const cors = require('cors')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const Pool = require("pg").Pool;
const fs = require("fs");


const app = express();
app.use(cors())
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json ({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');

});


let file ={
  fileName:'',
  size:0,
  uploadedDate:''
}

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "files",
  password: "123",
  port: 5432,
};
const pool = new Pool(credentials);




const date =()=>{
  return new Date;
}



app.post("/add", async (req, res) => {
try {
  const template = "INSERT INTO filestbl VALUES ($1, $2, $3)";
		const response = await pool.query(template, [req.body.size , date(),req.body.name]);
		res.json({ status: "ok", results: { name: req.body.name,size: req.body.size,date:date()} });
} catch (error) {
  console.log(error);
}
	
});


const getAll = (req, response ) => {
  try {
    pool.query('SELECT * FROM filestbl', (error, data) => {
      if (error) {
        throw error;
      }
     const dat = JSON.stringify(data.rows);
      response.json({status: 'ok',result:{ dat}});
    })
  } catch (error) {
    console.log(error)
  }
}
app.get("/getFileList",getAll);

app.delete("/remove/:id", (req ,res) => {
 
  try {
    const text = `DELETE FROM filestbl WHERE fileName = $1`;
    const values = [req.params.id];
    console.log(values);
    res.json({status:'ok',result:'deleted'+req.params.id});
    return pool.query(text, values);
  } catch (error) {
   console.log(error);
  }
})


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
