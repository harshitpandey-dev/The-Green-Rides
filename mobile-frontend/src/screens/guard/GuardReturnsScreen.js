import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { rentService } from '../../services/rent.service';

const GuardReturnsScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const locations = [
    { label: 'All Locations', value: 'all' },
    { label: 'Main Gate', value: 'main_gate' },
    { label: 'Library', value: 'library' },
    { label: 'Hostel Area', value: 'hostel_area' },
    { label: 'Academic Block', value: 'academic_block' },
    { label: 'Cafeteria', value: 'cafeteria' },
    { label: 'Sports Complex', value: 'sports_complex' },
  ];

  useEffect(() => {
    fetchPendingReturns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pendingReturns, selectedLocation, searchQuery]);

  const fetchPendingReturns = async () => {
    try {
      setLoading(true);
      const returns = await rentService.getPendingReturns(user.location);
      setPendingReturns(returns);
    } catch (error) {
      console.error('Failed to fetch pending returns:', error);
      Alert.alert('Error', 'Failed to load pending returns');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPendingReturns();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...pendingReturns];

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(
        rental => rental.location === selectedLocation,
      );
    }

    // Filter by search query (student name, roll number, or cycle number)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        rental =>
          rental.student?.name?.toLowerCase().includes(query) ||
          rental.student?.rollNo?.toLowerCase().includes(query) ||
          rental.cycle?.cycleNumber?.toLowerCase().includes(query),
      );
    }

    // Sort by expected return time (overdue first)
    filtered.sort((a, b) => {
      const aOverdue = new Date(a.expectedReturnTime) < new Date();
      const bOverdue = new Date(b.expectedReturnTime) < new Date();

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      return new Date(a.expectedReturnTime) - new Date(b.expectedReturnTime);
    });

    setFilteredReturns(filtered);
  };

  const handleProcessReturn = async rentalId => {
    try {
      setLoading(true);
      await rentService.processReturn(rentalId);
      Alert.alert('Success', 'Cycle return processed successfully!');
      await fetchPendingReturns();
    } catch (error) {
      console.error('Return processing error:', error);
      Alert.alert('Error', error.message || 'Failed to process return');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDamaged = async (rentalId, cycleId) => {
    Alert.alert(
      'Mark as Damaged',
      'Are you sure this cycle is damaged and needs maintenance?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Damaged',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await rentService.markCycleDamaged(rentalId, cycleId);
              Alert.alert(
                'Success',
                'Cycle marked as damaged and sent for maintenance',
              );
              await fetchPendingReturns();
            } catch (error) {
              console.error('Mark damaged error:', error);
              Alert.alert('Error', 'Failed to mark cycle as damaged');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const isOverdue = expectedReturnTime => {
    return new Date(expectedReturnTime) < new Date();
  };

  const getOverdueTime = expectedReturnTime => {
    const now = new Date();
    const expected = new Date(expectedReturnTime);
    const overdueMs = now - expected;
    const overdueMinutes = Math.floor(overdueMs / (1000 * 60));

    if (overdueMinutes <= 0) return null;

    return formatDuration(overdueMinutes);
  };

  const renderReturnCard = rental => {
    const overdue = isOverdue(rental.expectedReturnTime);
    const overdueTime = getOverdueTime(rental.expectedReturnTime);

    return (
      <View
        key={rental._id}
        style={[styles.returnCard, overdue && styles.overdueCard]}
      >
        {overdue && (
          <View style={styles.overdueHeader}>
            <Ionicons name="warning" size={16} color="#ff6b35" />
            <Text style={styles.overdueText}>OVERDUE by {overdueTime}</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {rental.student?.name || 'Unknown Student'}
            </Text>
            <Text style={styles.studentRoll}>
              {rental.student?.rollNo || 'N/A'}
            </Text>
          </View>
          <View style={styles.cycleInfo}>
            <Text style={styles.cycleNumber}>
              {rental.cycle?.cycleNumber || 'N/A'}
            </Text>
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>
                {rental.location?.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rentalDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailText}>
              Started: {formatDate(rental.startTime)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="alarm"
              size={16}
              color={overdue ? '#ff6b35' : '#666'}
            />
            <Text
              style={[styles.detailText, overdue && styles.overdueDetailText]}
            >
              Due: {formatDate(rental.expectedReturnTime)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="hourglass" size={16} color="#666" />
            <Text style={styles.detailText}>
              Duration: {formatDuration(rental.duration)}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            title="Process Return"
            onPress={() => handleProcessReturn(rental._id)}
            style={styles.processButton}
            size="small"
            icon="checkmark-circle"
          />
          <Button
            title="Mark Damaged"
            onPress={() => handleMarkDamaged(rental._id, rental.cycle._id)}
            variant="outline"
            style={styles.damagedButton}
            size="small"
            icon="build"
          />
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading pending returns..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsHeader}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingReturns.length}</Text>
          <Text style={styles.statLabel}>Total Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.overdueNumber]}>
            {pendingReturns.filter(r => isOverdue(r.expectedReturnTime)).length}
          </Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, styles.onTimeNumber]}>
            {
              pendingReturns.filter(r => !isOverdue(r.expectedReturnTime))
                .length
            }
          </Text>
          <Text style={styles.statLabel}>On Time</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.locationFilter}>
            <SearchableDropdown
              data={locations}
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Filter by location"
              style={styles.dropdown}
            />
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Returns List */}
      <ScrollView
        style={styles.returnsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredReturns.length > 0 ? (
          <>
            {filteredReturns.map(renderReturnCard)}
            <View style={styles.listFooter}>
              <Text style={styles.footerText}>
                {filteredReturns.length} of {pendingReturns.length} returns
                shown
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Pending Returns</Text>
            <Text style={styles.emptyMessage}>
              {pendingReturns.length > 0
                ? 'No returns match your current filters'
                : 'All cycles have been returned! Great job!'}
            </Text>
            {pendingReturns.length > 0 && (
              <Button
                title="Clear Filters"
                onPress={() => {
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                variant="outline"
                style={styles.clearFiltersButton}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  overdueNumber: {
    color: '#ff6b35',
  },
  onTimeNumber: {
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationFilter: {
    flex: 1,
    marginRight: 10,
  },
  dropdown: {
    backgroundColor: '#f8f9fa',
  },
  refreshButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  returnsList: {
    flex: 1,
    padding: 15,
  },
  returnCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  overdueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    marginHorizontal: -15,
    marginTop: -15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginLeft: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: 14,
    color: '#666',
  },
  cycleInfo: {
    alignItems: 'flex-end',
  },
  cycleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  locationBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  rentalDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  overdueDetailText: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  processButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50',
  },
  damagedButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#ff9800',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  clearFiltersButton: {
    marginTop: 20,
    borderColor: '#4CAF50',
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default GuardReturnsScreen;
