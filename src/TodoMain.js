import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./TodoUi.css";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import TodoNavbar from "./TodoComponents/TodoNavbar";
import TodoHead from "./TodoComponents/TodoTableHead";
import * as emailjs from "emailjs-com";

function TodoUi() {
  //====Date/Time ====>

  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // == Edit ====>

  const [openInput, setopenInput] = useState(false);

  const [openInputIndex, setopenInputIndex] = useState(false);

  const [editTask, seteditTask] = useState("");

  //==Update Data ===>

  const [getData, setGetData] = useState([]);

  //==Search bar =====>

  const [search, setSearch] = useState("");

  // ==next pag==>
  const [page, setPage] = useState(1);

  // ============ Pandding / Completed =================>

  const all = getData?.filter((item) => {
    if (item.status === "Completed" || item.status === "Pending") {
      return item;
    }
  }).length;

  const completed = getData?.filter((item) => {
    if (item.status === "Completed") {
      return item;
    }
  }).length;

  const pending = getData?.filter((item) => {
    if (item.status === "Pending") {
      return item;
    }
  }).length;

  // ============Search bar =========================>

  const searchItem = getData?.filter((item) => {
    if (search === "") {
      return item;
    } else if (item.todo.toLowerCase().includes(search.toLowerCase())) {
      return item;
    }
  });

  //====Initial Data ====================================>

  const [todoData, setTodoData] = useState({
    todo: null,
    status: "Pending",
    assignedTym: `${time}`,
    assignedDate: `${date}`,
    finalizeTym: "=",
    finalizeDate: "=",
    // tymTaken: null,
  });
  const submitData = (e) => {
    const { value } = e.target;
    setTodoData({
      ...todoData,
      todo: value,
    });
  };

  // const submitTime = (e) => {
  //   const { value } = e.target;

  //   setTodoData({
  //     ...todoData,
  //     tymTaken: value,
  //   });
  // };

  // =======Post Api(snd data to data base)===============================>
  const postData = () => {
    if (todoData.todo === null /*|| todoData.tymTaken === "="*/) {
      toast.error("plz enter input", {
        position: "bottom-right",
        theme: "colored",
      });
    } else {
      axios
        .post("http://localhost:4040/todo", todoData)
        .then(() => {
          var data = {
            // to_email:"shashank@dice-academy.com",
            from_name: "zometo",
            todo: "Dice-acadamy todo-app",
            to_name: "bookmyshow",
          };

          emailjs
            .send(
              "Kush-Dashboard-Api",
              "template_vtzvjk8",
              data,
              "uOMO-zsla1p1SIJt5"
            )
            .then(
              function (response) {
                toast.success("email send", {
                  position: "bottom-right",
                  theme: "colored",
                });
              },
              function (err) {
                toast.error(" email cnot snd ", {
                  position: "bottom-right",
                  theme: "colored",
                });
              }
            );

          getNewData();
          document.getElementById("todoId").value = " ";
          // document.getElementById("tymId").value = " ";
          setTodoData({
            todo: null,
            status: "Pending",
            assignedTym: `${time}`,
            assignedDate: `${date}`,
            finalizeTym: "=",
            finalizeDate: "=",
            // tymTaken: "=",
          });
          toast.success("ToDo Added", {
            position: "bottom-right",
            theme: "colored",
          });
        })
        .catch(() => {
          console.log("Data notpost");
        });
    }
  };
  // =======Get Api(retriving data from data base)=================>

  const getNewData = () => {
    axios
      .get("http://localhost:4040/todo")
      .then((res) => {
        setGetData(res.data);
      })
      .catch(() => {
        console.log("Data notget");
      });
  };

  //==use Effect=====>

  useEffect(() => {
    getNewData();
  }, []);

  // ======= Delete Api  =============================>

  const deleteData = (data) => {
    const { id } = data;
    axios
      .delete(`http://localhost:4040/todo/${id}`)
      .then((res) => {
        getNewData();
        toast.warning("Data Deleted", {
          position: "bottom-right",
          theme: "colored",
        });
      })
      .catch(() => {
        console.log("Data notget");
      });
  };

  // ======= Put/Patch Api(update data in data base) ======================>

  const patchData = (data) => {
    const { id } = data;
    axios
      .patch("http://localhost:4040/todo/" + id, {
        status: "Completed",
        finalizeTym: `${time}`,
        finalizeDate: `${date}`,
      })
      .then((res) => {
        console.log(res.data);
        getNewData();

        var data = {
          // to_email:"shashank@dice-academy.com",
          from_name: "zometo",
          todo: "Dice-acadamy todo-app",
          to_name: "marked",
        };
        emailjs
          .send(
            "Kush-Dashboard-Api",
            "template_vtzvjk8",
            data,
            "uOMO-zsla1p1SIJt5"
          )
          .then(
            function (response) {
              toast.success("email sssssend", {
                position: "bottom-right",
                theme: "colored",
              });
            },
            function (err) {
              toast.error(" email cnot snd ", {
                position: "bottom-right",
                theme: "colored",
              });
            }
          );
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  // =======Edit Api ========================>

  const inputUpdate = (item) => {
    const { id } = item;
    axios
      .patch("http://localhost:4040/todo/" + id, {
        todo: editTask ? editTask : item.todo,
        assignedTym: `${time}`,
        assignedDate: `${date}`,
      })
      .then((res) => {
        getNewData();
        setopenInput(false);
      })
      .catch((err) => toast.error("Connection Error!"));
  };

  return (
    <>
      {/* ==============> Navbar Area <=================== */}
      <TodoNavbar
        allCount={all}
        complt={completed}
        pending={pending}
        search={(e) => setSearch(e.target.value)}
      />

      {/* ===============> Modal Area <======================= */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create-ToDo
              </h5>

              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"> &times; </span>
              </button>
            </div>

            <div className="modal-body">
              <input
                id="todoId"
                placeholder="Input here..."
                className="form-control mr-sm-2"
                onInput={(e) => submitData(e)}
              />
              {/* <br /> */}
              {/* <input
                id="tymId"
                className="form-control mr-sm-2"
                placeholder="Input time here..."
                type="time"
                onInput={(e) => submitTime(e)}
              /> */}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                data-dismiss="modal"
                className="btn bg-danger  btn-outline-light"
              >
                Close
              </button>

              <button
                type="button"
                className="btn bg-info btn-outline-light"
                data-dismiss="modal"
                onClick={postData}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===================>  Table <===========================*/}
      <table className="table table-hover">
        {/* =====>  Table Head <======*/}
        <thead className="thead-dark">
   <tr>
            {TodoHead &&
              TodoHead?.map((item) => {
                return <th scope="col">{item}</th>;
              })}
          </tr>
        </thead>

        {/*========> Table body <==========*/}

        <tbody>
          {searchItem.length != 0 ? (
            searchItem?.slice((page * 2 - 2, page * 2))?.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td> {/* Index td */}
                  <td className={item.status === "Completed" && "line"}>
                    {openInput && openInputIndex === index ? (
                      <input
                        defaultValue={item.todo}
                        onChange={(e) => seteditTask(e.target.value)}
                      />
                    ) : (
                      item.todo
                    )}
                  </td>{" "}
                  {/* Task */}
                  {
                    <td
                      className={
                        item.status === "Pending"
                          ? "red"
                          : item.status === "Completed" && "green"
                      }
                    >
                      {item.status}
                    </td>
                  }
                  {/* Status */}
                  <td>{item.assignedTym}</td>
                  <td>{item.assignedDate}</td>
                  <td>{item.finalizeTym}</td>
                  <td>{item.finalizeDate}</td>
                  <td>{`=`}</td>
                  {/*Time taken*/}
                  <td>
                    <input
                      defaultChecked={item.status === "Completed"}
                      disabled={item.status == "Completed"}
                      type="checkbox"
                      onClick={() => patchData(item)}
                    />
                  </td>
                  {/*Mark Input */}
                  <td>
                    {openInput && openInputIndex === index ? (
                      <div className="d-flex gap-2">
                        {/*   Save  Btn */}
                        <button
                          disabled={item.status === "Completed"}
                          className="btn-sm  btn-success my-2 my-sm-0 mr-sm-2"
                          type="button"
                          onClick={() => inputUpdate(item)}
                        >
                          <i class="fa-solid fa-bookmark"></i>
                        </button>
                        {/* Cancel Btn */}
                        <button
                          disabled={item.status === "Completed"}
                          className="btn-sm  btn-danger my-2 my-sm-0"
                          type="button"
                          onClick={() => setopenInput(false)}
                        >
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Edit Btn */}
                        <button
                          disabled={item.status === "Completed"}
                          className="btn-sm  btn-success my-2 my-sm-0 mr-sm-2"
                          type="button"
                          onClick={() => {
                            setopenInput(true);
                            setopenInputIndex(index);
                          }}
                        >
                          <i className="fa-solid fa-file-pen"></i>
                        </button>
                        {/*  Delete Btn */}
                        <button
                          className="btn-sm  btn-danger my-2 my-sm-0"
                          type="button"
                          onClick={() => deleteData(item)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col">Data Not Found!</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          )}
        </tbody>
      </table>

      {/*========>Chart Area <===================*/}

      <div>
        ;
        {searchItem.length != 0 ? (
          <>
            <span className="bg-dark text-white fw-bold fs-1 p-2 m-2 rounded">
              Chart{` =>`}
            </span>
            {/* CHART INTGRATION */}
            <div className="donut p-3">
              <Chart
                options={{
                  labels: ["Panding", "Completed"],
                  colors: ["#dc3545", "#28a745"],
                }}
                series={[pending, completed]}
                type="donut"
                width="360"
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default TodoUi;
