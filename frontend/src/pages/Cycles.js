import { Fragment, useContext, useState } from 'react';
import CycleList from '../components/cycle/CycleList';
import useHttp from '../components/hooks/use-http';
import { getCycles } from '../components/lib/api';
import AuthContext from '../store/auth-context';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Cycles = () => {
  const authCtx = useContext(AuthContext);
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

  if (status === 'pending') {
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
