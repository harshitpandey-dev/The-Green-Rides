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

import { getActiveRental } from '../../services/rent.service';
import { refreshUserProfile } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentHomeScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [activeRental, setActiveRental] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchActiveRental();
    dispatch(refreshUserProfile());
  }, [dispatch]);

  const fetchActiveRental = async () => {
    try {
      setIsLoading(true);
      const rental = await getActiveRental();
      setActiveRental(rental);
    } catch (error) {
      console.log('No active rental found');
      setActiveRental(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveRental();
    dispatch(refreshUserProfile());
  };

  const handleRentCycle = () => {
    navigation.navigate('StudentQRScanner', { type: 'rental' });
  };

  const handleReturnCycle = () => {
    navigation.navigate('StudentQRScanner', { type: 'return' });
  };

  const handleViewActiveRental = () => {
    if (activeRental) {
      navigation.navigate('ActiveRental', { rentalId: activeRental._id });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRentalStatusColor = rental => {
    if (!rental) return '#4CAF50';

    const now = new Date();
    const expectedReturn = new Date(rental.expectedReturnTime);
    const timeDiff = expectedReturn.getTime() - now.getTime();

    if (timeDiff < 0) return '#f44336'; // Overdue
    if (timeDiff < 30 * 60 * 1000) return '#ff6b35'; // Less than 30 minutes
    return '#4CAF50'; // Good
  };

  const formatTimeLeft = rental => {
    if (!rental) return '';

    const now = new Date();
    const expectedReturn = new Date(rental.expectedReturnTime);
    const timeDiff = expectedReturn.getTime() - now.getTime();

    if (timeDiff < 0) {
      const overdueMinutes = Math.floor(Math.abs(timeDiff) / (1000 * 60));
      return `Overdue by ${overdueMinutes}m`;
    }

    const minutesLeft = Math.floor(timeDiff / (1000 * 60));
    const hoursLeft = Math.floor(minutesLeft / 60);
    const remainingMinutes = minutesLeft % 60;

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${remainingMinutes}m left`;
    }
    return `${remainingMinutes}m left`;
  };

  if (isLoading && !activeRental) {
    return <LoadingSpinner message="Loading..." />;
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
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}!
        </Text>
        <Text style={styles.subtitle}>Ready to ride green today?</Text>
      </View>

      {/* Active Rental Card */}
      {activeRental ? (
        <TouchableOpacity
          style={[
            styles.rentalCard,
            { borderLeftColor: getRentalStatusColor(activeRental) },
          ]}
          onPress={handleViewActiveRental}
        >
          <View style={styles.rentalHeader}>
            <Ionicons
              name="bicycle"
              size={24}
              color={getRentalStatusColor(activeRental)}
            />
            <Text style={styles.rentalTitle}>Active Rental</Text>
          </View>
          <Text style={styles.cycleInfo}>
            Cycle {activeRental.cycle?.cycleNumber || 'N/A'}
          </Text>
          <Text
            style={[
              styles.timeInfo,
              { color: getRentalStatusColor(activeRental) },
            ]}
          >
            {formatTimeLeft(activeRental)}
          </Text>
          <View style={styles.rentalActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReturnCycle}
            >
              <Ionicons name="qr-code" size={18} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Return Cycle</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.noRentalCard}>
          <Ionicons name="bicycle-outline" size={48} color="#ccc" />
          <Text style={styles.noRentalTitle}>No Active Rental</Text>
          <Text style={styles.noRentalText}>
            Scan a QR code to rent a cycle
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[
              styles.actionCard,
              !activeRental && styles.actionCardPrimary,
            ]}
            onPress={handleRentCycle}
            disabled={!!activeRental}
          >
            <Ionicons
              name="qr-code"
              size={32}
              color={activeRental ? '#ccc' : '#4CAF50'}
            />
            <Text
              style={[
                styles.actionCardText,
                activeRental && styles.actionCardTextDisabled,
              ]}
            >
              Rent Cycle
            </Text>
            {activeRental && (
              <Text style={styles.disabledText}>
                Already have active rental
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
          >
            <Ionicons name="time" size={32} color="#4CAF50" />
            <Text style={styles.actionCardText}>View History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user?.totalTimesRented || 0}</Text>
            <Text style={styles.statLabel}>Total Rentals</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user?.totalTimeRidden || 0}h</Text>
            <Text style={styles.statLabel}>Time Ridden</Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={[
                styles.statNumber,
                { color: user?.fine > 0 ? '#f44336' : '#4CAF50' },
              ]}
            >
              ₹{user?.fine || 0}
            </Text>
            <Text style={styles.statLabel}>Current Fine</Text>
          </View>
        </View>
      </View>

      {/* Fine Warning */}
      {user?.fine > 400 && (
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={24} color="#f44336" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>High Fine Amount!</Text>
            <Text style={styles.warningText}>
              Your fine is ₹{user.fine}. Pay soon to continue renting cycles.
            </Text>
          </View>
        </View>
      )}
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
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  rentalCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rentalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rentalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  cycleInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  timeInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  rentalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 5,
  },
  noRentalCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noRentalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  noRentalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  quickActions: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
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
  actionCardPrimary: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  actionCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  actionCardTextDisabled: {
    color: '#ccc',
  },
  disabledText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  statsSection: {
    margin: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    flex: 0.32,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#fff5f5',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  warningContent: {
    flex: 1,
    marginLeft: 15,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default StudentHomeScreen;
