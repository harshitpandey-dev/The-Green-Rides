import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import AuthContext from "../../store/auth-context";
import classes from "./login.module.css";
import { loginUser } from "../../services/auth.service";

const LoginScreen = () => {
  const history = useHistory();

  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  function onChange(value) {
    setIsVerified(true);
  }

  const toggleShowPassword = () => {
    if (showPassword) setShowPassword(false);
    if (!showPassword) setShowPassword(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isVerified) {
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;

      setIsLoading(true);

      await loginUser({
        email: enteredEmail,
        password: enteredPassword,
      })
        .then((res) => {
          setIsLoading(false);
          console.log(res);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication Failed";
              if (data && data.error && data.error.message) {
                setIsLoading(false);
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(new Date().getTime() + +36000000);
          authCtx.login(
            data,
            enteredPassword,
            data.token,
            data._id,
            data.role,
            data.cycleid,
            expirationTime.toISOString()
          );
          history.replace("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      alert("Verify if you are human");
    }
  };

  const signupHandler = () => {
    history.push("/signup");
  };

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="userName" id="userName" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <input type="checkbox" onClick={toggleShowPassword} /> Show Password
        {/* <div>
          <ReCAPTCHA
            sitekey="6LcU0VQjAAAAAHdKzj2Ub7RAbfQCf6QXbgOif9Le"
            onChange={onChange}
          />
        </div> */}
        <div className={classes.actions}>
          {!isLoading && <button>Login</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
      <div className={classes.actions}>
        <button onClick={signupHandler}> Sign Up</button>
      </div>
    </section>
  );
};

export default LoginScreen;
