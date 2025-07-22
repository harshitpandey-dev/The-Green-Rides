import { useState } from "react";

import Scanner from "../QrScaner/Scanner";
import classes from "./AddStudentForm.module.css";
import useHttp from "../../hooks/useHttp";
import { addCycle } from "../../services/cycle.service";
import LoadingSpinner from "../common/LoadingSpinner";
import { useUser } from "../../contexts/authContext";

const AddCycle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [id, setId] = useState(null);

  const authCtx = useUser();

  const { sendRequest, status, error } = useHttp(addCycle, false);

  const addCycleHandler = (data) => {
    setId(data);
    setScanComplete(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      cycle: { cycleId: id, status: "", stdid: "" },
      token: authCtx.token,
    });
    if (!error) {
      alert("Cycle Added");
    }

    setIsLoading(false);
  };

  if (status === "pending") {
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
      <h1>Add Cycle</h1>
      <form onSubmit={handleSubmit}>
        {!scanComplete && <Scanner scan={addCycleHandler} />}
        {scanComplete && <h3>{id}</h3>}
        <div className={classes.actions}>
          {!isLoading && scanComplete && <button>Add Cycle</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default AddCycle;
