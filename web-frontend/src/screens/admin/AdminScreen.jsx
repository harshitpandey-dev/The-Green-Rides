import { useState } from "react";

import AddCycle from "../../components/Admin/AddCycle";
import AddGuard from "../../components/Admin/AddGuard";
import AddStudentForm from "../../components/Admin/AddStudent";
import DeleteCycle from "../../components/Admin/DeleteCycle";
import DeleteGuard from "../../components/Admin/DeleteGuard";
import DeleteStudent from "../../components/Admin/DeleteStudent";
import Button from "../../components/common/Button";

import classes from "./admin.module.css";

const formComponents = {
  addStudent: <AddStudentForm />,
  deleteStudent: <DeleteStudent />,
  addGuard: <AddGuard />,
  deleteGuard: <DeleteGuard />,
  addCycle: <AddCycle />,
  deleteCycle: <DeleteCycle />,
};

const AdminScreen = () => {
  const [activeForm, setActiveForm] = useState("");

  const toggleForm = (formName) => {
    setActiveForm((prev) => (prev === formName ? "" : formName));
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Admin Dashboard</h1>
        <p className={classes.subtitle}>Manage your Green Rides system</p>

        {formComponents[activeForm]}

        <div className={classes.buttonGrid}>
          <Button click={() => toggleForm("addStudent")}>Add Student</Button>
          <Button click={() => toggleForm("deleteStudent")}>
            Delete Student
          </Button>
          <Button click={() => toggleForm("addGuard")}>Add Guard</Button>
          <Button click={() => toggleForm("deleteGuard")}>Delete Guard</Button>
          <Button click={() => toggleForm("addCycle")}>Add Cycle</Button>
          <Button click={() => toggleForm("deleteCycle")}>Delete Cycle</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
