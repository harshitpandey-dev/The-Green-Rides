import { useContext, useState } from 'react';

import Scanner from '../QrScaner/Scanner';
import useHttp from '../hooks/use-http';
import { deleteCycle } from '../lib/api';
import classes from './AddStudentForm.module.css';
import AuthContext from '../../store/auth-context';
import LoadingSpinner from '../UI/LoadingSpinner';

const DeleteCycle = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [id, setId] = useState(null);

  const { sendRequest, status, error } = useHttp(deleteCycle, false);

  const addCycleHandler = (data) => {
    setId(data);
    setScanComplete(true);
  };

  const submitionHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    sendRequest({ cycleid: id, token: authCtx.token });
    if (!error) {
      alert('Cycle Deleted');
    }
    // console.log(id);
    setIsLoading(false);
  };

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
    <section className={classes.auth}>
      <h1>Delete Cycle</h1>
      <form onSubmit={submitionHandler}>
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
