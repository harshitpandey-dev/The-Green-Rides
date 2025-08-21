import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Vibration,
  BackHandler,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { processRentalQR, processReturnQR } from '../../services/qr.service';
import { getUserProfile } from '../../services/user.service';
import { updateUserProfile } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentQRScanner = ({ navigation, route }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [torchMode, setTorchMode] = useState(Camera.Constants.FlashMode.off);

  const scanType = route?.params?.type || 'rental'; // 'rental' or 'return'

  useEffect(() => {
    getCameraPermissions();

    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    Vibration.vibrate(100);

    try {
      const qrData = JSON.parse(data);

      if (qrData.type === 'rental' && scanType === 'rental') {
        await handleRentalQR(qrData);
      } else if (qrData.type === 'return' && scanType === 'return') {
        await handleReturnQR(qrData);
      } else {
        throw new Error('Invalid QR code type');
      }
    } catch (error) {
      console.error('QR scan error:', error);
      Alert.alert(
        'Invalid QR Code',
        error.message || 'This QR code is not valid or has expired.',
        [{ text: 'Try Again', onPress: () => setScanned(false) }],
      );
    }
  };

  const handleRentalQR = async qrData => {
    try {
      setIsLoading(true);

      // Check if user has exceeded fine limit
      if (user.fine > 500) {
        throw new Error(
          `You have a fine of ₹${user.fine}. Please pay to continue renting.`,
        );
      }

      const result = await processRentalQR(qrData.token);

      setScanResult({
        type: 'rental',
        cycle: result.rental.cycle,
        duration: result.rental.duration,
        expectedReturnTime: new Date(result.rental.expectedReturnTime),
        rentalId: result.rental._id,
      });

      // Update user profile to reflect new rental
      const updatedProfile = await getUserProfile();
      dispatch(updateUserProfile(updatedProfile));

      setShowSuccessModal(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnQR = async qrData => {
    try {
      setIsLoading(true);

      const result = await processReturnQR(qrData.token);

      setScanResult({
        type: 'return',
        cycle: result.cycle,
        totalTime: result.totalTime,
        fine: result.fine,
        rating: null,
        rentalId: result.rental._id,
      });

      // Update user profile to reflect return
      const updatedProfile = await getUserProfile();
      dispatch(updateUserProfile(updatedProfile));

      setShowSuccessModal(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTorch = () => {
    setTorchMode(
      torchMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off,
    );
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setScanResult(null);

    // Navigate based on scan result
    if (scanResult?.type === 'rental') {
      navigation.navigate('ActiveRental', { rentalId: scanResult.rentalId });
    } else {
      navigation.navigate('RentalHistory');
    }
  };

  const formatTime = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = date => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-off" size={64} color="#ccc" />
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.errorSubText}>
          Please enable camera permission in settings to scan QR codes
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner
        message={
          scanType === 'rental'
            ? 'Processing rental...'
            : 'Processing return...'
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={torchMode}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {scanType === 'rental'
                ? 'Scan to Rent Cycle'
                : 'Scan to Return Cycle'}
            </Text>

            <TouchableOpacity style={styles.torchBtn} onPress={toggleTorch}>
              <Ionicons
                name={
                  torchMode === Camera.Constants.FlashMode.torch
                    ? 'flashlight'
                    : 'flashlight-outline'
                }
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              {scanType === 'rental'
                ? 'Point your camera at the rental QR code shown by the guard'
                : 'Point your camera at the return QR code on the cycle stand'}
            </Text>

            {scanned && (
              <Button
                title="Scan Again"
                onPress={() => setScanned(false)}
                variant="outline"
                style={styles.scanAgainBtn}
              />
            )}
          </View>
        </View>
      </Camera>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Ionicons
              name="checkmark-circle"
              size={64}
              color="#4CAF50"
              style={styles.successIcon}
            />

            <Text style={styles.successTitle}>
              {scanResult?.type === 'rental'
                ? 'Cycle Rented Successfully!'
                : 'Cycle Returned Successfully!'}
            </Text>

            {scanResult?.type === 'rental' ? (
              <View style={styles.rentalDetails}>
                <Text style={styles.detailText}>
                  Cycle: {scanResult.cycle?.cycleNumber}
                </Text>
                <Text style={styles.detailText}>
                  Duration: {formatTime(scanResult.duration)}
                </Text>
                <Text style={styles.detailText}>
                  Return by: {formatDateTime(scanResult.expectedReturnTime)}
                </Text>
                <Text style={styles.warningText}>
                  ⏰ Late return will result in fines!
                </Text>
              </View>
            ) : (
              <View style={styles.returnDetails}>
                <Text style={styles.detailText}>
                  Cycle: {scanResult?.cycle?.cycleNumber}
                </Text>
                <Text style={styles.detailText}>
                  Total Time: {formatTime(scanResult?.totalTime || 0)}
                </Text>
                {scanResult?.fine > 0 && (
                  <Text style={styles.fineText}>
                    Fine Applied: ₹{scanResult.fine}
                  </Text>
                )}
                <Text style={styles.successText}>
                  Thank you for returning on time! 🎉
                </Text>
              </View>
            )}

            <Button
              title="Continue"
              onPress={closeSuccessModal}
              style={styles.continueBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  torchBtn: {
    padding: 10,
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4CAF50',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructions: {
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scanAgainBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'white',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  rentalDetails: {
    width: '100%',
    marginBottom: 25,
  },
  returnDetails: {
    width: '100%',
    marginBottom: 25,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#ff6b35',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  fineText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  successText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#4CAF50',
  },
});

export default StudentQRScanner;
