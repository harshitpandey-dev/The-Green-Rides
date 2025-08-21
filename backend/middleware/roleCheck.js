// Role-based access control middleware
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: "User role not found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          required: allowedRoles,
          current: userRole,
        });
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Role check failed", error: error.message });
    }
  };
};

module.exports = roleCheck;
