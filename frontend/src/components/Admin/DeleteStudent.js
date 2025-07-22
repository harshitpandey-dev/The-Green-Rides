import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import useHttp from '../hooks/use-http';
import { deleteStudent } from '../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './AddStudentForm.module.css';

const DeleteStudent = () => {
  const authCtx = useContext(AuthContext);
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(deleteStudent, false);

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
      alert('Student Deleted');
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
