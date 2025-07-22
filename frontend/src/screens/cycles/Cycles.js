import { Fragment, useState } from "react";
import CycleList from "../../components/cycle/CycleList";
import useHttp from "../../hooks/useHttp";
import { getCycles } from "../../services/cycle.service";
import { useUser } from "../../contexts/authContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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
      <CycleList cycles={cycles} />
    </Fragment>
  );
};

export default Cycles;
