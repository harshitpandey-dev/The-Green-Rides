import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Scanner from '../components/QrScaner/Scanner';
import { rentCycle } from '../components/lib/api';
import useHttp from '../components/hooks/use-http';
import Button from '../components/UI/Button';
import AuthContext from '../store/auth-context';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import classes from './Rent.module.css';

const Rent = (props) => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [done, setDone] = useState(false);
  const [rent, setRent] = useState(true);
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);

  //   console.log(authCtx);

  let { sendRequest, status, error } = useHttp(rentCycle, false);
  const rentHandler = () => {
    sendRequest({
      token: authCtx.token,
      cycleid: data,
      userid: authCtx.userid,
      role: authCtx.role,
      name: authCtx.name,
    });
    setDone(false);
    setData(null);
    localStorage.removeItem('scaned');
    localStorage.removeItem('scandata');
    if (!two && error) authCtx.addCycle(data);
  };
  useEffect(() => {
    setData(localStorage.getItem('scandata'));
    setDone(localStorage.getItem('scaned'));
    if (localStorage.getItem('scandata') === 'undefined') {
      setData(null);
      setDone(false);
      localStorage.removeItem('scaned');
      localStorage.removeItem('scandata');
    }
  }, []);
  useEffect(() => {
    if (authCtx.role === 'admin') {
      setOne(true);
    }
    if (authCtx.role === 'guard') {
      setTwo(true);
    }
    if (authCtx.cycleid !== undefined && authCtx.cycleid !== '') {
      setRent(false);
    }
  }, [
    authCtx,
    authCtx.role,
    rent,
    setRent,
    setOne,
    one,
    two,
    setTwo,
    authCtx.cycleid,
  ]);
  //   console.log({ user: localStorage.getItem('data') });
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
  if (status === 'completed') {
    return (
      <div className="centered">
        <div>
          <h1 className="centered">
            {two ? 'Cycle Returned' : 'Cycle Rented'}
          </h1>
        </div>
        <div>
          {two && (
            <Button
              click={() => {
                setDone(false);
                setData(null);
                localStorage.removeItem('scaned');
                localStorage.removeItem('scandata');
                history.go(0);
              }}
            >
              Return Another Cycle
            </Button>
          )}
        </div>
      </div>
    );
  }

  const ScanComplete = (props) => {
    setData(props);
    localStorage.setItem('scandata', props);
    setDone(true);
    localStorage.setItem('scaned', true);
  };
  return (
    <div className={classes.body}>
      {!one && !two && (
        <div className={classes.comp}>
          {!rent && (
            <h1 className="centered">You have already rented one Cycle</h1>
          )}
          {rent && (
            <>
              {!done && <Scanner scan={ScanComplete} />}
              {data && <p className={classes.p}>{data}</p>}
              {done && <Button click={rentHandler}>Rent</Button>}
              {done && (
                <Button
                  click={() => {
                    setDone(false);
                    setData(null);
                    localStorage.removeItem('scaned');
                    localStorage.removeItem('scandata');
                  }}
                >
                  Scan Again
                </Button>
              )}
            </>
          )}
        </div>
      )}
      {two && (
        <div className={classes.comp}>
          {!done && <Scanner scan={ScanComplete} />}
          {data && <p className={classes.p}>{data}</p>}
          {done && <Button click={rentHandler}>Return</Button>}
          {done && (
            <Button
              click={() => {
                setDone(false);
                setData(null);
                localStorage.removeItem('scaned');
                localStorage.removeItem('scandata');
              }}
            >
              Scan Again
            </Button>
          )}
        </div>
      )}
      {one && !two && (
        <div className={classes.comp}>
          {!done && <Scanner scan={ScanComplete} />}
          {data && <p className={classes.p}>{data}</p>}
          {done && <Button click={rentHandler}>Admin</Button>}
        </div>
      )}
    </div>
  );
};

export default Rent;
