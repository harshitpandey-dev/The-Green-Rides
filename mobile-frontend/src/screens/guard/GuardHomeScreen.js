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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getGuardStats } from '../../services/user.service';
import { getAvailableCycles } from '../../services/cycle.service';
import { getActiveRentals } from '../../services/rent.service';
import { setUser } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuardHomeScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);
  const [availableCycles, setAvailableCycles] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('east_campus');

  useEffect(() => {
    loadData();
    // Get guard's location
    if (user?.location) {
      setCurrentLocation(user.location);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchGuardStats(),
      fetchAvailableCycles(),
      fetchActiveRentals(),
    ]);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const fetchGuardStats = async () => {
    try {
      const guardStats = await getGuardStats();
      setStats(guardStats);
      dispatch(setUser({ ...user, ...guardStats }));
    } catch (error) {
      console.error('Failed to fetch guard stats:', error);
    }
  };

  const fetchAvailableCycles = async () => {
    try {
      const cycles = await getAvailableCycles(currentLocation);
      setAvailableCycles(cycles);
    } catch (error) {
      console.error('Failed to fetch available cycles:', error);
      Alert.alert('Error', 'Failed to load available cycles');
    }
  };

  const fetchActiveRentals = async () => {
    try {
      const rentals = await getActiveRentals(currentLocation);
      setActiveRentals(rentals);
    } catch (error) {
      console.error('Failed to fetch active rentals:', error);
    }
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getOverdueRentals = () => {
    const now = new Date();
    return activeRentals.filter(rental => {
      const plannedEndTime = new Date(rental.plannedEndTime);
      return now > plannedEndTime;
    });
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, styles.rentAction]}
          onPress={() => navigation.navigate('CreateRental')}
        >
          <Ionicons name="add-circle" size={32} color="white" />
          <Text style={styles.actionTitle}>Create Rental</Text>
          <Text style={styles.actionSubtitle}>Generate QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.returnAction]}
          onPress={() => navigation.navigate('AcceptReturn')}
        >
          <Ionicons name="qr-code-outline" size={32} color="white" />
          <Text style={styles.actionTitle}>Accept Return</Text>
          <Text style={styles.actionSubtitle}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, styles.listAction]}
          onPress={() => navigation.navigate('Rentals')}
        >
          <Ionicons name="list" size={32} color="white" />
          <Text style={styles.actionTitle}>View Rentals</Text>
          <Text style={styles.actionSubtitle}>Active & History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.cycleAction]}
          onPress={() => navigation.navigate('Cycles')}
        >
          <Ionicons name="bicycle" size={32} color="white" />
          <Text style={styles.actionTitle}>Manage Cycles</Text>
          <Text style={styles.actionSubtitle}>Check Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Today's Overview</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.todayRentals || 0}</Text>
          <Text style={styles.statLabel}>Rentals Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.todayReturns || 0}</Text>
          <Text style={styles.statLabel}>Returns Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.availableValue]}>
            {availableCycles.length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.activeValue]}>
            {activeRentals.length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>
    </View>
  );

  const renderActiveRentals = () => {
    const overdueRentals = getOverdueRentals();

    return (
      <View style={styles.rentalsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Rentals</Text>
          {overdueRentals.length > 0 && (
            <View style={styles.overduebadge}>
              <Text style={styles.overdueText}>
                {overdueRentals.length} overdue
              </Text>
            </View>
          )}
        </View>

        {activeRentals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bicycle-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No active rentals</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.rentalsList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {activeRentals.slice(0, 5).map(rental => {
              const now = new Date();
              const plannedEndTime = new Date(rental.plannedEndTime);
              const isOverdue = now > plannedEndTime;
              const timeRemaining = Math.ceil(
                (plannedEndTime - now) / (1000 * 60),
              );

              return (
                <View
                  key={rental._id}
                  style={[styles.rentalCard, isOverdue && styles.overdueCard]}
                >
                  <Text style={styles.cycleNumber}>
                    #{rental.cycle.cycleNumber}
                  </Text>
                  <Text style={styles.studentName}>
                    {rental.student.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.studentRoll}>
                    {rental.student.rollNo}
                  </Text>
                  <Text
                    style={[styles.timeStatus, isOverdue && styles.overdueTime]}
                  >
                    {isOverdue
                      ? `${formatDuration(Math.abs(timeRemaining))} overdue`
                      : `${formatDuration(timeRemaining)} left`}
                  </Text>
                </View>
              );
            })}
            {activeRentals.length > 5 && (
              <TouchableOpacity
                style={styles.seeMoreCard}
                onPress={() => navigation.navigate('Rentals')}
              >
                <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
                <Text style={styles.seeMoreText}>See All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderLocationInfo = () => (
    <View style={styles.locationContainer}>
      <Ionicons name="location" size={20} color="#4CAF50" />
      <Text style={styles.locationText}>
        {currentLocation
          .replace('_', ' ')
          .replace(/\b\w/g, l => l.toUpperCase())}
      </Text>
      <View style={styles.locationBadge}>
        <Text style={styles.locationBadgeText}>Your Station</Text>
      </View>
    </View>
  );

  if (isLoading) {
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
        <View>
          <Text style={styles.headerTitle}>
            Hello, {user?.name?.split(' ')[0]}!
          </Text>
          <Text style={styles.headerSubtitle}>Guard Portal</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Location Info */}
        {renderLocationInfo()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Statistics */}
        {renderStats()}

        {/* Active Rentals */}
        {renderActiveRentals()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  locationContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  locationBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  rentAction: {
    backgroundColor: '#4CAF50',
  },
  returnAction: {
    backgroundColor: '#2196F3',
  },
  listAction: {
    backgroundColor: '#FF9800',
  },
  cycleAction: {
    backgroundColor: '#9C27B0',
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  availableValue: {
    color: '#2196F3',
  },
  activeValue: {
    color: '#FF9800',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  rentalsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overdueBadge: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  rentalsList: {
    flexDirection: 'row',
  },
  rentalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  overdueCard: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  cycleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  timeStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  overdueTime: {
    color: '#f44336',
  },
  seeMoreCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  seeMoreText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default GuardHomeScreen;
