import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import {
  getCyclesByLocation,
  getCyclesForMaintenance,
} from '../../services/cycle.service';
import { getOverdueRentals } from '../../services/rent.service';
import { refreshUserProfile } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuardHomeScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    availableCycles: 0,
    rentedCycles: 0,
    maintenanceCycles: 0,
    overdueRentals: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    dispatch(refreshUserProfile());
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const location = user?.location || 'east_campus';

      // Fetch parallel data
      const [cycles, maintenanceCycles, overdueRentals] = await Promise.all([
        getCyclesByLocation(location).catch(() => []),
        getCyclesForMaintenance().catch(() => []),
        getOverdueRentals().catch(() => []),
      ]);

      const availableCycles = cycles.filter(c => c.isAvailable).length;
      const rentedCycles = cycles.filter(
        c => !c.isAvailable && !c.isUnderMaintenance,
      ).length;

      setStats({
        availableCycles,
        rentedCycles,
        maintenanceCycles: maintenanceCycles.length,
        overdueRentals: overdueRentals.length,
      });

      // Generate recent activity from overdue rentals
      const activity = overdueRentals.slice(0, 5).map(rental => ({
        id: rental._id,
        type: 'overdue',
        message: `${rental.user.name} - Cycle ${rental.cycle.cycleNumber} overdue`,
        time: rental.expectedReturnTime,
        priority: 'high',
      }));

      setRecentActivity(activity);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleQuickAction = action => {
    switch (action) {
      case 'rent':
        navigation.navigate('RentCycle');
        break;
      case 'return':
        navigation.navigate('Returns');
        break;
      case 'maintenance':
        // Navigate to maintenance screen if implemented
        Alert.alert('Maintenance', 'Maintenance management coming soon!');
        break;
      case 'overdue':
        navigation.navigate('Returns'); // Can filter for overdue
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = dateString => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff6b35';
      case 'low':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  if (isLoading && stats.availableCycles === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Guard'}!
          </Text>
          <Text style={styles.location}>
            📍{' '}
            {user?.location?.replace('_', ' ').toUpperCase() ||
              'Campus Location'}
          </Text>
        </View>
        <View style={styles.shiftBadge}>
          <Text style={styles.shiftText}>ON DUTY</Text>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Cycle Overview</Text>
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}
            onPress={() => handleQuickAction('rent')}
          >
            <Ionicons name="bicycle" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.availableCycles}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}
            onPress={() => handleQuickAction('return')}
          >
            <Ionicons name="time" size={32} color="#ff6b35" />
            <Text style={styles.statNumber}>{stats.rentedCycles}</Text>
            <Text style={styles.statLabel}>Rented Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}
            onPress={() => handleQuickAction('maintenance')}
          >
            <Ionicons name="build" size={32} color="#f44336" />
            <Text style={styles.statNumber}>{stats.maintenanceCycles}</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}
            onPress={() => handleQuickAction('overdue')}
          >
            <Ionicons name="warning" size={32} color="#E91E63" />
            <Text style={styles.statNumber}>{stats.overdueRentals}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('RentCycle')}
          >
            <Ionicons name="qr-code" size={24} color="white" />
            <Text style={styles.actionButtonText}>Rent Cycle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ff6b35' }]}
            onPress={() => navigation.navigate('Returns')}
          >
            <Ionicons name="return-down-back" size={24} color="white" />
            <Text style={styles.actionButtonText}>Process Return</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {recentActivity.length > 0 ? (
          <View style={styles.activityList}>
            {recentActivity.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons
                    name={
                      activity.type === 'overdue'
                        ? 'warning'
                        : 'information-circle'
                    }
                    size={20}
                    color={getPriorityColor(activity.priority)}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityMessage}>{activity.message}</Text>
                  <Text style={styles.activityTime}>
                    {formatTimeAgo(activity.time)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(activity.priority) },
                  ]}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyActivity}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyActivityText}>
              All good! No alerts at the moment
            </Text>
          </View>
        )}
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={24} color="#4CAF50" />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Guard Guidelines</Text>
            <Text style={styles.helpText}>
              • Check student ID before generating QR codes{'\n'}• Verify cycle
              condition before rental{'\n'}• Report damaged cycles immediately
              {'\n'}• Contact admin for emergencies
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  shiftBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  shiftText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyActivity: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyActivityText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  helpSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  helpCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpContent: {
    flex: 1,
    marginLeft: 15,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default GuardHomeScreen;
