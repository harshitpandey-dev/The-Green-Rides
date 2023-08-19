import React, { useState, useEffect, useCallback } from 'react';
import jwt_encode from 'jwt-encode';
import jwt_decode from 'jwt-decode';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userid: '',
  email: '',
  password: '',
  role: '',
  cycleid: '',
  data: {},
  name: '',
  login: (data, password, token, userid, role, cycle, expirationTime) => {},
  logout: () => {},
  addCycle: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredData = () => {
  let storedPassword = localStorage.getItem('password');
  if (
    storedPassword !== null &&
    storedPassword !== '' &&
    storedPassword !== undefined
  ) {
    try {
      storedPassword = jwt_decode(localStorage.getItem('password')).value;
    } catch (error) {}
  }
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const storedUserId = localStorage.getItem('userid');
  const storedRole = localStorage.getItem('role');
  const storedEmail = localStorage.getItem('email');
  const storedCycle = localStorage.getItem('cycleid');
  const storedData = localStorage.getItem('data');
  const storedName = localStorage.getItem('name');
  const storedBranch = localStorage.getItem('branch');
  const storedRollno = localStorage.getItem('rollno');
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 360) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    localStorage.removeItem('cycleid');
    localStorage.removeItem('data');
    localStorage.removeItem('name');
    localStorage.removeItem('password');
    localStorage.removeItem('email');
    localStorage.removeItem('branch');
    localStorage.removeItem('rollno');
    return null;
  }

  return {
    token: storedToken,
    userid: storedUserId,
    role: storedRole,
    cycleid: storedCycle,
    data: storedData,
    name: storedName,
    branch: storedBranch,
    password: storedPassword,
    email: storedEmail,
    rollno: storedRollno,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredData();

  let initialToken;
  let initialUserId;
  let initialRole;
  let initialCycle;
  let initialData;
  let initialName;
  let initialBranch;
  let initialRollno;
  let initialEmail;
  let initialPassword;
  if (tokenData) {
    initialData = tokenData.data;
    initialToken = tokenData.token;
    initialUserId = tokenData.userid;
    initialRole = tokenData.role;
    initialCycle = tokenData.cycleid;
    initialPassword = tokenData.password;
    initialEmail = tokenData.email;
    initialName = tokenData.name;
    initialBranch = tokenData.branch;
    initialRollno = tokenData.rollno;
  }

  const [data, setData] = useState(initialData);
  const [userid, setUserId] = useState(initialUserId);
  const [role, setRole] = useState(initialRole);
  const [token, setToken] = useState(initialToken);
  const [cycle, setCycle] = useState(initialCycle);
  const [password, setPass] = useState(initialPassword);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [branch, setBranch] = useState(initialBranch);
  const [rollno, setRollno] = useState(initialRollno);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUserId(null);
    setRole(null);
    setCycle(null);
    setData(null);
    setName(null);
    setBranch(null);
    setPass(null);
    setEmail(null);
    setRollno(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('cycleid');
    localStorage.removeItem('data');
    localStorage.removeItem('name');
    localStorage.removeItem('branch');
    localStorage.removeItem('rollno');
    localStorage.setItem('userIsLoggedIn', false);

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const addCycleHandler = (cycl) => {
    localStorage.setItem('cycleid', cycl);
    setCycle(cycl);
    console.log(cycl + ' incycle' + cycle);
  };

  const loginHandler = (
    data,
    password,
    token,
    userid,
    role,
    cycle,
    expirationTime
  ) => {
    const remainingTime = calculateRemainingTime(expirationTime);
    const enc = jwt_encode({ value: password }, 'screte sauce');
    setData(data);
    setToken(token);
    setRole(role);
    setUserId(userid);
    setEmail(data.email);
    setName(data.name);
    setPass(password);
    setBranch(data.branch);
    setRollno(data.rollno);
    setCycle(cycle);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userid', userid);
    localStorage.setItem('cycleid', cycle);
    localStorage.setItem('name', data.name);
    localStorage.setItem('branch', data.branch);
    localStorage.setItem('password', enc);
    localStorage.setItem('email', data.email);
    localStorage.setItem('rollno', data.rollno);
    localStorage.setItem('userIsLoggedIn', true);
    localStorage.setItem('expirationTime', expirationTime);
    localStorage.setItem('data', JSON.stringify(data));

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      // console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    data: data,
    token: token,
    isLoggedIn: userIsLoggedIn,
    userid: userid,
    role: role,
    cycleid: cycle,
    email: email,
    password: password,
    name: name,
    branch: branch,
    rollno: rollno,
    login: loginHandler,
    logout: logoutHandler,
    addCycle: addCycleHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
