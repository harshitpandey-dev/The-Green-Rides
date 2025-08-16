import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { addCycle } from '../../services/cycle.service';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import QRScannerModal from '../QrScanner/QRScannerModal';

const AddCycleModal = ({ visible, onClose, onSuccess }) => {
  const [cycleId, setCycleId] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQRScanned = data => {
    setCycleId(data);
    setScanComplete(true);
    setShowScanner(false);
  };

  const handleSubmit = async () => {
    if (!cycleId.trim()) {
      Alert.alert('Error', 'Please scan a cycle QR code first');
      return;
    }

    setIsLoading(true);
    try {
      await addCycle({ cycleId: cycleId.trim() });
      Alert.alert('Success', 'Cycle added successfully!');
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add cycle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCycleId('');
    setScanComplete(false);
    setShowScanner(false);
    onClose();
  };

  const startScanning = () => {
    setShowScanner(true);
  };

  if (isLoading) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <LoadingSpinner message="Adding cycle..." />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New Cycle</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {!scanComplete ? (
                <View style={styles.scanSection}>
                  <Text style={styles.instruction}>
                    Scan the QR code on the cycle to add it to the system
                  </Text>
                  <Button
                    title="Scan QR Code"
                    onPress={startScanning}
                    style={styles.scanButton}
                  />
                </View>
              ) : (
                <View style={styles.resultSection}>
                  <Text style={styles.successText}>
                    QR Code Scanned Successfully!
                  </Text>
                  <Text style={styles.cycleId}>Cycle ID: {cycleId}</Text>
                  <View style={styles.actions}>
                    <Button
                      title="Add Cycle"
                      onPress={handleSubmit}
                      style={styles.submitButton}
                    />
                    <Button
                      title="Scan Again"
                      onPress={() => {
                        setCycleId('');
                        setScanComplete(false);
                        startScanning();
                      }}
                      variant="outline"
                      style={styles.rescanButton}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <QRScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScanned}
        title="Scan Cycle QR Code"
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scanSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  scanButton: {
    paddingHorizontal: 40,
  },
  resultSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cycleId: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  submitButton: {
    flex: 1,
  },
  rescanButton: {
    flex: 1,
  },
});

export default AddCycleModal;
