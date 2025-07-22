// import { useState } from 'react';
import Button from '../UI/Button';

const Form = (props) => {
  //   const [addcy, setAddcy] = useState(false);
  //   const [delcy, setDelcy] = useState(false);
  //   const [addst, setAddst] = useState(false);
  //   const [delst, setDelst] = useState(false);
  //   const [addgu, setAddgu] = useState(false);
  //   const [delgu, setDelgu] = useState(false);

  //   const adds = () => {
  //     if (addst) setAddst(false);
  //     if (!addst) {
  //       setAddst(true);
  //       setDelst(false);
  //       setAddgu(false);
  //       setDelgu(false);
  //       setAddcy(false);
  //       setDelcy(false);
  //     }
  //   };
  //   const dels = () => {
  //     if (delst) setDelst(false);
  //     if (!delst) {
  //       setAddst(false);
  //       setDelst(true);
  //       setAddgu(false);
  //       setDelgu(false);
  //       setAddcy(false);
  //       setDelcy(false);
  //     }
  //   };
  //   const addg = () => {
  //     if (addgu) setAddgu(false);
  //     if (!addgu) {
  //       setAddst(false);
  //       setDelst(false);
  //       setAddgu(true);
  //       setDelgu(false);
  //       setAddcy(false);
  //       setDelcy(false);
  //     }
  //   };
  //   const delg = () => {
  //     if (delgu) setDelgu(false);
  //     if (!delgu) {
  //       setAddst(false);
  //       setDelst(false);
  //       setAddgu(false);
  //       setDelgu(true);
  //       setAddcy(false);
  //       setDelcy(false);
  //     }
  //   };
  //   const addc = () => {
  //     if (addcy) setAddcy(false);
  //     if (!addcy) {
  //       setAddst(false);
  //       setDelst(false);
  //       setAddgu(false);
  //       setDelgu(false);
  //       setAddcy(true);
  //       setDelcy(false);
  //     }
  //   };
  //   const delc = () => {
  //     if (delcy) setDelcy(false);
  //     if (!delcy) {
  //       setAddst(false);
  //       setDelst(false);
  //       setAddgu(false);
  //       setDelgu(false);
  //       setAddcy(false);
  //       setDelcy(true);
  //     }
  //   };

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
