import { Fragment, useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import { getCycles } from "../../services/cycle.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import classes from "./cycle.module.css";

const CycleListScreen = () => {
  const {
    sendRequest,
    status,
    data: cycles,
    error,
  } = useHttp(getCycles, false);

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

  const CycleItem = (props) => {
    return (
      <li className={classes.item}>
        <figure>
          <p>Cycle Id: {props.cycleId}</p>
          <p>Status: {props.status}</p>
        </figure>
      </li>
    );
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
    <Fragment>
      {cycles && cycles.length !== 0 ? (
        <ul className={classes.list}>
          {cycles.map((cycle) => (
            <CycleItem
              key={cycle.cycleId}
              cycleId={cycle.cycleId}
              status={cycle.status}
            />
          ))}
        </ul>
      ) : (
        <div className="centered">
          <h1>No Cycles Rented</h1>
        </div>
      )}
    </Fragment>
  );
};

export default CycleListScreen;
