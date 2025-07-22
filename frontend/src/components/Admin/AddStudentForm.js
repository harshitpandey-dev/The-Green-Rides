import { useRef, useState } from "react";
import { useUser } from "../../contexts/authContext";

import useHttp from "../../hooks/useHttp";
import { registerUser } from "../../services/auth.service";
import LoadingSpinner from "../common/LoadingSpinner";

import classes from "./AddStudentForm.module.css";

const AddStudentForm = () => {
  const authCtx = useUser();
  const nameRef = useRef();
  // const rollNoRef = useRef();
  // const branchRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(registerUser, false);

  const toggleShowPassword = () => {
    if (showPassword) setShowPassword(false);
    if (!showPassword) setShowPassword(true);
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

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      student: {
        name: nameRef.current.value,
        // rollNo: rollNoRef.current.value,
        rollNo: "",
        branch: "",
        // branch: branchRef.current.value,
        role: "student",
        email: emailRef.current.value,
        password: passwordRef.current.value,
      },
      token: authCtx.token,
    });
    if (!error) {
      alert("Student Added");
    }
    // console.log({
    //   name: nameRef.current.value,
    //   rollNo: rollNoRef.current.value,
    //   branch: branchRef.current.value,
    //   email: emailRef.current.value,
    //   role: 'student',
    //   password: passwordRef.current.value,
    // });
    setIsLoading(false);
  };
  return (
    <section className={classes.auth}>
      {/* <h1>{isLogin ? "Login" : "Sign Up"}</h1> */}
      <h1>Add User</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="Name">Name</label>
          <input type="Name" id="Name" required ref={nameRef} />
        </div>
        {/* <div className={classes.control}>
          <label htmlFor="rollNo">Student Roll Number</label>
          <input type="rollNo" id="rollNo" required ref={rollNoRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="branch">Student Branch</label>
          <input type="branch" id="branch" required ref={branchRef} />
        </div> */}
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="userName" id="userName" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            ref={passwordRef}
          />
        </div>
        <input type="checkbox" onClick={toggleShowPassword} /> Show Password
        <div className={classes.actions}>
          {!isLoading && (
            // <button>{isLogin ? 'Login' : 'Create Account'}</button>
            <button>Add Student</button>
          )}
          {isLoading && <p>Sending Request....</p>}
          {/* <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button> */}
        </div>
      </form>
    </section>
  );
};

export default AddStudentForm;
