import { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Scanner from "../../components/QrScaner/Scanner";
import {
  getRentedCycleByUserId,
  rentCycle,
  returnCycle,
} from "../../services/rent.service";
import useHttp from "../../hooks/useHttp";
import Button from "../../components/common/Button";
import { useUser } from "../../contexts/authContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import classes from "./Rent.module.css";

const Rent = () => {
  const history = useHistory();
  const { currentUser } = useUser();
  const [cycleId, setCycleId] = useState("");
  const [done, setDone] = useState(false);
  const [rent, setRent] = useState(null);

  const { sendRequest, status, error } = useHttp(rentCycle, false);

  const rentHandler = useCallback(() => {
    sendRequest({ cycleId });
    setCycleId(null);
  }, [cycleId, sendRequest]);

  const returnHandler = useCallback(async () => {
    const res = await returnCycle({ cycleId });

    if (res) {
      alert("Cycle returned successfully");
      setCycleId(null);
    } else {
      alert("error while returning cycle");
    }
  }, [cycleId]);

  useEffect(() => {
    const fetchRentedCycle = async () => {
      try {
        const rentedCycle = await getRentedCycleByUserId();
        if (rentedCycle) {
          setRent(rentedCycle);
        }
      } catch (err) {
        console.error("Failed to fetch rented cycle", err);
      }
    };
    fetchRentedCycle();
  }, []);

  const scanCompleteHandler = (scannedCycleId) => {
    setCycleId(scannedCycleId);
    setDone(true);
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

  if (status === "completed") {
    return (
      <div className="centered">
        <div>
          <h1 className="centered">
            {currentUser?.role === "guard" ? "Cycle Returned" : "Cycle Rented"}
          </h1>
        </div>
        <div>
          {currentUser?.role === "guard" && (
            <Button
              click={() => {
                setDone(false);
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

  return (
    <div className={classes.body}>
      {currentUser?.role === "student" && (
        <div className={classes.comp}>
          {rent ? (
            <h1 className="centered">You have already rented one Cycle</h1>
          ) : (
            <>
              {!done && <Scanner scan={scanCompleteHandler} />}
              {cycleId && <p className={classes.p}>{cycleId}</p>}
              {done && <Button click={rentHandler}>Rent</Button>}
              {done && (
                <Button
                  click={() => {
                    setDone(false);
                    setCycleId(null);
                  }}
                >
                  Scan Again
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {currentUser?.role === "guard" && (
        <div className={classes.comp}>
          {!done && <Scanner scan={scanCompleteHandler} />}
          {cycleId && <p className={classes.p}>{cycleId}</p>}
          {done && <Button click={returnHandler}>Return</Button>}
          {done && (
            <Button
              click={() => {
                setDone(false);
                setCycleId(null);
              }}
            >
              Scan Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Rent;
