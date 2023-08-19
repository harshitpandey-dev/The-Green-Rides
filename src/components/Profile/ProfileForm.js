import { useRef } from 'react';
import { useHistory } from 'react-router-dom';

import classes from './ProfileForm.module.css';

const ProfileForm = (props) => {
  const history = useHistory();
  const newPasswordRef = useRef();

  const submitionHandler = (event) => {
    event.preventDefault();

    const newEnteredPassword = newPasswordRef.current.value;
    const url = 'https://pacific-fortress-54764.herokuapp.com';

    fetch(`${url}/users/password/${props.userid}`, {
      method: 'PATCH',
      body: JSON.stringify({
        password: newEnteredPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token,
      },
    }).then((res) => {
      history.replace('/');
    });
  };

  return (
    <form className={classes.form} onSubmit={submitionHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
