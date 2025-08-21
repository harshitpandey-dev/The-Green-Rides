import React from "react";
import "./RecentActivity.css";
import {
  FaBicycle,
  FaUser,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "rental",
      message: "Student ST001 rented Cycle C101",
      time: "2 minutes ago",
      icon: <FaBicycle />,
      color: "#4CAF50",
    },
    {
      id: 2,
      type: "user",
      message: "New guard registered: John Doe",
      time: "5 minutes ago",
      icon: <FaUser />,
      color: "#2196F3",
    },
    {
      id: 3,
      type: "system",
      message: "System backup completed",
      time: "10 minutes ago",
      icon: <FaCog />,
      color: "#FF9800",
    },
    {
      id: 4,
      type: "alert",
      message: "Cycle C105 reported maintenance issue",
      time: "15 minutes ago",
      icon: <FaExclamationTriangle />,
      color: "#f44336",
    },
    {
      id: 5,
      type: "rental",
      message: "Cycle C102 returned by Student ST003",
      time: "20 minutes ago",
      icon: <FaBicycle />,
      color: "#4CAF50",
    },
  ];

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div
              className="activity-icon"
              style={{ backgroundColor: activity.color }}
            >
              {activity.icon}
            </div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="view-all-btn">View All Activity</button>
    </div>
  );
};

export default RecentActivity;
