import { useRef, useState } from "react";
import classes from "./forms.module.css";
import useHttp from "../../hooks/useHttp";
import LoadingSpinner from "../common/LoadingSpinner";
import { AuthContext } from "../../contexts/authContext";
import { createUser } from "../../services/user.service";

const AddGuard = () => {
  const nameRef = useRef();
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
      student: {
        name: nameRef.current.value,
        email: emailRef.current.value,
        role: "guard",
        password: passwordRef.current.value,
      },
      token: AuthContext.token,
    });

    if (!error) {
      alert("Guard Added");
    }
    setIsLoading(false);
  };

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
      <h1>Add Guard</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="Name">Guard Name</label>
          <input type="Name" id="Name" required ref={nameRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="email">Guard Email</label>
          <input type="userName" id="userName" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Guard Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            ref={passwordRef}
          />
        </div>
        <input type="checkbox" onClick={toggleShowPassword} /> Show Password
        <div className={classes.actions}>
          {!isLoading && <button>Add Guard</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default AddGuard;
