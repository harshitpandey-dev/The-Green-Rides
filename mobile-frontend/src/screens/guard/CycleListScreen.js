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
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  getCyclesByLocation,
  updateCycleStatus,
  updateCycleLocation,
} from '../../services/cycle.service';
import {
  COLORS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
  getStatusStyle,
} from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CycleListScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [cycles, setCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { label: 'All Cycles', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Rented', value: 'rented' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Out of Service', value: 'disabled' },
  ];

  const locationOptions = [
    { label: 'East Campus', value: 'east_campus' },
    { label: 'West Campus', value: 'west_campus' },
  ];

  const maintenanceStatuses = [
    { label: 'Under Maintenance', value: 'maintenance' },
    { label: 'Out of Service', value: 'disabled' },
    { label: 'Available', value: 'available' },
  ];

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const allCycles = await getCyclesByLocation(user?.location || 'all');
      setCycles(allCycles || []);
    } catch (error) {
      console.error('Error loading cycles:', error);
      Alert.alert('Error', 'Failed to load cycles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCycles();
  };

  const filterCycles = cyclesList => {
    let filtered = cyclesList;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cycle => cycle.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        cycle =>
          cycle.cycleNumber?.toString().includes(query) ||
          cycle.model?.toLowerCase().includes(query) ||
          cycle.currentLocation?.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const openCycleDetails = cycle => {
    setSelectedCycle(cycle);
    setShowDetailsModal(true);
  };

  const openActionModal = (cycle, action) => {
    setSelectedCycle(cycle);
    setActionType(action);

    if (action === 'status') {
      setNewStatus(cycle.status);
    } else if (action === 'location') {
      setNewLocation(cycle.currentLocation);
    }

    setShowActionModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedCycle || !newStatus) return;

    try {
      setIsUpdating(true);
      await updateCycleStatus(selectedCycle._id, newStatus);

      // Update local state
      setCycles(prevCycles =>
        prevCycles.map(cycle =>
          cycle._id === selectedCycle._id
            ? { ...cycle, status: newStatus }
            : cycle,
        ),
      );

      setShowActionModal(false);
      Alert.alert('Success', `Cycle status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating cycle status:', error);
      Alert.alert('Error', 'Failed to update cycle status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (!selectedCycle || !newLocation) return;

    try {
      setIsUpdating(true);
      await updateCycleLocation(selectedCycle._id, newLocation);

      // Update local state
      setCycles(prevCycles =>
        prevCycles.map(cycle =>
          cycle._id === selectedCycle._id
            ? { ...cycle, currentLocation: newLocation }
            : cycle,
        ),
      );

      setShowActionModal(false);
      Alert.alert('Success', 'Cycle location updated successfully');
    } catch (error) {
      console.error('Error updating cycle location:', error);
      Alert.alert('Error', 'Failed to update cycle location');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCycleCard = cycle => {
    const statusStyle = getStatusStyle(cycle.status);
    const isRented = cycle.status === 'rented';

    return (
      <TouchableOpacity
        key={cycle._id}
        style={[styles.cycleCard, isRented && styles.rentedCard]}
        onPress={() => openCycleDetails(cycle)}
      >
        <View style={styles.cycleHeader}>
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleNumber}>Cycle #{cycle.cycleNumber}</Text>
            {cycle.model && (
              <Text style={styles.cycleModel}>{cycle.model}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={statusStyle.text}>{cycle.status}</Text>
          </View>
        </View>

        <View style={styles.cycleDetails}>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>
              {cycle.currentLocation === 'east_campus'
                ? 'East Campus'
                : 'West Campus'}
            </Text>
          </View>

          {cycle.batteryLevel && (
            <View style={styles.detailRow}>
              <Ionicons
                name="battery-full-outline"
                size={16}
                color={cycle.batteryLevel > 20 ? COLORS.success : COLORS.danger}
              />
              <Text style={styles.detailLabel}>Battery:</Text>
              <Text
                style={[
                  styles.detailValue,
                  cycle.batteryLevel <= 20 && styles.dangerText,
                ]}
              >
                {cycle.batteryLevel}%
              </Text>
            </View>
          )}

          {cycle.rating && (
            <View style={styles.detailRow}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.detailLabel}>Rating:</Text>
              <Text style={styles.detailValue}>
                {cycle.rating.toFixed(1)} ({cycle.totalRatings || 0} reviews)
              </Text>
            </View>
          )}

          {cycle.lastMaintenance && (
            <View style={styles.detailRow}>
              <Ionicons name="build-outline" size={16} color={COLORS.info} />
              <Text style={styles.detailLabel}>Last Service:</Text>
              <Text style={styles.detailValue}>
                {new Date(cycle.lastMaintenance).toLocaleDateString('en-IN')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.statusButton]}
            onPress={() => openActionModal(cycle, 'status')}
            disabled={isRented}
          >
            <Ionicons name="settings-outline" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.locationButton]}
            onPress={() => openActionModal(cycle, 'location')}
            disabled={isRented}
          >
            <Ionicons name="location-outline" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Location</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailsModal = () => {
    if (!selectedCycle) return null;

    return (
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cycle Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cycle Number:</Text>
                  <Text style={styles.infoValue}>
                    #{selectedCycle.cycleNumber}
                  </Text>
                </View>
                {selectedCycle.model && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Model:</Text>
                    <Text style={styles.infoValue}>{selectedCycle.model}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text style={styles.infoValue}>{selectedCycle.status}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>
                    {selectedCycle.currentLocation === 'east_campus'
                      ? 'East Campus'
                      : 'West Campus'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Technical Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Details</Text>
              <View style={styles.infoCard}>
                {selectedCycle.batteryLevel && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Battery Level:</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        selectedCycle.batteryLevel <= 20 && styles.dangerText,
                      ]}
                    >
                      {selectedCycle.batteryLevel}%
                    </Text>
                  </View>
                )}
                {selectedCycle.lastMaintenance && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Last Maintenance:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(
                        selectedCycle.lastMaintenance,
                      ).toLocaleDateString('en-IN')}
                    </Text>
                  </View>
                )}
                {selectedCycle.totalDistance && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Distance:</Text>
                    <Text style={styles.infoValue}>
                      {selectedCycle.totalDistance} km
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Rating & Reviews */}
            {(selectedCycle.rating || selectedCycle.totalRatings) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rating & Reviews</Text>
                <View style={styles.infoCard}>
                  {selectedCycle.rating && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Average Rating:</Text>
                      <Text style={styles.infoValue}>
                        {selectedCycle.rating.toFixed(1)} ⭐
                      </Text>
                    </View>
                  )}
                  {selectedCycle.totalRatings && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Total Reviews:</Text>
                      <Text style={styles.infoValue}>
                        {selectedCycle.totalRatings}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Usage Statistics */}
            {selectedCycle.totalRentals && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Usage Statistics</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Rentals:</Text>
                    <Text style={styles.infoValue}>
                      {selectedCycle.totalRentals}
                    </Text>
                  </View>
                  {selectedCycle.totalHours && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Total Hours:</Text>
                      <Text style={styles.infoValue}>
                        {selectedCycle.totalHours}h
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

  const renderActionModal = () => (
    <Modal
      visible={showActionModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowActionModal(false)}
    >
      <View style={styles.actionModalOverlay}>
        <View style={styles.actionModalContainer}>
          <Text style={styles.actionModalTitle}>
            Update Cycle {actionType === 'status' ? 'Status' : 'Location'}
          </Text>

          {selectedCycle && (
            <Text style={styles.actionModalSubtitle}>
              Cycle #{selectedCycle.cycleNumber}
            </Text>
          )}

          <View style={styles.pickerContainer}>
            {actionType === 'status' ? (
              <Picker
                selectedValue={newStatus}
                onValueChange={setNewStatus}
                style={styles.picker}
              >
                {maintenanceStatuses.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            ) : (
              <Picker
                selectedValue={newLocation}
                onValueChange={setNewLocation}
                style={styles.picker}
              >
                {locationOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            )}
          </View>

          <View style={styles.actionModalButtons}>
            <TouchableOpacity
              style={COMMON_STYLES.secondaryButton}
              onPress={() => setShowActionModal(false)}
              disabled={isUpdating}
            >
              <Text style={COMMON_STYLES.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[COMMON_STYLES.primaryButton, { flex: 1, marginLeft: 12 }]}
              onPress={
                actionType === 'status'
                  ? handleStatusUpdate
                  : handleLocationUpdate
              }
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={COMMON_STYLES.primaryButtonText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const filteredCycles = filterCycles(cycles);

  if (isLoading && !refreshing) {
    return (
      <View style={COMMON_STYLES.loadingContainer}>
        <LoadingSpinner />
        <Text style={COMMON_STYLES.loadingText}>Loading cycles...</Text>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      {/* Header */}
      <View style={COMMON_STYLES.header}>
        <View>
          <Text style={COMMON_STYLES.headerTitle}>Cycles</Text>
          <Text style={COMMON_STYLES.headerSubtitle}>
            {filteredCycles.length} cycle
            {filteredCycles.length !== 1 ? 's' : ''} at your location
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

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cycles..."
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

        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={setStatusFilter}
            style={styles.filterPicker}
          >
            {statusOptions.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.totalStat]}>
          <Text style={styles.statNumber}>{cycles.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.availableStat]}>
          <Text style={styles.statNumber}>
            {cycles.filter(c => c.status === 'available').length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={[styles.statCard, styles.rentedStat]}>
          <Text style={styles.statNumber}>
            {cycles.filter(c => c.status === 'rented').length}
          </Text>
          <Text style={styles.statLabel}>Rented</Text>
        </View>
        <View style={[styles.statCard, styles.maintenanceStat]}>
          <Text style={styles.statNumber}>
            {
              cycles.filter(
                c => c.status === 'maintenance' || c.status === 'disabled',
              ).length
            }
          </Text>
          <Text style={styles.statLabel}>Maintenance</Text>
        </View>
      </View>

      {/* Cycles List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCycles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bicycle" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No Cycles Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No cycles available at your location'}
            </Text>
          </View>
        ) : (
          filteredCycles.map(renderCycleCard)
        )}
      </ScrollView>

      {/* Modals */}
      {renderDetailsModal()}
      {renderActionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.dark,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterPicker: {
    height: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
    ...SHADOWS.light,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
  },
  totalStat: {
    marginLeft: 0,
  },
  availableStat: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  rentedStat: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  maintenanceStat: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    marginRight: 0,
  },
  cycleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: SIZES.margin,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  rentedCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  cycleModel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  cycleDetails: {
    marginBottom: 16,
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
  dangerText: {
    color: COLORS.danger,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: COLORS.info,
  },
  locationButton: {
    backgroundColor: COLORS.secondary,
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
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  actionModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  actionModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  actionModalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    marginBottom: 24,
  },
  picker: {
    height: 50,
  },
  actionModalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CycleListScreen;
