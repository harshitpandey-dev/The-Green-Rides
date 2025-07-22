import { useEffect, useState } from 'react';

const UserData = (props) => {
  const [guard, setGuard] = useState(false);
  useEffect(() => {
    if (props.user.role === 'guard' || props.user.role === 'admin')
      setGuard(true);
  }, [props.user.role]);

  const cycle = props.user.cycleid ? props.user.cycleid : 'No Cycle Rented Yet';
  return (
    <div>
      <h3 className="centered">Name : {props.user.name}</h3>
      {!guard && (
        <>
          {/* <h4 className="centered">Roll No.: {props.user.rollno}</h4> */}
          {/* <h4 className="centered">Branch : {props.user.branch}</h4> */}
          <h4 className="centered">Cycle Id : {cycle}</h4>
        </>
      )}
    </div>
  );
};
export default UserData;
