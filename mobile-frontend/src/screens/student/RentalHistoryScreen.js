import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getRentalHistory } from '../../services/rent.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';

const RentalHistoryScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'overdue'

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      setIsLoading(true);
      const history = await getRentalHistory();
      setRentals(history || []);
    } catch (error) {
      console.error('Rental history error:', error);
      Alert.alert('Error', 'Failed to load rental history');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRentalHistory();
  };

  const getFilteredRentals = () => {
    switch (filter) {
      case 'completed':
        return rentals.filter(
          rental => rental.actualReturnTime && !rental.isOverdue,
        );
      case 'overdue':
        return rentals.filter(rental => rental.isOverdue || rental.fine > 0);
      default:
        return rentals;
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
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

  const getStatusColor = rental => {
    if (rental.isOverdue || rental.fine > 0) return '#f44336';
    if (rental.actualReturnTime) return '#4CAF50';
    return '#ff6b35';
  };

  const getStatusText = rental => {
    if (rental.actualReturnTime) {
      if (rental.fine > 0) return 'Returned (Fine)';
      return 'Completed';
    }
    if (rental.isOverdue) return 'Overdue';
    return 'Active';
  };

  const renderRentalItem = ({ item: rental }) => (
    <View style={styles.rentalCard}>
      <View style={styles.rentalHeader}>
        <View style={styles.cycleInfo}>
          <Ionicons name="bicycle" size={20} color="#4CAF50" />
          <Text style={styles.cycleNumber}>
            Cycle {rental.cycle?.cycleNumber || 'N/A'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(rental) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(rental)}</Text>
        </View>
      </View>

      <View style={styles.rentalDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(rental.startTime)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>
            {formatTime(rental.startTime)} -{' '}
            {rental.actualReturnTime
              ? formatTime(rental.actualReturnTime)
              : formatTime(rental.expectedReturnTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="hourglass-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {rental.actualDuration
              ? formatDuration(rental.actualDuration)
              : formatDuration(rental.duration)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>
            {rental.location?.replace('_', ' ').toUpperCase() || 'N/A'}
          </Text>
        </View>

        {rental.fine > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={16} color="#f44336" />
            <Text style={[styles.detailLabel, { color: '#f44336' }]}>
              Fine:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: '#f44336', fontWeight: 'bold' },
              ]}
            >
              ₹{rental.fine}
            </Text>
          </View>
        )}

        {rental.rating && (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <RatingStars
              rating={rental.rating}
              readonly={true}
              size={16}
              style={styles.ratingStars}
            />
          </View>
        )}
      </View>

      {rental.actualReturnTime && rental.fine > 0 && (
        <TouchableOpacity
          style={styles.generateReceiptButton}
          onPress={() => handleGenerateReceipt(rental)}
        >
          <Ionicons name="document-text-outline" size={16} color="#4CAF50" />
          <Text style={styles.generateReceiptText}>Generate Receipt</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleGenerateReceipt = rental => {
    navigation.navigate('GenerateReceipt', { rental });
  };

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bicycle-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Rentals Found</Text>
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? "You haven't rented any cycles yet. Start your first ride!"
          : `No ${filter} rentals found.`}
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading rental history..." />;
  }

  const filteredRentals = getFilteredRentals();

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', `All (${rentals.length})`)}
        {renderFilterButton('completed', 'Completed')}
        {renderFilterButton('overdue', 'Overdue/Fined')}
      </View>

      {/* Summary Stats */}
      {rentals.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {user?.totalTimesRented || 0}
            </Text>
            <Text style={styles.summaryLabel}>Total Rides</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {user?.totalTimeRidden || 0}h
            </Text>
            <Text style={styles.summaryLabel}>Time Ridden</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text
              style={[
                styles.summaryNumber,
                { color: user?.fine > 0 ? '#f44336' : '#4CAF50' },
              ]}
            >
              ₹{user?.fine || 0}
            </Text>
            <Text style={styles.summaryLabel}>Total Fine</Text>
          </View>
        </View>
      )}

      {/* Rental List */}
      <FlatList
        data={filteredRentals}
        renderItem={renderRentalItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingTop: 10,
  },
  rentalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cycleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  rentalDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  ratingStars: {
    marginLeft: 5,
  },
  generateReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8fff8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  generateReceiptText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});

export default RentalHistoryScreen;
