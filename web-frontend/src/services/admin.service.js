import { apiUtils } from "../utils/api.util.js";

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const [
        studentsResponse,
        guardsResponse,
        cyclesResponse,
        financeResponse,
      ] = await Promise.all([
        apiUtils.get("/users/students"),
        apiUtils.get("/users/guards"),
        apiUtils.get("/cycles/stats/dashboard"),
        apiUtils.get("/finance/dashboard"),
      ]);

      return {
        students: {
          total: studentsResponse.length,
          active: studentsResponse.filter((s) => s.status === "active").length,
          suspended: studentsResponse.filter((s) => s.status === "blocked")
            .length,
        },
        guards: {
          total: guardsResponse.length,
          active: guardsResponse.filter((g) => g.status === "active").length,
        },
        cycles: {
          total: cyclesResponse.total || 0,
          available: cyclesResponse.available || 0,
          rented: cyclesResponse.rented || 0,
          maintenance: cyclesResponse.maintenance || 0,
        },
        finance: {
          totalFines: financeResponse.totalFines || 0,
          collectedToday: financeResponse.todayCollection || 0,
          pendingFines: financeResponse.pendingAmount || 0,
        },
        rentals: {
          activeRentals: cyclesResponse.rented || 0,
          overdueRentals: financeResponse.overdueCount || 0,
          totalToday: cyclesResponse.todayRentals || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return mock data as fallback
      return {
        students: { total: 0, active: 0, suspended: 0 },
        guards: { total: 0, active: 0 },
        cycles: { total: 0, available: 0, rented: 0, maintenance: 0 },
        finance: { totalFines: 0, collectedToday: 0, pendingFines: 0 },
        rentals: { activeRentals: 0, overdueRentals: 0, totalToday: 0 },
      };
    }
  },

  // Get system alerts
  getSystemAlerts: async () => {
    try {
      // This would typically come from a dedicated alerts API
      // For now, we'll derive alerts from existing data
      const [financeData, cycleData] = await Promise.all([
        apiUtils.get("/finance/dashboard"),
        apiUtils.get("/cycles/stats/dashboard"),
      ]);

      const alerts = [];

      if (financeData.overdueCount > 0) {
        alerts.push({
          id: "overdue-fines",
          type: "error",
          title: "Overdue Fines",
          message: `${financeData.overdueCount} students have overdue fines`,
          timestamp: new Date().toISOString(),
        });
      }

      if (cycleData.maintenance > 5) {
        alerts.push({
          id: "maintenance-cycles",
          type: "warning",
          title: "Cycles in Maintenance",
          message: `${cycleData.maintenance} cycles are currently in maintenance`,
          timestamp: new Date().toISOString(),
        });
      }

      if (cycleData.available < 10) {
        alerts.push({
          id: "low-availability",
          type: "warning",
          title: "Low Cycle Availability",
          message: `Only ${cycleData.available} cycles are available for rent`,
          timestamp: new Date().toISOString(),
        });
      }

      return alerts;
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      return [];
    }
  },

  // Get recent activities
  getRecentActivity: async () => {
    try {
      // This would typically come from an activity log API
      // For now, return mock data
      return [
        {
          id: 1,
          type: "rental",
          message: "New rental: John Doe rented GR001",
          timestamp: "2024-01-15 14:30",
          icon: "rental",
        },
        {
          id: 2,
          type: "payment",
          message: "Fine collected: ₹150 from Jane Smith",
          timestamp: "2024-01-15 13:45",
          icon: "payment",
        },
        {
          id: 3,
          type: "maintenance",
          message: "Cycle GR003 marked for maintenance",
          timestamp: "2024-01-15 12:20",
          icon: "maintenance",
        },
        {
          id: 4,
          type: "user",
          message: "New guard registered: Mike Wilson",
          timestamp: "2024-01-15 11:15",
          icon: "user",
        },
        {
          id: 5,
          type: "return",
          message: "Cycle returned: Sarah Wilson returned GR002",
          timestamp: "2024-01-15 10:30",
          icon: "return",
        },
      ];
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  },
};
