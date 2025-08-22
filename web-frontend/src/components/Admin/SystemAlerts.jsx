import React from "react";
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "../../styles/components/systemAlerts.css";

const SystemAlerts = ({ alerts = [], onDismiss }) => {
  if (!alerts.length) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
      case "critical":
        return <FaExclamationTriangle />;
      case "info":
      default:
        return <FaInfoCircle />;
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case "critical":
        return "alert--critical";
      case "warning":
        return "alert--warning";
      case "info":
      default:
        return "alert--info";
    }
  };

  return (
    <div className="system-alerts">
      {alerts.map((alert, index) => (
        <div
          key={alert.id || index}
          className={`alert ${getAlertClass(alert.type)}`}
        >
          <div className="alert__icon">{getAlertIcon(alert.type)}</div>

          <div className="alert__content">
            <div className="alert__title">{alert.title}</div>
            <div className="alert__message">{alert.message}</div>
            {alert.action && (
              <button className="alert__action" onClick={alert.action.onClick}>
                {alert.action.text}
              </button>
            )}
          </div>

          <button
            className="alert__dismiss"
            onClick={() => onDismiss(alert.id)}
            aria-label="Dismiss alert"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SystemAlerts;
