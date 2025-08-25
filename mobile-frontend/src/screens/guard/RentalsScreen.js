import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  getActiveRentals,
  getRentalHistory,
} from '../../services/rent.service';
import {
  COLORS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
  getStatusStyle,
  formatTime,
  formatCurrency,
} from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RentalsScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('active');
  const [activeRentals, setActiveRentals] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRental, setSelectedRental] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadRentals();

    // Refresh every 30 seconds for active rentals
    const interval = setInterval(() => {
      if (activeTab === 'active') {
        loadActiveRentals();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const loadRentals = async () => {
    if (activeTab === 'active') {
      await loadActiveRentals();
    } else {
      await loadRentalHistory();
    }
  };

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

  const loadRentalHistory = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const history = await getRentalHistory({
        location: user?.location,
        guardId: user?.id,
        limit: 100,
      });
      setRentalHistory(history || []);
    } catch (error) {
      console.error('Error loading rental history:', error);
      Alert.alert('Error', 'Failed to load rental history');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRentals();
  };

  const calculateOvertime = (startTime, duration, endTime) => {
    const start = new Date(startTime);
    const expectedEndTime = new Date(start.getTime() + duration * 60000);
    const actualEndTime = endTime ? new Date(endTime) : new Date();

    if (actualEndTime > expectedEndTime) {
      return Math.floor((actualEndTime - expectedEndTime) / 60000);
    }
    return 0;
  };

  const calculateRemainingTime = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + duration * 60000);

    if (now < endTime) {
      return Math.floor((endTime - now) / 60000);
    }
    return 0;
  };

  const filterRentals = rentals => {
    if (!searchQuery.trim()) return rentals;

    const query = searchQuery.toLowerCase();
    return rentals.filter(
      rental =>
        rental.student?.name?.toLowerCase().includes(query) ||
        rental.student?.rollNumber?.toLowerCase().includes(query) ||
        rental.cycle?.cycleNumber?.toString().includes(query),
    );
  };

  const openRentalDetails = rental => {
    setSelectedRental(rental);
    setShowDetailsModal(true);
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
      <TouchableOpacity
        key={rental._id}
        style={[styles.rentalCard, isOverdue && styles.overdueCard]}
        onPress={() => openRentalDetails(rental)}
      >
        <View style={styles.rentalHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {rental.student?.name || 'Unknown Student'}
            </Text>
            <Text style={styles.rollNumber}>{rental.student?.rollNumber}</Text>
            {rental.student?.phone && (
              <Text style={styles.phoneNumber}>{rental.student.phone}</Text>
            )}
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

        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <Ionicons
              name="play-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.timeLabel}>Started:</Text>
            <Text style={styles.timeValue}>
              {new Date(rental.startTime).toLocaleString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <Ionicons
              name="hourglass-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.timeLabel}>Duration:</Text>
            <Text style={styles.timeValue}>{formatTime(rental.duration)}</Text>
          </View>

          {isOverdue ? (
            <View style={styles.timeRow}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={COLORS.danger}
              />
              <Text style={[styles.timeLabel, styles.dangerText]}>
                Overdue:
              </Text>
              <Text style={[styles.timeValue, styles.dangerTextBold]}>
                {formatTime(overtimeMinutes)}
              </Text>
            </View>
          ) : (
            <View style={styles.timeRow}>
              <Ionicons name="timer-outline" size={16} color={COLORS.success} />
              <Text style={[styles.timeLabel, styles.successText]}>
                Remaining:
              </Text>
              <Text style={[styles.timeValue, styles.successTextBold]}>
                {formatTime(remainingMinutes)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHistoryRental = rental => {
    const overtimeMinutes = calculateOvertime(
      rental.startTime,
      rental.duration,
      rental.endTime,
    );
    const actualDuration =
      rental.actualDuration || rental.duration + overtimeMinutes;
    const statusStyle = getStatusStyle(rental.status);

    return (
      <TouchableOpacity
        key={rental._id}
        style={styles.rentalCard}
        onPress={() => openRentalDetails(rental)}
      >
        <View style={styles.rentalHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {rental.student?.name || 'Unknown Student'}
            </Text>
            <Text style={styles.rollNumber}>{rental.student?.rollNumber}</Text>
          </View>
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleNumber}>#{rental.cycle?.cycleNumber}</Text>
            <View style={[styles.statusBadge, statusStyle.badge]}>
              <Text style={statusStyle.text}>{rental.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(rental.startTime).toLocaleDateString('en-IN')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{formatTime(actualDuration)}</Text>
          </View>

          {rental.fine > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, styles.dangerText]}>Fine:</Text>
              <Text style={[styles.detailValue, styles.dangerTextBold]}>
                {formatCurrency(rental.fine)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailsModal = () => {
    if (!selectedRental) return null;

    const isActive = activeTab === 'active';
    const overtimeMinutes = isActive
      ? calculateOvertime(selectedRental.startTime, selectedRental.duration)
      : calculateOvertime(
          selectedRental.startTime,
          selectedRental.duration,
          selectedRental.endTime,
        );
    const remainingMinutes = isActive
      ? calculateRemainingTime(
          selectedRental.startTime,
          selectedRental.duration,
        )
      : 0;

    return (
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rental Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Student Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental.student?.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Roll Number:</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental.student?.rollNumber}
                  </Text>
                </View>
                {selectedRental.student?.phone && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>
                      {selectedRental.student.phone}
                    </Text>
                  </View>
                )}
                {selectedRental.student?.email && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>
                      {selectedRental.student.email}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Cycle Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cycle Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cycle Number:</Text>
                  <Text style={styles.infoValue}>
                    #{selectedRental.cycle?.cycleNumber}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>
                    {selectedRental.location === 'east_campus'
                      ? 'East Campus'
                      : 'West Campus'}
                  </Text>
                </View>
                {selectedRental.cycle?.batteryLevel && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Battery Level:</Text>
                    <Text style={styles.infoValue}>
                      {selectedRental.cycle.batteryLevel}%
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Rental Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rental Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Start Time:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(selectedRental.startTime).toLocaleString('en-IN')}
                  </Text>
                </View>
                {selectedRental.endTime && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>End Time:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(selectedRental.endTime).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Allocated Duration:</Text>
                  <Text style={styles.infoValue}>
                    {formatTime(selectedRental.duration)}
                  </Text>
                </View>

                {isActive ? (
                  remainingMinutes > 0 ? (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, styles.successText]}>
                        Remaining Time:
                      </Text>
                      <Text style={[styles.infoValue, styles.successTextBold]}>
                        {formatTime(remainingMinutes)}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, styles.dangerText]}>
                        Overdue By:
                      </Text>
                      <Text style={[styles.infoValue, styles.dangerTextBold]}>
                        {formatTime(overtimeMinutes)}
                      </Text>
                    </View>
                  )
                ) : (
                  selectedRental.actualDuration && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Actual Duration:</Text>
                      <Text style={styles.infoValue}>
                        {formatTime(selectedRental.actualDuration)}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>

            {/* Fine Information */}
            {(selectedRental.fine > 0 || overtimeMinutes > 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fine Information</Text>
                <View style={[styles.infoCard, styles.fineCard]}>
                  {overtimeMinutes > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Overtime:</Text>
                      <Text style={styles.infoValue}>
                        {formatTime(overtimeMinutes)}
                      </Text>
                    </View>
                  )}
                  {selectedRental.fine > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, styles.dangerText]}>
                        Fine Amount:
                      </Text>
                      <Text style={[styles.infoValue, styles.dangerTextBold]}>
                        {formatCurrency(selectedRental.fine)}
                      </Text>
                    </View>
                  )}
                  {isActive && overtimeMinutes > 0 && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, styles.warningText]}>
                        Estimated Fine:
                      </Text>
                      <Text style={[styles.infoValue, styles.warningTextBold]}>
                        {formatCurrency(overtimeMinutes * 1)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderTabButton = (tabKey, label, count) => (
    <TouchableOpacity
      key={tabKey}
      style={[styles.tabButton, activeTab === tabKey && styles.activeTab]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[styles.tabText, activeTab === tabKey && styles.activeTabText]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.countBadge,
          activeTab === tabKey && styles.activeCountBadge,
        ]}
      >
        <Text
          style={[
            styles.countText,
            activeTab === tabKey && styles.activeCountText,
          ]}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const currentData = activeTab === 'active' ? activeRentals : rentalHistory;
  const filteredData = filterRentals(currentData);

  if (isLoading && !refreshing) {
    return (
      <View style={COMMON_STYLES.loadingContainer}>
        <LoadingSpinner />
        <Text style={COMMON_STYLES.loadingText}>Loading rentals...</Text>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      {/* Header */}
      <View style={COMMON_STYLES.header}>
        <View>
          <Text style={COMMON_STYLES.headerTitle}>Rentals</Text>
          <Text style={COMMON_STYLES.headerSubtitle}>
            Manage and track rentals
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

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('active', 'Active', activeRentals.length)}
        {renderTabButton('history', 'History', rentalHistory.length)}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name, roll number, or cycle..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Rentals List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={activeTab === 'active' ? 'bicycle' : 'time'}
              size={64}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'No Active Rentals'
                : 'No Rental History'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active'
                ? 'All cycles have been returned at your location'
                : 'No completed rentals found'}
            </Text>
          </View>
        ) : (
          filteredData.map(
            activeTab === 'active' ? renderActiveRental : renderHistoryRental,
          )
        )}
      </ScrollView>

      {/* Details Modal */}
      {renderDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin / 2,
    borderRadius: 12,
    padding: 4,
    ...SHADOWS.light,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  activeTabText: {
    color: COLORS.white,
  },
  countBadge: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: COLORS.white,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeCountText: {
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin / 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.dark,
  },
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
  studentInfo: {
    flex: 1,
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
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    alignItems: 'center',
  },
  overdueStatus: {
    backgroundColor: COLORS.danger,
  },
  overdueText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  timeInfo: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  timeValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
  },
  historyDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
    textAlign: 'right',
  },
  dangerText: {
    color: COLORS.danger,
  },
  dangerTextBold: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  successText: {
    color: COLORS.success,
  },
  successTextBold: {
    color: COLORS.success,
    fontWeight: '600',
  },
  warningText: {
    color: COLORS.warning,
  },
  warningTextBold: {
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
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
  },
  modalContent: {
    flex: 1,
    padding: SIZES.padding,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.light,
  },
  fineCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    textAlign: 'right',
    flex: 1,
  },
});

export default RentalsScreen;
