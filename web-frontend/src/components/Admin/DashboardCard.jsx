import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = "primary",
  onClick,
}) => {
  const getTrendClass = () => {
    if (trend === "urgent") return "trend--urgent";
    if (trend === "critical") return "trend--critical";
    if (trend?.startsWith("+")) return "trend--positive";
    if (trend?.startsWith("-")) return "trend--negative";
    return "trend--neutral";
  };

  return (
    <div
      className={`dashboard-card dashboard-card--${color} ${
        onClick ? "dashboard-card--clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="dashboard-card__header">
        <div className="dashboard-card__icon">{icon}</div>
        {trend && (
          <div className={`dashboard-card__trend ${getTrendClass()}`}>
            {trend === "urgent" ? "!" : trend === "critical" ? "!!" : trend}
          </div>
        )}
      </div>

      <div className="dashboard-card__content">
        <h3 className="dashboard-card__title">{title}</h3>
        <div className="dashboard-card__value">{value}</div>
        {subtitle && <p className="dashboard-card__subtitle">{subtitle}</p>}
      </div>

      <div className="dashboard-card__footer">
        <div className="dashboard-card__action">View Details →</div>
      </div>
    </div>
  );
};

export default DashboardCard;
