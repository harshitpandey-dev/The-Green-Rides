import { useRef, useState } from 'react';
import classes from './AddStudentForm.module.css';
import useHttp from '../hooks/use-http';
import { addStudent } from '../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import AuthContext from '../../store/auth-context';

const AddGuard = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest, status, error } = useHttp(addStudent, false);

  const toggleShowPassword = () => {
    if (showPassword) setShowPassword(false);
    if (!showPassword) setShowPassword(true);
  };

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);

    sendRequest({
      student: {
        name: nameRef.current.value,
        email: emailRef.current.value,
        role: 'guard',
        password: passwordRef.current.value,
      },
      token: AuthContext.token,
    });

    if (!error) {
      alert('Guard Added');
    }
    setIsLoading(false);

    // console.log({
    //   name: nameRef.current.value,
    //   email: emailRef.current.value,
    //   role: 'guard',
    //   password: passwordRef.current.value,
    // });
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
            type={showPassword ? 'text' : 'password'}
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
