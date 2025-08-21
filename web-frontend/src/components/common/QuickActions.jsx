import React from "react";
import { FaUserPlus, FaBicycle, FaUserCog, FaFileAlt } from "react-icons/fa";

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: "add_student",
      label: "Add Student",
      icon: <FaUserPlus />,
      description: "Register new student",
    },
    {
      id: "add_cycle",
      label: "Add Cycle",
      icon: <FaBicycle />,
      description: "Add new cycle to fleet",
    },
    {
      id: "add_guard",
      label: "Add Guard",
      icon: <FaUserCog />,
      description: "Register new guard",
    },
    {
      id: "generate_report",
      label: "Generate Report",
      icon: <FaFileAlt />,
      description: "Create system report",
    },
  ];

  return (
    <div className="quick-actions-section">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="quick-action-btn"
            onClick={() => onActionClick(action.id)}
            title={action.description}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
