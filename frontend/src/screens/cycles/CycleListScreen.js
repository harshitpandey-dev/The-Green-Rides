import { Fragment, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { getCycles } from "../../services/cycle.service";
import { useUser } from "../../contexts/authContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import classes from "./cycle.module.css";

const Cycles = () => {
  const authCtx = useUser();
  const [getit, setgit] = useState(true);

  const {
    sendRequest,
    status,
    data: cycles,
    error,
  } = useHttp(getCycles, false);

  if (getit) {
    setgit(false);
    sendRequest({ token: authCtx.token });
  }

  const CycleItem = (props) => {
    return (
      <li className={classes.item}>
        <figure>
          <blockcycle>
            <p>Cycle Id: {props.cycleId}</p>
            <p>Name: {props.stdname}</p>
          </blockcycle>
          <figcaption>{props.status}</figcaption>
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
      {cycles.length !== 0 ? (
        <ul className={classes.list}>
          {cycles.map((cycle) => (
            <CycleItem
              key={cycle.cycleId}
              stdid={cycle.stdid}
              id={cycle.cycleId}
              status={cycle.status}
              stdname={cycle.stdname}
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

export default Cycles;
