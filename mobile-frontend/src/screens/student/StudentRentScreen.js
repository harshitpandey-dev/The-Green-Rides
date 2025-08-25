import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUserProfile } from '../../services/user.service';
import { getActiveRental } from '../../services/rent.service';
import { validateRentalQR } from '../../services/qr.service';
import { setUser } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QRScanner from '../../components/common/QRScanner';

const StudentRentScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [activeRental, setActiveRental] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showRentalDetails, setShowRentalDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchUserProfile(), fetchActiveRental()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      dispatch(setUser(profile));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchActiveRental = async () => {
    try {
      const rental = await getActiveRental();
      setActiveRental(rental);
    } catch (error) {
      if (error.message !== 'No active rental found') {
        console.error('Failed to fetch active rental:', error);
      }
    }
  };

  const handleQRScan = async data => {
    try {
      setIsLoading(true);
      setShowQRScanner(false);

      // Validate the QR code and start rental
      const result = await validateRentalQR(data);

      if (result.success) {
        Alert.alert(
          'Rental Started Successfully!',
          `Cycle: ${result.rental.cycle.cycleNumber}\nDuration: ${
            result.rental.duration
          } minutes\nReturn by: ${new Date(
            result.rental.plannedEndTime,
          ).toLocaleString()}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setActiveRental(result.rental);
                fetchUserProfile(); // Refresh user data
              },
            },
          ],
        );
      } else {
        Alert.alert('QR Code Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to start rental');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTimeRemaining = () => {
    if (!activeRental) return null;

    const now = new Date();
    const endTime = new Date(activeRental.plannedEndTime);
    const diff = endTime - now;

    if (diff <= 0) {
      const overdue = Math.ceil(Math.abs(diff) / (1000 * 60));
      return {
        text: `${formatDuration(overdue)} overdue`,
        isOverdue: true,
        fine: overdue, // ₹1 per minute
      };
    }

    const remaining = Math.ceil(diff / (1000 * 60));
    return {
      text: formatDuration(remaining),
      isOverdue: false,
      fine: 0,
    };
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderActiveRental = () => {
    if (!activeRental) return null;

    const timeInfo = calculateTimeRemaining();
    const startTime = new Date(activeRental.startTime);
    const plannedEndTime = new Date(activeRental.plannedEndTime);

    return (
      <View style={styles.activeRentalCard}>
        <View style={styles.activeRentalHeader}>
          <Text style={styles.activeRentalTitle}>Current Rental</Text>
          <TouchableOpacity onPress={() => setShowRentalDetails(true)}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cycleInfo}>
          <View style={styles.cycleInfoLeft}>
            <Text style={styles.cycleNumber}>
              Cycle #{activeRental.cycle.cycleNumber}
            </Text>
            <Text style={styles.locationText}>
              {activeRental.startLocation
                ?.replace('_', ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
          <View style={styles.cycleRating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {activeRental.cycle.averageRating?.toFixed(1) || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Started:</Text>
            <Text style={styles.timeValue}>
              {startTime.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Return by:</Text>
            <Text style={styles.timeValue}>
              {plannedEndTime.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Time remaining:</Text>
            <Text
              style={[
                styles.timeValue,
                timeInfo?.isOverdue && styles.overdueText,
              ]}
            >
              {timeInfo?.text}
            </Text>
          </View>
          {timeInfo?.isOverdue && (
            <View style={styles.fineAlert}>
              <Ionicons name="warning" size={16} color="#f44336" />
              <Text style={styles.fineText}>
                Current fine: ₹{timeInfo.fine}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.navigate('StudentReturnScreen')}
        >
          <Ionicons name="arrow-back-circle" size={20} color="white" />
          <Text style={styles.returnButtonText}>Generate Return QR</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNoActiveRental = () => (
    <View style={styles.noRentalCard}>
      <Ionicons name="bicycle-outline" size={64} color="#ccc" />
      <Text style={styles.noRentalTitle}>No Active Rental</Text>
      <Text style={styles.noRentalSubtitle}>
        Scan a QR code from a guard to start renting a cycle
      </Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setShowQRScanner(true)}
      >
        <Ionicons name="qr-code-outline" size={24} color="white" />
        <Text style={styles.scanButtonText}>Scan QR to Rent</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Statistics</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.totalRentals || 0}</Text>
          <Text style={styles.statLabel}>Total Rentals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.fineValue]}>
            ₹{user?.fine || 0}
          </Text>
          <Text style={styles.statLabel}>Current Fine</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {user?.averageRating?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {user?.totalRentalTime
              ? formatDuration(user.totalRentalTime)
              : '0m'}
          </Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Processing..." />;
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
          <Text style={styles.headerSubtitle}>Ready to rent a cycle?</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Active Rental or No Rental */}
        {activeRental ? renderActiveRental() : renderNoActiveRental()}

        {/* User Statistics */}
        {renderUserStats()}
      </View>

      {/* QR Scanner Modal */}
      <Modal visible={showQRScanner} transparent animationType="slide">
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          title="Scan Rental QR Code"
          subtitle="Point camera at the QR code shown by the guard"
        />
      </Modal>

      {/* Rental Details Modal */}
      <Modal visible={showRentalDetails} transparent animationType="fade">
        <View style={styles.detailsModal}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Rental Details</Text>
              <TouchableOpacity onPress={() => setShowRentalDetails(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {activeRental && (
              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cycle Number:</Text>
                  <Text style={styles.detailValue}>
                    #{activeRental.cycle.cycleNumber}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Location:</Text>
                  <Text style={styles.detailValue}>
                    {activeRental.startLocation
                      ?.replace('_', ' ')
                      .replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Time:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(activeRental.startTime).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Planned End:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(activeRental.plannedEndTime).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>
                    {formatDuration(activeRental.duration)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rental ID:</Text>
                  <Text style={styles.detailValue}>{activeRental._id}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  activeRentalCard: {
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
  activeRentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeRentalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cycleInfoLeft: {
    flex: 1,
  },
  cycleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  cycleRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  overdueText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  fineAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  fineText: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 14,
  },
  returnButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noRentalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  noRentalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noRentalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsTitle: {
    fontSize: 18,
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
  fineValue: {
    color: '#f44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  detailsModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContent: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
});

export default StudentRentScreen;
