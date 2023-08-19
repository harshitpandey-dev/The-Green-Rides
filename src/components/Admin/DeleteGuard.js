import { useContext, useRef, useState } from 'react';
import classes from './AddStudentForm.module.css';
import useHttp from '../hooks/use-http';
import { deleteStudent } from '../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import AuthContext from '../../store/auth-context';

const DeleteGuard = () => {
  const authCtx = useContext(AuthContext);
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const {
    sendRequest,
    status,
    // data: student,
    error,
  } = useHttp(deleteStudent, false);

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
      alert('Guard Deleted');
    }

    // console.log({
    //   email: emailRef.current.value,
    // });
    setIsLoading(false);
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
