import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import QRCode from 'react-native-qrcode-svg';

import { getCyclesByLocation } from '../../services/cycle.service';
import { searchStudents } from '../../services/user.service';
import { createRentalQR } from '../../services/qr.service';
import SearchableDropdown from '../common/SearchableDropdown';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const GuardRentingScreen = () => {
  const { user } = useSelector(state => state.auth);
  const [location, setLocation] = useState(user?.location || 'east_campus');
  const [availableCycles, setAvailableCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [qrToken, setQrToken] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrExpiry, setQrExpiry] = useState(null);
  const [countdown, setCountdown] = useState(30);

  const durationOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
    { label: '3 hours', value: 180 },
    { label: '4 hours', value: 240 },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    fetchAvailableCycles();
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Simple location detection based on coordinates
      // You can implement more sophisticated location detection here
      const detectedLocation = detectCampusLocation(latitude, longitude);
      setLocation(detectedLocation);
    } catch (error) {
      console.error('Location error:', error);
      showLocationPicker();
    }
  };

  const detectCampusLocation = (latitude, longitude) => {
    // Implement your campus location detection logic here
    // This is a placeholder implementation
    return 'east_campus';
  };

  const showLocationPicker = () => {
    Alert.alert('Select Location', 'Please select your current location', [
      { text: 'East Campus', onPress: () => setLocation('east_campus') },
      { text: 'West Campus', onPress: () => setLocation('west_campus') },
    ]);
  };

  const fetchAvailableCycles = async () => {
    try {
      setIsLoading(true);
      const cycles = await getCyclesByLocation(location);
      setAvailableCycles(cycles);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch available cycles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSearch = async query => {
    try {
      const students = await searchStudents(query);
      return students.map(student => ({
        id: student._id,
        label: `${student.rollNo} - ${student.name}`,
        value: student._id,
        student,
      }));
    } catch (error) {
      console.error('Student search error:', error);
      return [];
    }
  };

  const generateRentalQR = async () => {
    if (!selectedCycle || !selectedStudent || !duration) {
      Alert.alert(
        'Missing Information',
        'Please select cycle, student, and duration',
      );
      return;
    }

    // Check if student has exceeded fine limit
    if (selectedStudent.fine > 500) {
      Alert.alert(
        'Fine Limit Exceeded',
        `Student has a fine of ₹${selectedStudent.fine}. Cannot rent cycle.`,
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      setIsLoading(true);
      const result = await createRentalQR({
        cycleId: selectedCycle._id,
        studentId: selectedStudent._id,
        duration,
        location,
      });

      setQrToken(result.token);
      setQrExpiry(new Date(result.expiresAt));
      setCountdown(30);
      setShowQRModal(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQrToken(null);
    setQrExpiry(null);
    setSelectedCycle(null);
    setSelectedStudent(null);
    setDuration(30);
    fetchAvailableCycles(); // Refresh cycle list
  };

  if (isLoading && availableCycles.length === 0) {
    return <LoadingSpinner message="Loading available cycles..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rent Cycle to Student</Text>
        <Text style={styles.subtitle}>
          Location: {location.replace('_', ' ').toUpperCase()}
        </Text>
        <TouchableOpacity
          onPress={showLocationPicker}
          style={styles.changeLocationBtn}
        >
          <Text style={styles.changeLocationText}>Change Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Cycle Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Cycle</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCycle?._id}
              onValueChange={cycleId => {
                const cycle = availableCycles.find(c => c._id === cycleId);
                setSelectedCycle(cycle);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a cycle..." value={null} />
              {availableCycles.map(cycle => (
                <Picker.Item
                  key={cycle._id}
                  label={`Cycle ${
                    cycle.cycleNumber
                  } (Rating: ${cycle.averageRating.toFixed(1)})`}
                  value={cycle._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Duration</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={duration}
              onValueChange={setDuration}
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
        </View>

        {/* Student Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Student</Text>
          <SearchableDropdown
            placeholder="Search by roll number or name..."
            onSearch={handleStudentSearch}
            onSelect={item => setSelectedStudent(item.student)}
            selectedValue={
              selectedStudent
                ? `${selectedStudent.rollNo} - ${selectedStudent.name}`
                : ''
            }
            style={styles.searchDropdown}
          />

          {selectedStudent && (
            <View style={styles.studentInfo}>
              <Text style={styles.studentText}>
                {selectedStudent.name} (Roll: {selectedStudent.rollNo})
              </Text>
              <Text style={styles.studentDetail}>
                Fine: ₹{selectedStudent.fine} | Rentals:{' '}
                {selectedStudent.totalTimesRented}
              </Text>
              {selectedStudent.fine > 400 && (
                <Text style={styles.warningText}>
                  ⚠️ High fine amount - Close to limit!
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Generate QR Button */}
        <Button
          title="Generate Rental QR Code"
          onPress={generateRentalQR}
          disabled={!selectedCycle || !selectedStudent || isLoading}
          loading={isLoading}
          style={styles.generateButton}
        />
      </View>

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.qrModal}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>Rental QR Code</Text>
              <Text style={styles.countdown}>Expires in: {countdown}s</Text>
            </View>

            {qrToken && (
              <View style={styles.qrContainer}>
                <QRCode
                  value={JSON.stringify({
                    token: qrToken,
                    type: 'rental',
                    studentName: selectedStudent?.name,
                    cycleName: selectedCycle?.cycleNumber,
                    duration,
                  })}
                  size={250}
                />
              </View>
            )}

            <View style={styles.qrInfo}>
              <Text style={styles.qrInfoText}>
                Student: {selectedStudent?.name} ({selectedStudent?.rollNo})
              </Text>
              <Text style={styles.qrInfoText}>
                Cycle: {selectedCycle?.cycleNumber}
              </Text>
              <Text style={styles.qrInfoText}>
                Duration: {duration} minutes
              </Text>
              <Text style={styles.qrInfoText}>
                Location: {location.replace('_', ' ').toUpperCase()}
              </Text>
            </View>

            <Text style={styles.instruction}>
              Ask the student to scan this QR code with their app
            </Text>

            <Button
              title="Close"
              onPress={closeQRModal}
              variant="outline"
              style={styles.closeButton}
            />
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
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  changeLocationBtn: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  changeLocationText: {
    color: 'white',
    fontSize: 12,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  searchDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  studentInfo: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  warningText: {
    fontSize: 12,
    color: '#ff6b35',
    marginTop: 5,
    fontWeight: '600',
  },
  generateButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  countdown: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  qrInfo: {
    width: '100%',
    marginBottom: 15,
  },
  qrInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  closeButton: {
    width: '100%',
  },
});

export default GuardRentingScreen;
