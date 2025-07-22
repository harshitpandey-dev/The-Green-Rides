import classes from './Button.module.css';
const Button = (props) => {
  return (
    <div className="centered">
      <div className={classes.action}>
        <button onClick={props.click} type="button">
          {props.children}
        </button>
      </div>
    </div>
  );
};
export default Button;
