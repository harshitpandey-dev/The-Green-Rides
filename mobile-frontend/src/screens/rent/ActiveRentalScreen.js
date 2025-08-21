import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import {
  getActiveRental,
  submitCycleRating,
} from '../../services/rent.service';
import { generateReturnQR } from '../../services/qr.service';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import RatingStars from '../common/RatingStars';

const ActiveRentalScreen = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentFine, setCurrentFine] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const rentalId = route?.params?.rentalId;

  useEffect(() => {
    fetchActiveRental();
  }, [rentalId]);

  useEffect(() => {
    if (rental) {
      const timer = setInterval(updateTimeAndFine, 1000);
      return () => clearInterval(timer);
    }
  }, [rental]);

  const fetchActiveRental = async () => {
    try {
      setIsLoading(true);
      const activeRental = await getActiveRental();

      if (activeRental) {
        setRental(activeRental);
      } else {
        Alert.alert('No Active Rental', 'You do not have any active rental.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Fetch rental error:', error);
      Alert.alert('Error', 'Failed to fetch rental information');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateTimeAndFine = () => {
    if (!rental) return;

    const now = new Date();
    const expectedReturn = new Date(rental.expectedReturnTime);
    const timeDiff = expectedReturn.getTime() - now.getTime();

    if (timeDiff > 0) {
      // Time remaining
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      setTimeLeft({
        hours,
        minutes: remainingMinutes,
        isOverdue: false,
      });
      setCurrentFine(0);
    } else {
      // Overdue
      const overdueMinutes = Math.floor(Math.abs(timeDiff) / (1000 * 60));
      const overdueHours = Math.floor(overdueMinutes / 60);
      const remainingMinutes = overdueMinutes % 60;

      // Calculate fine (₹5 per minute after grace period)
      const gracePeriod = 15; // 15 minutes grace period
      const fineMinutes = Math.max(0, overdueMinutes - gracePeriod);
      const fine = fineMinutes * 5;

      setTimeLeft({
        hours: overdueHours,
        minutes: remainingMinutes,
        isOverdue: true,
      });
      setCurrentFine(fine);
    }
  };

  const handleReturnCycle = () => {
    Alert.alert(
      'Return Cycle',
      'To return the cycle, scan the QR code at the cycle stand.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Scan QR Code',
          onPress: () =>
            navigation.navigate('StudentQRScanner', { type: 'return' }),
        },
      ],
    );
  };

  const handleEmergencyReturn = async () => {
    Alert.alert(
      'Emergency Return',
      'Use this only if QR scanner is not working. This will generate a return code that the guard can use.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate Code', onPress: generateEmergencyCode },
      ],
    );
  };

  const generateEmergencyCode = async () => {
    try {
      setIsLoading(true);
      const result = await generateReturnQR(rental._id);

      Alert.alert(
        'Emergency Return Code',
        `Show this code to the guard: ${result.emergencyCode}\n\nCode expires in 5 minutes.`,
        [{ text: 'OK' }],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate emergency code');
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating');
      return;
    }

    try {
      setIsLoading(true);
      await submitCycleRating(rental.cycle._id, {
        rating,
        comment: ratingComment,
      });

      setShowRating(false);
      Alert.alert('Thank you!', 'Your rating has been submitted');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveRental();
  };

  const formatDateTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    if (!timeLeft) return '#4CAF50';
    if (timeLeft.isOverdue) return '#f44336';
    if (timeLeft.hours === 0 && timeLeft.minutes < 30) return '#ff6b35';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (!timeLeft) return 'Active';
    if (timeLeft.isOverdue) {
      return `Overdue by ${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `${timeLeft.hours}h ${timeLeft.minutes}m remaining`;
  };

  if (isLoading && !rental) {
    return <LoadingSpinner message="Loading rental information..." />;
  }

  if (!rental) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="bicycle-outline" size={64} color="#ccc" />
        <Text style={styles.noRentalText}>No active rental found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Status Header */}
      <View
        style={[styles.statusHeader, { backgroundColor: getStatusColor() }]}
      >
        <View style={styles.statusContent}>
          <Ionicons name="bicycle" size={32} color="white" />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              Cycle {rental.cycle.cycleNumber}
            </Text>
            <Text style={styles.statusSubtitle}>{getStatusText()}</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rental Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Rental Details</Text>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.detailLabel}>Rented At:</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(rental.startTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="alarm-outline" size={20} color="#666" />
          <Text style={styles.detailLabel}>Return By:</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(rental.expectedReturnTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>
            {rental.location.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="hourglass-outline" size={20} color="#666" />
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{rental.duration} minutes</Text>
        </View>
      </View>

      {/* Fine Information */}
      {currentFine > 0 && (
        <View style={styles.fineCard}>
          <View style={styles.fineHeader}>
            <Ionicons name="warning" size={24} color="#f44336" />
            <Text style={styles.fineTitle}>Late Return Fine</Text>
          </View>
          <Text style={styles.fineAmount}>₹{currentFine}</Text>
          <Text style={styles.fineNote}>
            Fine increases by ₹5 per minute after 15-minute grace period
          </Text>
        </View>
      )}

      {/* Time Warning */}
      {timeLeft &&
        !timeLeft.isOverdue &&
        timeLeft.hours === 0 &&
        timeLeft.minutes < 30 && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Ionicons name="time" size={24} color="#ff6b35" />
              <Text style={styles.warningTitle}>Return Soon!</Text>
            </View>
            <Text style={styles.warningText}>
              Only {timeLeft.minutes} minutes remaining. Return the cycle to
              avoid fines.
            </Text>
          </View>
        )}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <Button
          title="Return Cycle"
          onPress={handleReturnCycle}
          style={[styles.actionBtn, styles.returnBtn]}
          icon="qr-code-outline"
        />

        <Button
          title="Emergency Return"
          onPress={handleEmergencyReturn}
          variant="outline"
          style={styles.actionBtn}
          icon="help-circle-outline"
        />

        <TouchableOpacity
          style={styles.ratingBtn}
          onPress={() => setShowRating(true)}
        >
          <Text style={styles.ratingBtnText}>Rate This Cycle</Text>
          <Ionicons name="star-outline" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      {showRating && (
        <View style={styles.ratingModal}>
          <Text style={styles.ratingModalTitle}>
            Rate Cycle {rental.cycle.cycleNumber}
          </Text>

          <RatingStars
            rating={rating}
            onRatingChange={setRating}
            size={32}
            style={styles.ratingStars}
          />

          <View style={styles.ratingActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowRating(false)}
              style={styles.ratingActionBtn}
            />
            <Button
              title="Submit"
              onPress={submitRating}
              style={styles.ratingActionBtn}
            />
          </View>
        </View>
      )}

      {isLoading && <LoadingSpinner overlay />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  statusHeader: {
    padding: 20,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    marginLeft: 15,
  },
  statusTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  refreshBtn: {
    padding: 8,
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fineCard: {
    backgroundColor: '#fff5f5',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  fineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginLeft: 8,
  },
  fineAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  fineNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningCard: {
    backgroundColor: '#fff8f0',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#333',
  },
  actionSection: {
    padding: 15,
  },
  actionBtn: {
    marginBottom: 12,
  },
  returnBtn: {
    backgroundColor: '#4CAF50',
  },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginTop: 8,
  },
  ratingBtnText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  noRentalText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  ratingModal: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  ratingStars: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  ratingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingActionBtn: {
    flex: 0.45,
  },
});

export default ActiveRentalScreen;
