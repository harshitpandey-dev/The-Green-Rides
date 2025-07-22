// import { useState } from 'react';
import Button from "../common/Button";

const Form = (props) => {
  return (
    <section>
      <form>
        <div className="centered">
          <Button click={props.printadds}>Add User</Button>
          <Button click={props.printdels}>Delete User</Button>
          <Button click={props.printaddg}>Add Guard</Button>
          <Button click={props.printdelg}>Delete Guard</Button>
        </div>
        <div className="centered">
          <Button click={props.printaddc}>Add Cycle</Button>
          <Button click={props.printdelc}>Delete Cycle</Button>
        </div>
      </form>
    </section>
  );
};

export default Form;
