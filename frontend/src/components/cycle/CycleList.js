import { Fragment } from 'react';

import CycleItem from './CycleItem';
import classes from './CycleList.module.css';

const CycleList = (props) => {
  // console.log(props);
  if (props.cycles.length === 0) {
    return (
      <Fragment>
        <div className="centered">
          <h1>No Cycles Rented</h1>
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <ul className={classes.list}>
        {props.cycles.map((cycle) => (
          <CycleItem
            key={cycle.cycleid}
            stdid={cycle.stdid}
            id={cycle.cycleid}
            status={cycle.status}
            stdname={cycle.stdname}
          />
        ))}
      </ul>
    </Fragment>
  );
};

export default CycleList;
