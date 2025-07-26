import { useState } from "react";
import { useUser } from "../../contexts/authContext";
import UpdatePassword from "../../components/Profile/UpdatePassword";
import classes from "./UserProfile.module.css";

const UserProfile = () => {
  const { currentUser } = useUser();
  const [showChange, setShowChange] = useState(false);

  const showChangeHandler = () => {
    setShowChange(!showChange);
  };

  return (
    <section className={classes.profile}>
      <h1>
        {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}{" "}
        Profile
      </h1>
      <h3>Name : {currentUser?.name}</h3>
      <h3>Email : {currentUser?.email}</h3>
      {currentUser?.role === "student" && (
        <h3>Roll No : {currentUser?.rollNo}</h3>
      )}

      {showChange && <UpdatePassword currentUser={currentUser} />}

      <div className={classes.action}>
        <button onClick={showChangeHandler}>
          {showChange ? "Cancel" : "Change Password"}
        </button>
      </div>
    </section>
  );
};

export default UserProfile;
