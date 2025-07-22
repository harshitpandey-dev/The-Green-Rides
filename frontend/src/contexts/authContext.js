import React, { useState, useEffect, useCallback } from "react";
import jwt_encode from "jwt-encode";
import jwt_decode from "jwt-decode";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  userid: "",
  email: "",
  password: "",
  role: "",
  cycleId: "",
  data: {},
  name: "",
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
  let storedPassword = localStorage.getItem("password");
  if (
    storedPassword !== null &&
    storedPassword !== "" &&
    storedPassword !== undefined
  ) {
    try {
      storedPassword = jwt_decode(localStorage.getItem("password")).value;
    } catch (error) {}
  }

  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedUserId = localStorage.getItem("userid");
  const storedRole = localStorage.getItem("role");
  const storedEmail = localStorage.getItem("email");
  const storedCycle = localStorage.getItem("cycleId");
  const storedData = localStorage.getItem("data");
  const storedName = localStorage.getItem("name");
  const storedBranch = localStorage.getItem("branch");
  const storedRollNo = localStorage.getItem("rollNo");
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 360) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    localStorage.removeItem("cycleId");
    localStorage.removeItem("data");
    localStorage.removeItem("name");
    localStorage.removeItem("password");
    localStorage.removeItem("email");
    localStorage.removeItem("branch");
    localStorage.removeItem("rollNo");
    return null;
  }

  return {
    token: storedToken,
    userid: storedUserId,
    role: storedRole,
    cycleId: storedCycle,
    data: storedData,
    name: storedName,
    branch: storedBranch,
    password: storedPassword,
    email: storedEmail,
    rollNo: storedRollNo,
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
  let initialRollNo;
  let initialEmail;
  let initialPassword;

  if (tokenData) {
    initialData = tokenData.data;
    initialToken = tokenData.token;
    initialUserId = tokenData.userid;
    initialRole = tokenData.role;
    initialCycle = tokenData.cycleId;
    initialPassword = tokenData.password;
    initialEmail = tokenData.email;
    initialName = tokenData.name;
    initialBranch = tokenData.branch;
    initialRollNo = tokenData.rollNo;
  }

  const [data, setData] = useState(initialData);
  const [userId, setUserId] = useState(initialUserId);
  const [role, setRole] = useState(initialRole);
  const [token, setToken] = useState(initialToken);
  const [cycle, setCycle] = useState(initialCycle);
  const [password, setPass] = useState(initialPassword);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [branch, setBranch] = useState(initialBranch);
  const [rollNo, setRollNo] = useState(initialRollNo);

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
    setRollNo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("cycleId");
    localStorage.removeItem("data");
    localStorage.removeItem("name");
    localStorage.removeItem("branch");
    localStorage.removeItem("rollNo");
    localStorage.setItem("userIsLoggedIn", false);

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const addCycleHandler = (inputCycle) => {
    localStorage.setItem("cycleId", inputCycle);
    setCycle(inputCycle);
    console.log(inputCycle + "inputCycle" + cycle);
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
    const enc = jwt_encode(
      { value: password },
      process.env.REACT_APP_JWT_SECRET
    );
    setData(data);
    setToken(token);
    setRole(role);
    setUserId(userid);
    setEmail(data.email);
    setName(data.name);
    setPass(password);
    setBranch(data.branch);
    setRollNo(data.rollNo);
    setCycle(cycle);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userid", userid);
    localStorage.setItem("cycleId", cycle);
    localStorage.setItem("name", data.name);
    localStorage.setItem("branch", data.branch);
    localStorage.setItem("password", enc);
    localStorage.setItem("email", data.email);
    localStorage.setItem("rollNo", data.rollNo);
    localStorage.setItem("userIsLoggedIn", true);
    localStorage.setItem("expirationTime", expirationTime);
    localStorage.setItem("data", JSON.stringify(data));

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    data: data,
    token: token,
    isLoggedIn: userIsLoggedIn,
    userId: userId,
    role: role,
    cycleId: cycle,
    email: email,
    password: password,
    name: name,
    branch: branch,
    rollNo: rollNo,
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
