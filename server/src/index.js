const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const port = 8030

app.use(cors({}));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


const raw = fs.readFileSync("src/todo.json");

const data = JSON.parse(raw);
//lấy toàn bộ thông tin trong db.json
app.get("/api/v1/todos", (req, res) => {
  const { per_page } = req.query;
  const arrSlice = data.todo.slice(0, +per_page);
  res.status(200).json(arrSlice);
});

//thêm 

app.post ("/api/v1/todos", (req,res)=>{
  // console.log(req.body);
  data.todo.unshift(req.body);
  fs.writeFileSync("src/todo.json", JSON.stringify(data));
  res.status(201).json(data.todo);
})

//xóa
app.delete("/api/v1/todos/:id", (req,res)=>{

  const index = data.todo.findIndex((e)=> e.id === req.params.id);
  data.todo.splice(index, 1);
  fs.writeFileSync("src/todo.json", JSON.stringify(data));
  res.status(201).json(data.todo);
})

//xóa hết

app.delete("/api/v1/todos", (req, res) => {
  data.todo = [];
  fs.writeFileSync("src/todo.json", JSON.stringify(data));
  res.status(201).json(data.todo);
});

//sửa

app.put("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = data.todo.findIndex((item) => item.id == id);
  // console.log(index);
  data.todo[index] = req.body;

  fs.writeFileSync("src/todo.json", JSON.stringify(data));

  res.status(201).json(data.todo);
});

//sửa completed

app.patch("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = data.todo.findIndex((item) => item.id == id);
  // console.log(index);
  data.todo[index].completed = !req.body.completed;
  // console.log(data.todo[index]);
  fs.writeFileSync("src/todo.json", JSON.stringify(data));

  res.status(201).json(data.todo);
});



app.listen(port, ()=>{
  console.log(`Server đang chạy tại http://localhost: ${port}`);
})
