import { useRef } from "react";
import { useHistory } from "react-router-dom";
import classes from "./updatePassword.module.css";
import { changePassword } from "../../services/auth.service";

const UpdatePassword = ({ currentUser }) => {
  const history = useHistory();
  const newPasswordRef = useRef();
  const oldPasswordRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;

    changePassword({ email: currentUser?.email, oldPassword, newPassword });
    history.push("/");
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={currentUser?.email}
          disabled={true}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordRef} />
      </div>
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

export default UpdatePassword;
