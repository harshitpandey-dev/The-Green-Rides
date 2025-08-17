import { useState } from "react";

import Scanner from "../QrScaner/Scanner";
import useHttp from "../../hooks/useHttp";
import { deleteCycle } from "../../services/cycle.service";
import classes from "./forms.module.css";
import LoadingSpinner from "../common/LoadingSpinner";

const DeleteCycle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [id, setId] = useState(null);

  const { sendRequest, status, error } = useHttp(deleteCycle, false);

  const addCycleHandler = (data) => {
    setId(data);
    setScanComplete(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({ cycleId: id });

    if (!error) {
      alert("Cycle Deleted");
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
      <h1>Delete Cycle</h1>
      <form onSubmit={handleSubmit}>
        {!scanComplete && <Scanner scan={addCycleHandler} />}
        {scanComplete && <h3>{id}</h3>}
        <div className={classes.actions}>
          {!isLoading && scanComplete && <button>Delete Cycle</button>}
          {isLoading && <p>Sending Request....</p>}
        </div>
      </form>
    </section>
  );
};

export default DeleteCycle;
