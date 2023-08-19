import { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import ProfileForm from './ProfileForm';
import UserData from './UserData';
import classes from './UserProfile.module.css';

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
    rollno: authCtx.rollno,
    cycleid: authCtx.cycleid ? authCtx.cycleid : '',
    role: authCtx.role,
  };
  return (
    <section className={classes.profile}>
      {authCtx.role == 'student' && <h1>User Profile</h1>}
      {authCtx.role == 'guard' && <h1>Guard Profile</h1>}
      {authCtx.role == 'admin' && <h1>Admin Profile</h1>}
      <UserData user={user} />
      {showChange && (
        <ProfileForm
          token={localStorage.getItem('token')}
          userid={authCtx.userid}
        />
      )}
      <div className={classes.action}>
        <button onClick={showChangeHandler}>
          {showChange ? 'Cancel' : 'Change Password'}
        </button>
      </div>
    </section>
  );
};

export default UserProfile;
