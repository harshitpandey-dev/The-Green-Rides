import { useRef, useState } from "react";
import { useUser } from "../../contexts/authContext";
import useHttp from "../../hooks/useHttp";
import { deleteUser } from "../../services/auth.service";
import LoadingSpinner from "../common/LoadingSpinner";

import classes from "./AddStudentForm.module.css";

const DeleteStudent = () => {
  const authCtx = useUser();
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(deleteUser, false);

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      student: {
        email: emailRef.current.value,
      },
      token: authCtx.token,
    });

    if (!error) {
      alert("Student Deleted");
    }

    // console.log({
    //   email: emailRef.current.value,
    // });
    setIsLoading(false);
  };
  if (isLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return <p className="centered">{error}</p>;
  }
  return (
    <section className={classes.auth}>
      {/* <h1>{isLogin ? "Login" : "Sign Up"}</h1> */}
      <h1>Delete User</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="email">User Email</label>
          <input type="userName" id="userName" required ref={emailRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Delete Student</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default DeleteStudent;
