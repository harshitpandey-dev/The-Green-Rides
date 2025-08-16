import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRentalsAsync,
  returnCycleAsync,
} from '../../redux/slices/rentalSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QRScannerModal from '../../components/QrScanner/QRScannerModal';

const RentScreen = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const dispatch = useDispatch();
  const { rentals, isLoading, error } = useSelector(state => state.rentals);

  useEffect(() => {
    dispatch(fetchRentalsAsync());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRentalsAsync());
  };

  const handleReturnCycle = async cycleId => {
    Alert.alert('Return Cycle', 'Are you sure you want to return this cycle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Return',
        onPress: async () => {
          try {
            await dispatch(returnCycleAsync({ cycleId })).unwrap();
            Alert.alert('Success', 'Cycle returned successfully!');
            dispatch(fetchRentalsAsync());
          } catch (error) {
            Alert.alert('Error', error);
          }
        },
      },
    ]);
  };

  const handleQRScan = cycleId => {
    setShowQRScanner(false);
    handleReturnCycle(cycleId);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffInMinutes = Math.floor((end - start) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const renderRentalItem = ({ item }) => {
    const isActive = !item.returnedAt;

    return (
      <View style={[styles.rentalCard, isActive && styles.activeRentalCard]}>
        <View style={styles.rentalHeader}>
          <Text style={styles.cycleName}>
            Cycle #
            {item.cycleId?.cycleNumber || item.cycleId?._id?.slice(-4) || 'N/A'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.activeBadge : styles.completedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isActive ? styles.activeStatusText : styles.completedStatusText,
              ]}
            >
              {isActive ? 'Active' : 'Completed'}
            </Text>
          </View>
        </View>

        <View style={styles.rentalDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rented:</Text>
            <Text style={styles.detailValue}>{formatDate(item.rentedAt)}</Text>
          </View>

          {item.returnedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Returned:</Text>
              <Text style={styles.detailValue}>
                {formatDate(item.returnedAt)}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>
              {calculateDuration(item.rentedAt, item.returnedAt)}
            </Text>
          </View>

          {item.totalCost && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cost:</Text>
              <Text style={styles.detailValue}>₹{item.totalCost}</Text>
            </View>
          )}
        </View>

        {isActive && (
          <View style={styles.actions}>
            <Button
              title="Scan QR to Return"
              onPress={() => setShowQRScanner(true)}
              variant="secondary"
              style={styles.qrButton}
            />
            <Button
              title="Return Cycle"
              onPress={() => handleReturnCycle(item.cycleId?._id)}
              variant="danger"
              style={styles.returnButton}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No rental history found</Text>
      <Text style={styles.emptySubtext}>
        Start by renting a cycle from the Cycles tab
      </Text>
    </View>
  );

  if (isLoading && rentals?.length === 0) {
    return <LoadingSpinner message="Loading your rentals..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rentals</Text>
        <Text style={styles.subtitle}>Track your cycle rentals</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={rentals}
        renderItem={renderRentalItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={[
          styles.listContainer,
          rentals?.length === 0 && styles.centerContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  rentalCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeRentalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  completedBadge: {
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#4CAF50',
  },
  completedStatusText: {
    color: '#666',
  },
  rentalDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  qrButton: {
    flex: 1,
    paddingVertical: 8,
  },
  returnButton: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
});

export default RentScreen;
