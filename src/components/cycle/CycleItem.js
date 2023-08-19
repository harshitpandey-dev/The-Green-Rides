import classes from './CycleItem.module.css';

const CycleItem = (props) => {
  let status;
  status = 'Not Rented';
  if (props.status === 'rented') status = 'Rented';
  return (
    <li className={classes.item}>
      <figure>
        <blockcycle>
          <p>Cycle Id: {props.id}</p>
          <p>Name: {props.stdname}</p>
        </blockcycle>
        {/* <figcaption>{status}</figcaption> */}
      </figure>
    </li>
  );
};

export default CycleItem;
