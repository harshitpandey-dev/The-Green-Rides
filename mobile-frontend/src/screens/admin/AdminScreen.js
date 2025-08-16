import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCyclesAsync } from '../../redux/slices/cycleSlice';
import AddCycleModal from '../../components/Admin/AddCycleModal';
import AddUserModal from '../../components/Admin/AddUserModal';
import ManageCyclesModal from '../../components/Admin/ManageCyclesModal';

const AdminScreen = () => {
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showManageCycles, setShowManageCycles] = useState(false);

  const dispatch = useDispatch();
  const { cycles } = useSelector(state => state.cycles);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchCyclesAsync());
    }
  }, [dispatch, user]);

  const availableCycles = cycles.filter(cycle => cycle.isAvailable).length;
  const rentedCycles = cycles.filter(cycle => !cycle.isAvailable).length;
  const totalCycles = cycles.length;

  const statsData = [
    {
      title: 'Total Cycles',
      value: totalCycles,
      color: '#2196F3',
      icon: '🚲',
    },
    {
      title: 'Available',
      value: availableCycles,
      color: '#4CAF50',
      icon: '✅',
    },
    {
      title: 'Rented',
      value: rentedCycles,
      color: '#FF9800',
      icon: '🚴‍♂️',
    },
    {
      title: 'Maintenance',
      value: 0, // This would come from backend
      color: '#f44336',
      icon: '🔧',
    },
  ];

  const adminActions = [
    {
      title: 'Add New Cycle',
      subtitle: 'Register a new cycle in the system',
      icon: '➕',
      onPress: () => setShowAddCycle(true),
      color: '#4CAF50',
    },
    {
      title: 'Add New User',
      subtitle: 'Register a new student or guard',
      icon: '👤',
      onPress: () => setShowAddUser(true),
      color: '#2196F3',
    },
    {
      title: 'Manage Cycles',
      subtitle: 'View, edit, or remove cycles',
      icon: '⚙️',
      onPress: () => setShowManageCycles(true),
      color: '#FF9800',
    },
    {
      title: 'View Reports',
      subtitle: 'Analytics and usage reports',
      icon: '📊',
      onPress: () => {
        // Navigate to reports screen
      },
      color: '#9C27B0',
    },
  ];

  const renderStatCard = (stat, index) => (
    <View
      key={index}
      style={[styles.statCard, { borderLeftColor: stat.color }]}
    >
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{stat.icon}</Text>
        <Text style={[styles.statValue, { color: stat.color }]}>
          {stat.value}
        </Text>
      </View>
      <Text style={styles.statTitle}>{stat.title}</Text>
    </View>
  );

  const renderActionCard = (action, index) => (
    <TouchableOpacity
      key={index}
      style={styles.actionCard}
      onPress={action.onPress}
    >
      <View style={styles.actionHeader}>
        <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
          <Text style={styles.actionIconText}>{action.icon}</Text>
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>Access Denied</Text>
          <Text style={styles.unauthorizedSubtext}>
            You don't have admin privileges to access this section.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage Green Rides System</Text>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>{statsData.map(renderStatCard)}</View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            {adminActions.map(renderActionCard)}
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              No recent activity to display
            </Text>
            <Text style={styles.activitySubtext}>
              Recent system activities will appear here
            </Text>
          </View>
        </View>
      </ScrollView>

      <AddCycleModal
        visible={showAddCycle}
        onClose={() => setShowAddCycle(false)}
        onSuccess={() => {
          setShowAddCycle(false);
          dispatch(fetchCyclesAsync());
        }}
      />

      <AddUserModal
        visible={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSuccess={() => setShowAddUser(false)}
      />

      <ManageCyclesModal
        visible={showManageCycles}
        onClose={() => setShowManageCycles(false)}
        cycles={cycles}
        onUpdate={() => dispatch(fetchCyclesAsync())}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 20,
    color: '#fff',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: 'bold',
  },
  recentActivity: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  unauthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 12,
  },
  unauthorizedSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminScreen;
