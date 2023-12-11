import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loading from "./loading";

export default function Home() {
  const [allText, setAllText] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [newText, setNewText] = useState({
    text: "",
  });
  const [loading, setLoading] = useState(false);

  const [flag, setFlag] = useState(false);
  const [edit, setEdit] = useState(false);

  //lấy tất cả về
  const getAll = async () => {
    setLoading(true)
    const itemPerPage = 4;
    // console.log(res.data.todo);
    try {
      const res = await axios.get(
        `http://localhost:8030/api/v1/todos?per_page=${itemPerPage}`
      );
      const completdTodo = res.data.filter((e) => e.completed == false);
      setCompleted(completdTodo.length);
      setAllText(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };
  //  console.log(allText);
  useEffect(() => {
    getAll();
  }, [flag]);

  //thêm
  const handleAdd = async () => {
    try {
      const res = await axios.post("http://localhost:8030/api/v1/todos", {
        ...newText,
        id: uuidv4(),
        completed: false,
      });
      setAllText(res.data);
      setNewText({
        text: "",
      });
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    setFlag(!flag);
  };

  //xóa
  const handleDelete = async (id) => {
    try {
      if (confirm("Bạn có muốn xóa không ")) {
        const res = await axios.delete(
          `http://localhost:8030/api/v1/todos/${id}`
        );
        // console.log(res.data);
        setFlag(!flag);
        // console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //xóa hết
  const handleAllDelete = async () => {
    try {
      if (confirm("Bạn có muốn xóa tất cả không")) {
        const res = await axios.delete("http://localhost:8030/api/v1/todos");
        // console.log(res.data);
        setFlag(!flag);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //sửa
  const handleEdit = async (item) => {
    setNewText(item);
    setEdit(true);
  };

  //lưu
  const handleSave = async () => {
    // console.log(newText);
    try {
      await axios.put(
        `http://localhost:8030/api/v1/todos/${newText.id}`,
        newText
      );
      setFlag(!flag);
      setEdit(false);
      setNewText({
        text: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //đổi completed
  const handleChangeCompleted = async (p) => {
    // console.log(p.id);
    try {
      await axios.patch(`http://localhost:8030/api/v1/todos/${p.id}`, p);
      setFlag(!flag);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{backgroundColor:"#07f6f666", padding:"30px", height:"650px"}}>
      <div style={{ marginLeft: "530px", width: "460px", fontFamily:"sans-serif", backgroundColor:"#fff", padding:"20px" }}>
        <div style={{textAlign:"center"}}>
          <h2>TODOLIST</h2>
        </div>
        <div style={{ display: "flex" }}>
          <Input
            placeholder="Add new "
            style={{ width: "390px", marginRight: "10px" }}
            name="text"
            value={newText.text}
            onChange={(e) =>
              setNewText({ ...newText, [e.target.name]: e.target.value })
            }
          />
          <Button
            style={{ backgroundColor: "#fff" }}
            onClick={edit ? handleSave : handleAdd}
          >
            {edit ? "Save" : "Add"}
          </Button>
        </div>
        
        <div>
          {!loading ? allText.map((item, i) => {
            return (
              <ul
                key={i}
                style={{
                  marginTop: "10px",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  height: "30px",
                  padding: "8px",
                  lineHeight: "30px",
                  backgroundColor:"#fff"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeCompleted(item);
                }}
              >
                <li onClick={() => handleEdit(item)}>
                  <p
                    style={{
                      textDecoration: item.completed ? "line-through" : "",
                      margin: "0",
                      cursor: "pointer",
                    }}
                  >
                    {item.text}
                  </p>
                </li>
                <li>
                  <b
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </b>
                </li>
              </ul>
            );
          }) 
          : <div style={{display: 'flex', justifyContent: 'center'}}><Loading/></div>}
        </div>
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "460px",
          }}
        >
          <p>
            You have <b>{completed}</b> pending tasks
          </p>
          <Button style={{ marginTop: "10px" }} onClick={handleAllDelete}>
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
