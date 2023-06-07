import React from 'react'

function TodoNavbar(props) {
  return (
    <div>
        <nav className="navbar navbar-light bg-info justify-content-between">
          <a className=" text-light  navbar-brand text-capitalize mr-5">
            {" "}
            ToDo LiST
          </a>

          <form className="form-inline">
            <button
              className="btn btn-outline-light mr-sm-2"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
            >
               All-{props.allCount} 
            </button>
            <button
              className="btn btn-outline-light mr-sm-2"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
            >
               Pending-{props.pending}
              
            </button>
            <button
              className="btn btn-outline-light mr-sm-5"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
            >
               Completed-{props.complt}
            </button>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={props.search}
            />

            <button
              className="btn btn-outline-light  my-2 my-sm-0"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              Add-ToDo
            </button>
          </form>
        </nav>
      </div>
  )
}

export default TodoNavbar