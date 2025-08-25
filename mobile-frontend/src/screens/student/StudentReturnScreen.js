import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getActiveRental } from '../../services/rent.service';
import { createReturnQR } from '../../services/qr.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentReturnScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [activeRental, setActiveRental] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(0);

  useEffect(() => {
    fetchActiveRental();
  }, []);

  // QR countdown timer
  useEffect(() => {
    let interval;
    if (qrCountdown > 0) {
      interval = setInterval(() => {
        setQrCountdown(prev => {
          if (prev <= 1) {
            setShowQR(false);
            setQrData(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [qrCountdown]);

  const fetchActiveRental = async () => {
    try {
      setIsLoading(true);
      const rental = await getActiveRental();
      if (rental) {
        setActiveRental(rental);
      } else {
        Alert.alert(
          'No Active Rental',
          "You don't have any active rental to return.",
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load rental information. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCurrentStatus = () => {
    if (!activeRental) return null;

    const now = new Date();
    const startTime = new Date(activeRental.startTime);
    const plannedEndTime = new Date(activeRental.plannedEndTime);

    const actualDuration = Math.ceil((now - startTime) / (1000 * 60)); // in minutes
    const plannedDuration = Math.ceil(
      (plannedEndTime - startTime) / (1000 * 60),
    );
    const timeRemaining = Math.ceil((plannedEndTime - now) / (1000 * 60));

    const isOverdue = timeRemaining < 0;
    const overtime = Math.max(0, actualDuration - plannedDuration);
    const currentFine = overtime * 1; // ₹1 per minute

    return {
      actualDuration,
      plannedDuration,
      timeRemaining: Math.abs(timeRemaining),
      isOverdue,
      overtime,
      currentFine,
    };
  };

  const generateReturnQR = async () => {
    try {
      setIsLoading(true);
      const returnQRData = await createReturnQR(activeRental._id);

      setQrData(returnQRData);
      setQrCountdown(30); // 30 seconds countdown
      setShowQR(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to generate return QR code',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading rental details..." />;
  }

  if (!activeRental) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Return Cycle</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.noRentalContainer}>
          <Ionicons name="information-circle-outline" size={64} color="#ccc" />
          <Text style={styles.noRentalText}>No active rental found</Text>
        </View>
      </View>
    );
  }

  const status = calculateCurrentStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Cycle</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Cycle Information */}
        <View style={styles.cycleInfoCard}>
          <View style={styles.cycleHeader}>
            <Text style={styles.cycleTitle}>Current Rental</Text>
            <View
              style={[
                styles.statusBadge,
                status?.isOverdue ? styles.overdueBadge : styles.onTimeBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status?.isOverdue ? styles.overdueText : styles.onTimeText,
                ]}
              >
                {status?.isOverdue ? 'OVERDUE' : 'ON TIME'}
              </Text>
            </View>
          </View>

          <View style={styles.cycleDetails}>
            <View style={styles.cycleRow}>
              <Text style={styles.cycleLabel}>Cycle Number:</Text>
              <Text style={styles.cycleValue}>
                #{activeRental.cycle.cycleNumber}
              </Text>
            </View>
            <View style={styles.cycleRow}>
              <Text style={styles.cycleLabel}>Start Location:</Text>
              <Text style={styles.cycleValue}>
                {activeRental.startLocation
                  ?.replace('_', ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
            <View style={styles.cycleRow}>
              <Text style={styles.cycleLabel}>Start Time:</Text>
              <Text style={styles.cycleValue}>
                {new Date(activeRental.startTime).toLocaleString()}
              </Text>
            </View>
            <View style={styles.cycleRow}>
              <Text style={styles.cycleLabel}>Planned End:</Text>
              <Text style={styles.cycleValue}>
                {new Date(activeRental.plannedEndTime).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Time and Fine Information */}
        <View style={styles.timeCard}>
          <Text style={styles.timeCardTitle}>Current Status</Text>

          <View style={styles.timeGrid}>
            <View style={styles.timeItem}>
              <Text style={styles.timeItemValue}>
                {formatDuration(status?.actualDuration || 0)}
              </Text>
              <Text style={styles.timeItemLabel}>Time Used</Text>
            </View>
            <View style={styles.timeItem}>
              <Text
                style={[
                  styles.timeItemValue,
                  status?.isOverdue && styles.overdueValue,
                ]}
              >
                {status?.isOverdue
                  ? formatDuration(status.timeRemaining)
                  : formatDuration(status?.timeRemaining || 0)}
              </Text>
              <Text style={styles.timeItemLabel}>
                {status?.isOverdue ? 'Overdue' : 'Remaining'}
              </Text>
            </View>
          </View>

          {status?.overtime > 0 && (
            <View style={styles.overtimeAlert}>
              <Ionicons name="warning" size={20} color="#f44336" />
              <View style={styles.overtimeText}>
                <Text style={styles.overtimeTitle}>
                  Overtime: {formatDuration(status.overtime)}
                </Text>
                <Text style={styles.overtimeFine}>
                  Current fine: ₹{status.currentFine}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Return</Text>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Generate a return QR code by tapping the button below
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Show the QR code to the guard at any cycle station
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              The guard will scan your QR code to complete the return
            </Text>
          </View>
        </View>

        {/* Generate QR Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateReturnQR}
        >
          <Ionicons name="qr-code" size={24} color="white" />
          <Text style={styles.generateButtonText}>Generate Return QR</Text>
        </TouchableOpacity>
      </View>

      {/* QR Modal */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.qrModal}>
          <View style={styles.qrContainer}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>Return QR Code</Text>
              <Text style={styles.qrCountdown}>Expires in {qrCountdown}s</Text>
            </View>

            {qrData && (
              <View style={styles.qrCodeContainer}>
                {/* QR Code would be rendered here with a QR code library */}
                <View style={styles.qrCodePlaceholder}>
                  <Ionicons name="qr-code" size={120} color="#4CAF50" />
                  <Text style={styles.qrCodeText}>
                    Show this QR code to the guard
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.qrInfo}>
              <Text style={styles.qrInfoTitle}>Return Information</Text>
              <Text style={styles.qrInfoText}>
                Cycle: #{activeRental.cycle.cycleNumber}
              </Text>
              <Text style={styles.qrInfoText}>Student: {user?.name}</Text>
              {status?.currentFine > 0 && (
                <Text style={[styles.qrInfoText, styles.qrInfoFine]}>
                  Expected Fine: ₹{status.currentFine}
                </Text>
              )}
            </View>

            <View style={styles.qrActions}>
              <TouchableOpacity
                style={styles.qrCloseButton}
                onPress={() => setShowQR(false)}
              >
                <Text style={styles.qrCloseText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.qrNewButton}
                onPress={generateReturnQR}
              >
                <Text style={styles.qrNewText}>Generate New</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  noRentalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noRentalText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  cycleInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cycleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onTimeBadge: {
    backgroundColor: '#e8f5e8',
  },
  overdueBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  onTimeText: {
    color: '#4CAF50',
  },
  overdueText: {
    color: '#f44336',
  },
  cycleDetails: {
    gap: 12,
  },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleLabel: {
    fontSize: 14,
    color: '#666',
  },
  cycleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  timeItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  timeItemValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  overdueValue: {
    color: '#f44336',
  },
  timeItemLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  overtimeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  overtimeText: {
    flex: 1,
  },
  overtimeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 4,
  },
  overtimeFine: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
  },
  instructionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 2,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  qrCountdown: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  qrCodeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  qrInfo: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  qrInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  qrInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  qrInfoFine: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  qrActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  qrCloseButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrCloseText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrNewButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrNewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentReturnScreen;
