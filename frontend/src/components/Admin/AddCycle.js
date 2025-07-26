import { useState } from "react";
import Scanner from "../QrScaner/Scanner";
import classes from "./forms.module.css";
import useHttp from "../../hooks/useHttp";
import { addCycle } from "../../services/cycle.service";
import LoadingSpinner from "../common/LoadingSpinner";

const AddCycle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [id, setId] = useState(null);

  const { sendRequest, status, error } = useHttp(addCycle, false);

  const addCycleHandler = (data) => {
    setId(data);
    setScanComplete(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({
      cycleId: id,
      addedBy: {
        name: localStorage.getItem("GR_USER").name,
        id: localStorage.getItem("GR_USER").id,
      },
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
        {scanComplete ? <h3>{id}</h3> : <Scanner scan={addCycleHandler} />}
        <div className={classes.actions}>
          {isLoading ? (
            <p>Sending Request....</p>
          ) : (
            scanComplete && <button>Add Cycle</button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AddCycle;
