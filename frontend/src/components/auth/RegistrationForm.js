import { useContext, useRef, useState } from "react";
import AuthContext from "../../contexts/authContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useHistory } from "react-router-dom";

import useHttp from "../hooks/use-http";
import { registerUser } from "../../services/auth.service";
import LoadingSpinner from "../common/LoadingSpinner";
import classes from "./registrationForm.module.css";

const AddStudentForm = (props) => {
  const authCtx = useContext(AuthContext);
  const passwordRef = useRef();
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { sendRequest, status, error } = useHttp(registerUser, false);

  const onChange = () => {
    setIsVerified(true);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isVerified) {
      setIsLoading(true);
      sendRequest({
        user: {
          name: props?.user?.name,
          role: "student",
          email: props?.user?.email,
          password: passwordRef?.current?.value,
        },
        token: authCtx?.token,
      });
      setIsLoading(false);
      history.replace("/");
    } else {
      alert("Verify that you are a human");
    }
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
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="Name">Name</label>
          <input
            type="Name"
            id="Name"
            required
            value={props?.user?.name}
            readOnly
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="userName"
            id="userName"
            required
            value={props?.user?.email}
            readOnly
          />
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
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY || ""}
          onChange={onChange}
        />
        <div className={classes.actions}>
          {!isLoading && <button>Create Account</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default AddStudentForm;
