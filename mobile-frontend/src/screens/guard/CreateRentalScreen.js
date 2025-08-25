import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getCyclesByLocation } from '../../services/cycle.service';
import { searchStudents } from '../../services/user.service';
import { createRentalQR } from '../../services/qr.service';
import {
  COLORS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
  getStatusStyle,
  formatTime,
} from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreateRentalScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  // State variables
  const [location, setLocation] = useState(user?.location || 'east_campus');
  const [availableCycles, setAvailableCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [duration, setDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [qrToken, setQrToken] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrExpiry, setQrExpiry] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [isCreatingRental, setIsCreatingRental] = useState(false);

  const searchTimeoutRef = useRef(null);

  const durationOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
    { label: 'Custom', value: 'custom' },
  ];

  const locationOptions = [
    { label: 'East Campus', value: 'east_campus' },
    { label: 'West Campus', value: 'west_campus' },
  ];

  useEffect(() => {
    const initializeLocation = async () => {
      await getCurrentLocation();
    };
    initializeLocation();
  }, []);

  useEffect(() => {
    const loadCycles = async () => {
      await fetchAvailableCycles();
    };
    loadCycles();
  }, [location]);

  useEffect(() => {
    if (qrExpiry) {
      const timer = setInterval(() => {
        const now = new Date();
        const timeLeft = Math.max(0, Math.floor((qrExpiry - now) / 1000));
        setCountdown(timeLeft);

        if (timeLeft === 0) {
          setShowQRModal(false);
          setQrToken(null);
          setQrExpiry(null);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [qrExpiry]);

  const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const detectedLocation = detectCampusLocation(latitude, longitude);
          setLocation(detectedLocation);
        },
        error => {
          console.log('Location error:', error);
          // Use default location
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const detectCampusLocation = (latitude, longitude) => {
    // Implement your campus location detection logic here
    // This is a placeholder implementation
    return user?.location || 'east_campus';
  };

  const fetchAvailableCycles = async () => {
    try {
      setIsLoading(true);
      const cycles = await getCyclesByLocation(location, 'available');
      setAvailableCycles(cycles || []);
    } catch (error) {
      console.error('Error fetching cycles:', error);
      Alert.alert('Error', 'Failed to fetch available cycles');
    } finally {
      setIsLoading(false);
    }
  };

  const searchStudentsDebounced = async query => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (query.length >= 3) {
        try {
          setIsSearching(true);
          const students = await searchStudents(query);
          setSearchResults(students || []);
        } catch (error) {
          console.error('Error searching students:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
  };

  const handleStudentSearch = query => {
    setStudentSearchQuery(query);
    searchStudentsDebounced(query);
  };

  const selectStudent = student => {
    setSelectedStudent(student);
    setShowStudentSearch(false);
    setStudentSearchQuery(student.rollNumber || student.name || '');
  };

  const getFinalDuration = () => {
    if (duration === 'custom') {
      return parseInt(customDuration, 10) || 30;
    }
    return duration;
  };

  const validateForm = () => {
    if (!selectedCycle) {
      Alert.alert('Error', 'Please select a cycle');
      return false;
    }
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student');
      return false;
    }
    if (
      duration === 'custom' &&
      (!customDuration || parseInt(customDuration, 10) <= 0)
    ) {
      Alert.alert('Error', 'Please enter a valid custom duration');
      return false;
    }
    return true;
  };

  const handleCreateRental = async () => {
    if (!validateForm()) return;

    try {
      setIsCreatingRental(true);
      const rentalData = {
        cycleId: selectedCycle._id,
        studentId: selectedStudent._id,
        duration: getFinalDuration(),
        location: location,
      };

      const response = await createRentalQR(rentalData);

      if (response.success) {
        setQrToken(response.qrToken);
        setQrExpiry(new Date(Date.now() + 30000)); // 30 seconds from now
        setShowQRModal(true);
        setCountdown(30);
      } else {
        Alert.alert('Error', response.message || 'Failed to create rental QR');
      }
    } catch (error) {
      console.error('Error creating rental:', error);
      Alert.alert('Error', 'Failed to create rental QR');
    } finally {
      setIsCreatingRental(false);
    }
  };

  const resetForm = () => {
    setSelectedCycle(null);
    setSelectedStudent(null);
    setDuration(30);
    setCustomDuration('');
    setShowCustomDuration(false);
    setStudentSearchQuery('');
    setSearchResults([]);
    setShowStudentSearch(false);
  };

  const renderCycleCard = cycle => {
    const statusStyle = getStatusStyle(cycle.status);

    return (
      <TouchableOpacity
        key={cycle._id}
        style={[
          styles.cycleCard,
          selectedCycle?._id === cycle._id && styles.selectedCard,
        ]}
        onPress={() => setSelectedCycle(cycle)}
      >
        <View style={styles.cycleHeader}>
          <Text style={styles.cycleNumber}>Cycle #{cycle.cycleNumber}</Text>
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={statusStyle.text}>{cycle.status}</Text>
          </View>
        </View>

        {cycle.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.ratingText}>
              {cycle.rating.toFixed(1)} ({cycle.totalRatings || 0} ratings)
            </Text>
          </View>
        )}

        <Text style={styles.cycleDetails}>
          Location:{' '}
          {cycle.currentLocation === 'east_campus'
            ? 'East Campus'
            : 'West Campus'}
        </Text>

        {cycle.batteryLevel && (
          <Text style={styles.cycleDetails}>
            Battery: {cycle.batteryLevel}%
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderStudentSearch = () => (
    <View style={styles.studentSearchContainer}>
      <Text style={styles.label}>Select Student *</Text>
      <TouchableOpacity
        style={[styles.input, styles.searchInput]}
        onPress={() => setShowStudentSearch(true)}
      >
        <Text
          style={selectedStudent ? styles.selectedText : styles.placeholderText}
        >
          {selectedStudent
            ? `${selectedStudent.name} (${selectedStudent.rollNumber})`
            : 'Search student by roll number or name...'}
        </Text>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={COMMON_STYLES.loadingContainer}>
        <LoadingSpinner />
        <Text style={COMMON_STYLES.loadingText}>
          Loading available cycles...
        </Text>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={COMMON_STYLES.header}>
          <View>
            <Text style={COMMON_STYLES.headerTitle}>Create Rental</Text>
            <Text style={COMMON_STYLES.headerSubtitle}>
              Generate QR for student rental
            </Text>
          </View>
          <TouchableOpacity onPress={resetForm} style={styles.resetButton}>
            <Ionicons name="refresh" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Location Selection */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={location}
              onValueChange={setLocation}
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
          </View>
        </View>

        {/* Available Cycles */}
        <View style={COMMON_STYLES.card}>
          <View style={[COMMON_STYLES.row, COMMON_STYLES.spaceBetween]}>
            <Text style={styles.sectionTitle}>
              Available Cycles ({availableCycles.length})
            </Text>
            <TouchableOpacity onPress={fetchAvailableCycles}>
              <Ionicons name="refresh" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {availableCycles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bicycle" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>
                No cycles available at this location
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cyclesContainer}>
                {availableCycles.map(renderCycleCard)}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Student Selection */}
        <View style={COMMON_STYLES.card}>{renderStudentSearch()}</View>

        {/* Duration Selection */}
        <View style={COMMON_STYLES.card}>
          <Text style={styles.label}>Rental Duration *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={duration}
              onValueChange={value => {
                setDuration(value);
                setShowCustomDuration(value === 'custom');
              }}
              style={styles.picker}
            >
              {durationOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          {showCustomDuration && (
            <View style={styles.customDurationContainer}>
              <TextInput
                style={styles.customDurationInput}
                placeholder="Enter duration in minutes"
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>

        {/* Summary */}
        {selectedCycle && selectedStudent && (
          <View style={COMMON_STYLES.card}>
            <Text style={styles.sectionTitle}>Rental Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cycle:</Text>
              <Text style={styles.summaryValue}>
                #{selectedCycle.cycleNumber}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Student:</Text>
              <Text style={styles.summaryValue}>
                {selectedStudent.name} ({selectedStudent.rollNumber})
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>
                {formatTime(getFinalDuration())}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>
                {location === 'east_campus' ? 'East Campus' : 'West Campus'}
              </Text>
            </View>
          </View>
        )}

        {/* Create Rental Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              COMMON_STYLES.primaryButton,
              (!selectedCycle || !selectedStudent) && styles.disabledButton,
            ]}
            onPress={handleCreateRental}
            disabled={!selectedCycle || !selectedStudent || isCreatingRental}
          >
            {isCreatingRental ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="qr-code" size={20} color={COLORS.white} />
                <Text style={COMMON_STYLES.primaryButtonText}>
                  Generate QR Code
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Student Search Modal */}
      <Modal
        visible={showStudentSearch}
        animationType="slide"
        onRequestClose={() => setShowStudentSearch(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Student</Text>
            <TouchableOpacity onPress={() => setShowStudentSearch(false)}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Enter roll number or name..."
              value={studentSearchQuery}
              onChangeText={handleStudentSearch}
              autoFocus
            />
            {isSearching && (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
          </View>

          <ScrollView style={styles.searchResults}>
            {searchResults.map(student => (
              <TouchableOpacity
                key={student._id}
                style={styles.studentItem}
                onPress={() => selectStudent(student)}
              >
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>{student.rollNumber}</Text>
                  {student.phone && (
                    <Text style={styles.studentPhone}>{student.phone}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {studentSearchQuery.length >= 3 &&
              searchResults.length === 0 &&
              !isSearching && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No students found</Text>
                </View>
              )}
          </ScrollView>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrModalContainer}>
            <Text style={styles.qrTitle}>Student Rental QR</Text>
            <Text style={styles.qrSubtitle}>
              Student must scan within {countdown}s
            </Text>

            <View style={styles.qrContainer}>
              {qrToken && (
                <QRCode
                  value={qrToken}
                  size={200}
                  backgroundColor={COLORS.white}
                  color={COLORS.dark}
                />
              )}
            </View>

            <View style={styles.qrInfo}>
              <Text style={styles.qrInfoText}>
                Student: {selectedStudent?.name}
              </Text>
              <Text style={styles.qrInfoText}>
                Cycle: #{selectedCycle?.cycleNumber}
              </Text>
              <Text style={styles.qrInfoText}>
                Duration: {formatTime(getFinalDuration())}
              </Text>
            </View>

            <View style={styles.qrButtons}>
              <TouchableOpacity
                style={COMMON_STYLES.secondaryButton}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={COMMON_STYLES.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  cyclesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  cycleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 200,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.light,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cycleDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  studentSearchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectedText: {
    color: COLORS.dark,
    fontSize: 16,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  customDurationContainer: {
    marginTop: 16,
  },
  customDurationInput: {
    ...COMMON_STYLES.input,
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  buttonContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resetButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SIZES.margin,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.dark,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  studentItem: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  studentPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  qrModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: COLORS.danger,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
    ...SHADOWS.light,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrInfoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  qrButtons: {
    width: '100%',
  },
});

export default CreateRentalScreen;
