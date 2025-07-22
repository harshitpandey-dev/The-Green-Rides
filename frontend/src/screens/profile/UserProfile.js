import { useContext, useState } from "react";
import AuthContext from "../../contexts/authContext";
import ProfileForm from "../../components/Profile/ProfileForm";
import classes from "./UserProfile.module.css";

const UserProfile = () => {
  const authCtx = useContext(AuthContext);
  const [showChange, setShowChange] = useState(false);

  const showChangeHandler = () => {
    if (showChange) setShowChange(false);
    if (!showChange) setShowChange(true);
  };

  const user = {
    name: authCtx.name,
    branch: authCtx.branch,
    rollNo: authCtx.rollNo,
    cycleId: authCtx.cycleId ? authCtx.cycleId : "",
    role: authCtx.role,
  };
  return (
    <section className={classes.profile}>
      <h1>{authCtx.role?.charAt(0).toUpperCase()} Profile</h1>
      <h3 className="centered">Name : {user.name}</h3>

      {showChange && (
        <ProfileForm
          token={localStorage.getItem("token")}
          userid={authCtx.userid}
        />
      )}

      <div className={classes.action}>
        <button onClick={showChangeHandler}>
          {showChange ? "Cancel" : "Change Password"}
        </button>
      </div>
    </section>
  );
};

export default UserProfile;
