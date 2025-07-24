import { useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import LoadingSpinner from "../common/LoadingSpinner";
import classes from "./forms.module.css";
import { createUser } from "../../services/user.service";

const AddStudentForm = () => {
  const nameRef = useRef();
  const rollNoRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(createUser, false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      name: nameRef.current.value,
      rollNo: rollNoRef.current.value,
      role: "student",
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    if (!error) {
      alert("Student Added");
    }
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
      <h1>Add User</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="Name">Name</label>
          <input type="Name" id="Name" required ref={nameRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="rollNo">Student Roll Number</label>
          <input type="rollNo" id="rollNo" required ref={rollNoRef} />
        </div>
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
          {!isLoading && <button>Add Student</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default AddStudentForm;
