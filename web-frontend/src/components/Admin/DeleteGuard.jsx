import { useRef, useState } from "react";
import classes from "./forms.module.css";
import useHttp from "../../hooks/useHttp";
import { deleteUser } from "../../services/auth.service";
import LoadingSpinner from "../common/LoadingSpinner";

const DeleteGuard = () => {
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(deleteUser, false);

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      email: emailRef.current.value,
    });

    if (!error) {
      alert("Guard Deleted");
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
      <h1>Delete Guard</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Guard Email</label>
          <input type="userName" id="userName" required ref={emailRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Delete Guard</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default DeleteGuard;
