import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import ReCAPTCHA from 'react-google-recaptcha';
import { useHistory } from 'react-router-dom';

import useHttp from '../hooks/use-http';
import { addStudent } from '../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './AddStudentForm.module.css';

const AddStudentForm = (props) => {
  console.log(props);
  const authCtx = useContext(AuthContext);
  const passwordRef = useRef();
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { sendRequest, status, error } = useHttp(addStudent, false);

  // console.log(JSON.stringify(props.user));

  const onChange = () => {
    setIsVerified(true);
  };

  const toggleShowPassword = () => {
    if (showPassword) setShowPassword(false);
    if (!showPassword) setShowPassword(true);
  };

  if (status === 'pending') {
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
    if (isVerified) {
      setIsLoading(true);
      sendRequest({
        student: {
          name: props.user.name,
          rollno: '100',
          branch: 'user',
          role: 'student',
          email: props.user.email,
          password: passwordRef.current.value,
        },
        token: authCtx.token,
      });
      setIsLoading(false);
      // console.log({
      //   name: nameRef.current.value,
      //   rollno: rollnoRef.current.value,
      //   branch: branchRef.current.value,
      //   email: emailRef.current.value,
      //   role: 'student',
      //   password: passwordRef.current.value,
      // });
      history.replace('/');
    } else {
      alert('Verify that you are a human');
    }
  };
  return (
    <section className={classes.auth}>
      <h1>Add Student</h1>
      <form onSubmit={submitionHandler}>
        <div className={classes.control}>
          <label htmlFor="Name">Student Name</label>
          <input
            type="Name"
            id="Name"
            required
            value={props.user.name}
            readOnly
          />
        </div>
        {/* <div className={classes.control}>
          <label htmlFor="rollno">Student Roll Number</label>
          <input
            type="rollno"
            id="rollno"
            required
            value={props.user.email.substring(0, 9)}
            readOnly
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="branch">Branch</label>
          <input
            type="branch"
            id="branch"
            required
            value={props.user.email.substring(5, 7)}
            readOnly
          />
        </div> */}
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="userName"
            id="userName"
            required
            value={props.user.email}
            readOnly
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            required
            ref={passwordRef}
          />
        </div>
        <input type="checkbox" onClick={toggleShowPassword} /> Show Password
        <div>
          {/* <Recaptcha
            sitekey="6LfOzVQjAAAAACIJVTM3w4iuAePfdEloNCQvRhj-"
            render="explicit"
            verifyCallback={verifyCallback}
            onloadCallback={load}
          /> */}
          <ReCAPTCHA
            sitekey="6LcU0VQjAAAAAHdKzj2Ub7RAbfQCf6QXbgOif9Le"
            onChange={onChange}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Create Account</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default AddStudentForm;
