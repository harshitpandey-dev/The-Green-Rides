import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';

import { getActiveRental, startNewRental } from '../../services/rent.service';
import { generateReturnQR } from '../../services/qr.service';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QRScanner from '../../components/common/QRScanner';

const { width } = Dimensions.get('window');

const ActiveRentalScreen = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentFine, setCurrentFine] = useState(0);
  const [returnQR, setReturnQR] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const rentalId = route?.params?.rentalId;

  useEffect(() => {
    fetchActiveRental();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentalId]);

  useEffect(() => {
    if (rental) {
      const timer = setInterval(() => {
        updateTimeAndFine();
        generateDynamicReturnQR();
      }, 30000); // Update every 30 seconds for QR

      // Update time every second
      const timeTimer = setInterval(updateTimeAndFine, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(timeTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rental]);

  const fetchActiveRental = async () => {
    try {
      setIsLoading(true);
      const activeRental = await getActiveRental();

      if (activeRental) {
        setRental(activeRental);
        updateTimeAndFine();
        generateDynamicReturnQR();
      } else {
        setRental(null);
      }
    } catch (error) {
      console.error('Error fetching active rental:', error);
      setRental(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateTimeAndFine = () => {
    if (!rental) return;

    const now = new Date();
    const startTime = new Date(rental.rented_at);
    const plannedEndTime = new Date(rental.plannedEndTime);
    const elapsedMs = now.getTime() - startTime.getTime();
    const plannedDurationMs = plannedEndTime.getTime() - startTime.getTime();

    const remainingMs = plannedDurationMs - elapsedMs;
    const remainingMinutes = Math.max(0, Math.floor(remainingMs / 60000));

    setTimeLeft(remainingMinutes);

    // Calculate fine if overtime
    if (remainingMs < 0) {
      const overtimeMinutes = Math.abs(Math.floor(remainingMs / 60000));
      const fine = overtimeMinutes * 1; // ₹1 per minute
      setCurrentFine(fine);
    } else {
      setCurrentFine(0);
    }
  };

  const generateDynamicReturnQR = async () => {
    try {
      const qrData = await generateReturnQR(rental.id);
      setReturnQR(qrData);
    } catch (error) {
      console.error('Error generating return QR:', error);
    }
  };

  const formatTime = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleStartNewRental = () => {
    // Check if user has too much fine
    if (user.fine > 500) {
      Alert.alert(
        'Rental Restricted',
        `You have an outstanding fine of ₹${user.fine}. Please clear your fine to rent a cycle. Maximum allowed fine is ₹500.`,
        [{ text: 'OK' }],
      );
      return;
    }

    setShowQRScanner(true);
  };

  const handleQRScanned = async qrData => {
    try {
      setShowQRScanner(false);
      setIsLoading(true);

      const newRental = await startNewRental(qrData);
      setRental(newRental);
      updateTimeAndFine();
      generateDynamicReturnQR();

      Alert.alert('Success', 'Rental started successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start rental');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendRental = () => {
    Alert.alert(
      'Extend Rental',
      'Would you like to extend your rental by 1 hour?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Extend',
          onPress: () => {
            // Implement extend rental logic
            Alert.alert('Success', 'Rental extended by 1 hour');
          },
        },
      ],
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveRental();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading rental information..." />;
  }

  if (showQRScanner) {
    return (
      <QRScanner
        onScan={handleQRScanned}
        onClose={() => setShowQRScanner(false)}
        type="rental"
      />
    );
  }

  // No Active Rental - Show Option to Start New Rental
  if (!rental) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.noRentalContainer}>
          <Ionicons name="bicycle-outline" size={80} color="#666" />
          <Text style={styles.noRentalTitle}>No Active Rental</Text>
          <Text style={styles.noRentalSubtitle}>
            You don't have any active cycle rental
          </Text>

          {user.fine > 500 ? (
            <View style={styles.fineWarning}>
              <Ionicons name="warning" size={24} color="#ff4444" />
              <Text style={styles.fineWarningText}>
                Outstanding fine: ₹{user.fine}
              </Text>
              <Text style={styles.fineWarningSubtext}>
                Clear your fine to rent a cycle (Max: ₹500)
              </Text>
            </View>
          ) : (
            <Button
              title="Start New Rental"
              onPress={handleStartNewRental}
              style={styles.startRentalButton}
              icon="qr-code"
            />
          )}
        </View>
      </ScrollView>
    );
  }

  // Active Rental Display
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Rental Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.statusBadge}>
          <Ionicons name="time" size={16} color="#fff" />
          <Text style={styles.statusText}>ACTIVE RENTAL</Text>
        </View>
        {currentFine > 0 && (
          <View style={styles.fineBadge}>
            <Text style={styles.fineText}>Fine: ₹{currentFine}</Text>
          </View>
        )}
      </View>

      {/* Cycle Information */}
      <View style={styles.cycleInfoCard}>
        <View style={styles.cycleHeader}>
          <Ionicons name="bicycle" size={24} color="#2e7d32" />
          <Text style={styles.cycleId}>Cycle #{rental.cycle?.id || 'N/A'}</Text>
        </View>
        <Text style={styles.cycleLocation}>
          Station: {rental.cycle?.station || 'Unknown'}
        </Text>
        <Text style={styles.rentalTime}>
          Started: {formatTimestamp(rental.rented_at)}
        </Text>
      </View>

      {/* Time Display */}
      <View style={styles.timeCard}>
        <Text style={styles.timeLabel}>
          {timeLeft > 0 ? 'Time Remaining' : 'Overtime'}
        </Text>
        <Text
          style={[styles.timeValue, timeLeft === 0 && styles.overtimeValue]}
        >
          {formatTime(Math.abs(timeLeft))}
        </Text>
        {currentFine > 0 && (
          <Text style={styles.fineAmount}>Current Fine: ₹{currentFine}</Text>
        )}
      </View>

      {/* Return QR Code */}
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Return QR Code</Text>
        <Text style={styles.qrSubtitle}>
          Show this QR code to the guard when returning
        </Text>
        <View style={styles.qrContainer}>
          {returnQR ? (
            <QRCode
              value={returnQR}
              size={width * 0.5}
              color="#000"
              backgroundColor="#fff"
            />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={60} color="#ccc" />
              <Text style={styles.qrPlaceholderText}>Generating QR...</Text>
            </View>
          )}
        </View>
        <Text style={styles.qrNote}>
          QR code refreshes every 30 seconds for security
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {timeLeft > 0 && (
          <Button
            title="Extend Rental"
            onPress={handleExtendRental}
            style={[styles.actionButton, styles.extendButton]}
            icon="time-outline"
          />
        )}

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() =>
            Alert.alert(
              'Help',
              'For assistance, contact the guard at your station or call our helpline.',
            )
          }
        >
          <Ionicons name="help-circle-outline" size={20} color="#2e7d32" />
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noRentalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 500,
  },
  noRentalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  noRentalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  fineWarning: {
    backgroundColor: '#ffe6e6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  fineWarningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cc0000',
    marginTop: 10,
  },
  fineWarningSubtext: {
    fontSize: 14,
    color: '#cc0000',
    textAlign: 'center',
    marginTop: 5,
  },
  startRentalButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  fineBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  fineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cycleInfoCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cycleId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
  cycleLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rentalTime: {
    fontSize: 14,
    color: '#666',
  },
  timeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  overtimeValue: {
    color: '#ff4444',
  },
  fineAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
    marginTop: 10,
  },
  qrCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  qrPlaceholder: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  qrPlaceholderText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
  },
  qrNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    marginBottom: 15,
  },
  extendButton: {
    backgroundColor: '#ff9800',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  helpButtonText: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ActiveRentalScreen;
