import { useState } from "react";

import AddCycle from "../../components/Admin/AddCycle";
import AddGuard from "../../components/Admin/AddGuard";
import AddStudentForm from "../../components/Admin/AddStudentForm";
import DeleteCycle from "../../components/Admin/DeleteCycle";
import DeleteGuard from "../../components/Admin/DeleteGuard";
import DeleteStudent from "../../components/Admin/DeleteStudent";
import Button from "../../components/common/Button";

import classes from "./admin.module.css";

const AdminScreen = () => {
  const [addst, setAddst] = useState(false);
  const [delst, setDelst] = useState(false);
  const [addgu, setAddgu] = useState(false);
  const [delgu, setDelgu] = useState(false);
  const [addcy, setAddcy] = useState(false);
  const [delcy, setDelcy] = useState(false);
  // const [showForm, setShowForm] = useState(true);

  const adds = () => {
    if (addst) setAddst(false);
    if (!addst) {
      setAddst(true);
      setDelst(false);
      setAddgu(false);
      setDelgu(false);
      setAddcy(false);
      setDelcy(false);
    }
  };

  const dels = () => {
    if (delst) setDelst(false);
    if (!delst) {
      setAddst(false);
      setDelst(true);
      setAddgu(false);
      setDelgu(false);
      setAddcy(false);
      setDelcy(false);
    }
  };
  const addg = () => {
    if (addgu) setAddgu(false);
    if (!addgu) {
      setAddst(false);
      setDelst(false);
      setAddgu(true);
      setDelgu(false);
      setAddcy(false);
      setDelcy(false);
    }
  };
  const delg = () => {
    if (delgu) setDelgu(false);
    if (!delgu) {
      setAddst(false);
      setDelst(false);
      setAddgu(false);
      setDelgu(true);
      setAddcy(false);
      setDelcy(false);
    }
  };
  const addc = () => {
    if (addcy) setAddcy(false);
    if (!addcy) {
      setAddst(false);
      setDelst(false);
      setAddgu(false);
      setDelgu(false);
      setAddcy(true);
      setDelcy(false);
    }
  };
  const delc = () => {
    if (delcy) setDelcy(false);
    if (!delcy) {
      setAddst(false);
      setDelst(false);
      setAddgu(false);
      setDelgu(false);
      setAddcy(false);
      setDelcy(true);
    }
  };

  return (
    <div className={classes.container}>
      <div>
        {addst && <AddStudentForm />}
        {delst && <DeleteStudent />}
        {addgu && <AddGuard />}
        {delgu && <DeleteGuard />}
        {addcy && <AddCycle />}
        {delcy && <DeleteCycle />}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <Button click={adds}>Add User</Button>
          <Button click={dels}>Delete User</Button>
          <Button click={addg}>Add Guard</Button>
          <Button click={delg}>Delete Guard</Button>
          <Button click={addc}>Add Cycle</Button>
          <Button click={delc}>Delete Cycle</Button>
        </div>
      </div>
    </div>
  );
};
export default AdminScreen;
