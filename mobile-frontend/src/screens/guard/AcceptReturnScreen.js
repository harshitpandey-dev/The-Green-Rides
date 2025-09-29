import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Vibration,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { processReturnQR } from '../../services/qr.service';
import { getActiveRentals } from '../../services/rent.service';
import {
  COLORS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
  formatTime,
  formatCurrency,
} from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AcceptReturnScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeRentals, setActiveRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [returnResult, setReturnResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await loadActiveRentals();

      // Refresh every 30 seconds
      const interval = setInterval(loadActiveRentals, 30000);
      return () => clearInterval(interval);
    };

    const cleanup = loadData();
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, []);

  const loadActiveRentals = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const rentals = await getActiveRentals(user?.location);
      setActiveRentals(rentals || []);
    } catch (error) {
      console.error('Error loading active rentals:', error);
      Alert.alert('Error', 'Failed to load active rentals');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadActiveRentals();
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (isProcessing || scannedData === data) return;

    try {
      setScannedData(data);
      setIsProcessing(true);
      Vibration.vibrate(100);

      const response = await processReturnQR(data);

      if (response.success) {
        setReturnResult(response);
        setShowResultModal(true);
        setShowScanner(false);

        // Refresh active rentals
        await loadActiveRentals();
      } else {
        Alert.alert(
          'Return Failed',
          response.message || 'Invalid or expired QR code',
          [{ text: 'OK', onPress: () => setScannedData(null) }],
        );
      }
    } catch (error) {
      console.error('Error processing return:', error);
      Alert.alert('Error', 'Failed to process return. Please try again.', [
        { text: 'OK', onPress: () => setScannedData(null) },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateOvertime = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + duration * 60000);

    if (now > endTime) {
      return Math.floor((now - endTime) / 60000); // overtime in minutes
    }
    return 0;
  };

  const calculateRemainingTime = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + duration * 60000);

    if (now < endTime) {
      return Math.floor((endTime - now) / 60000); // remaining time in minutes
    }
    return 0;
  };

  const renderActiveRental = rental => {
    const overtimeMinutes = calculateOvertime(
      rental.startTime,
      rental.duration,
    );
    const remainingMinutes = calculateRemainingTime(
      rental.startTime,
      rental.duration,
    );
    const isOverdue = overtimeMinutes > 0;

    return (
      <View
        key={rental._id}
        style={[styles.rentalCard, isOverdue && styles.overdueCard]}
      >
        <View style={styles.rentalHeader}>
          <View>
            <Text style={styles.studentName}>
              {rental.student?.name || 'Unknown Student'}
            </Text>
            <Text style={styles.rollNumber}>{rental.student?.rollNumber}</Text>
          </View>
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleNumber}>#{rental.cycle?.cycleNumber}</Text>
            {isOverdue && (
              <View style={[styles.statusBadge, styles.overdueStatus]}>
                <Text style={styles.overdueText}>OVERDUE</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rentalDetails}>
          <View style={styles.detailRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailLabel}>Start Time:</Text>
            <Text style={styles.detailValue}>
              {new Date(rental.startTime).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="hourglass-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>
              {formatTime(rental.duration)}
            </Text>
          </View>

          {isOverdue ? (
            <View style={styles.detailRow}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={COLORS.danger}
              />
              <Text style={[styles.detailLabel, { color: COLORS.danger }]}>
                Overdue:
              </Text>
              <Text style={[styles.detailValue, styles.dangerTextBold]}>
                {formatTime(overtimeMinutes)}
              </Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <Ionicons name="timer-outline" size={16} color={COLORS.success} />
              <Text style={[styles.detailLabel, { color: COLORS.success }]}>
                Remaining:
              </Text>
              <Text style={[styles.detailValue, styles.successTextBold]}>
                {formatTime(remainingMinutes)}
              </Text>
            </View>
          )}

          {rental.student?.phone && (
            <View style={styles.detailRow}>
              <Ionicons
                name="call-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{rental.student.phone}</Text>
            </View>
          )}
        </View>

        {isOverdue && (
          <View style={styles.fineInfo}>
            <Ionicons name="cash-outline" size={16} color={COLORS.warning} />
            <Text style={styles.fineText}>
              Estimated Fine: {formatCurrency(overtimeMinutes * 1)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderResultModal = () => (
    <Modal
      visible={showResultModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowResultModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.resultModalContainer}>
          <View style={styles.resultHeader}>
            <Ionicons
              name="checkmark-circle"
              size={48}
              color={COLORS.success}
            />
            <Text style={styles.resultTitle}>Return Completed!</Text>
          </View>

          {returnResult && (
            <ScrollView style={styles.resultDetails}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Student:</Text>
                <Text style={styles.resultValue}>
                  {returnResult.student?.name}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Roll Number:</Text>
                <Text style={styles.resultValue}>
                  {returnResult.student?.rollNumber}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Cycle:</Text>
                <Text style={styles.resultValue}>
                  #{returnResult.cycle?.cycleNumber}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Duration:</Text>
                <Text style={styles.resultValue}>
                  {formatTime(returnResult.duration)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Actual Time:</Text>
                <Text style={styles.resultValue}>
                  {formatTime(returnResult.actualDuration || 0)}
                </Text>
              </View>

              {returnResult.fine > 0 && (
                <View style={styles.fineSection}>
                  <View style={styles.resultRow}>
                    <Text
                      style={[styles.resultLabel, { color: COLORS.danger }]}
                    >
                      Fine Applied:
                    </Text>
                    <Text style={[styles.resultValue, styles.dangerTextBold]}>
                      {formatCurrency(returnResult.fine)}
                    </Text>
                  </View>

                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Overtime:</Text>
                    <Text style={styles.resultValue}>
                      {formatTime(returnResult.overtimeMinutes || 0)}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Return Time:</Text>
                <Text style={styles.resultValue}>
                  {new Date().toLocaleString('en-IN')}
                </Text>
              </View>
            </ScrollView>
          )}

          <TouchableOpacity
            style={[COMMON_STYLES.primaryButton, styles.modalButton]}
            onPress={() => setShowResultModal(false)}
          >
            <Text style={COMMON_STYLES.primaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderScanner = () => (
    <Modal
      visible={showScanner}
      animationType="slide"
      onRequestClose={() => !isProcessing && setShowScanner(false)}
    >
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <Text style={styles.scannerTitle}>Scan Return QR</Text>
          {!isProcessing && (
            <TouchableOpacity onPress={() => setShowScanner(false)}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>

        <RNCamera
          style={styles.camera}
          onBarCodeRead={handleBarCodeScanned}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          captureAudio={false}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </RNCamera>

        <View style={styles.scannerInstructions}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <LoadingSpinner color={COLORS.white} />
              <Text style={styles.processingText}>Processing return...</Text>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              Position the student's QR code within the frame
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={COMMON_STYLES.loadingContainer}>
        <LoadingSpinner />
        <Text style={COMMON_STYLES.loadingText}>Loading active rentals...</Text>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      {/* Header */}
      <View style={COMMON_STYLES.header}>
        <View>
          <Text style={COMMON_STYLES.headerTitle}>Accept Returns</Text>
          <Text style={COMMON_STYLES.headerSubtitle}>
            {activeRentals.length} active rental
            {activeRentals.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          <Ionicons
            name="refresh"
            size={24}
            color={refreshing ? COLORS.textSecondary : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Active Rentals List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <ScrollView.RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {activeRentals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bicycle" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Active Rentals</Text>
            <Text style={styles.emptyText}>
              All cycles have been returned at your location
            </Text>
          </View>
        ) : (
          activeRentals.map(renderActiveRental)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowScanner(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="qr-code-outline" size={28} color={COLORS.white} />
      </TouchableOpacity>

      {/* QR Scanner Modal */}
      {renderScanner()}

      {/* Return Result Modal */}
      {renderResultModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  rentalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: SIZES.margin,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  cycleInfo: {
    alignItems: 'flex-end',
  },
  cycleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueStatus: {
    backgroundColor: COLORS.danger,
  },
  overdueText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  rentalDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
  },
  dangerTextBold: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  successTextBold: {
    color: COLORS.success,
    fontWeight: '600',
  },
  fineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}10`,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.warning}30`,
  },
  fineText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.hover,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: 50, // Account for status bar
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannerInstructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  resultModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    maxWidth: 350,
    width: '100%',
    maxHeight: '80%',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 12,
  },
  resultDetails: {
    maxHeight: 300,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  resultLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    textAlign: 'right',
    flex: 1,
  },
  fineSection: {
    backgroundColor: `${COLORS.danger}05`,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  modalButton: {
    marginTop: 20,
  },
});

export default AcceptReturnScreen;
