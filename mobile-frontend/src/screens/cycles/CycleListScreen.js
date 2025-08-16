import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCyclesAsync } from '../../redux/slices/cycleSlice';
import { rentCycleAsync } from '../../redux/slices/rentalSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CycleListScreen = () => {
  const dispatch = useDispatch();
  const { cycles, isLoading, error } = useSelector(state => state.cycles);
  const { isLoading: rentLoading } = useSelector(state => state.rentals);

  useEffect(() => {
    dispatch(fetchCyclesAsync());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCyclesAsync());
  };

  const handleRentCycle = async cycleId => {
    try {
      await dispatch(rentCycleAsync({ cycleId })).unwrap();
      // Refresh cycles list to update availability
      dispatch(fetchCyclesAsync());
    } catch (error) {
      console.error('Failed to rent cycle:', error);
    }
  };

  const renderCycleItem = ({ item }) => (
    <View style={styles.cycleCard}>
      <View style={styles.cycleInfo}>
        <Text style={styles.cycleName}>
          Cycle #{item.cycleNumber || item._id.slice(-4)}
        </Text>
        <Text style={styles.cycleStatus}>
          Status: {item.isAvailable ? 'Available' : 'Rented'}
        </Text>
        {item.location && (
          <Text style={styles.cycleLocation}>Location: {item.location}</Text>
        )}
      </View>

      <Button
        title={item.isAvailable ? 'Rent Now' : 'Unavailable'}
        onPress={() => handleRentCycle(item._id)}
        disabled={!item.isAvailable || rentLoading}
        variant={item.isAvailable ? 'primary' : 'secondary'}
        style={styles.rentButton}
      />
    </View>
  );

  if (isLoading && cycles.length === 0) {
    return <LoadingSpinner message="Loading cycles..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Cycles</Text>
        <Text style={styles.subtitle}>Choose a cycle to rent</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={cycles}
        renderItem={renderCycleItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  cycleCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cycleStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cycleLocation: {
    fontSize: 14,
    color: '#666',
  },
  rentButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
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

export default CycleListScreen;
