import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Button from '../common/Button';

const QRScannerModal = ({ visible, onClose, onScan }) => {
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);

    // Extract cycle ID from QR code data
    // Assuming QR code contains cycle ID or a URL with cycle ID
    let cycleId = data;

    // If it's a URL, extract the cycle ID
    if (data.includes('cycle/')) {
      cycleId = data.split('cycle/')[1];
    } else if (data.includes('cycleId=')) {
      cycleId = data.split('cycleId=')[1];
    }

    onScan(cycleId);
  };

  const renderCamera = () => (
    <RNCamera
      style={styles.camera}
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.auto}
      onBarCodeRead={handleBarCodeScanned}
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      captureAudio={false}
    >
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}>
          <View style={styles.topOverlay} />
          <View style={styles.middleContainer}>
            <View style={styles.leftOverlay} />
            <View style={styles.focusedContainer}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>
                Align the QR code within the frame
              </Text>
            </View>
            <View style={styles.rightOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
      </View>
    </RNCamera>
  );

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan QR Code</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>{renderCamera()}</View>

        <View style={styles.footer}>
          <Text style={styles.instruction}>
            Point your camera at the QR code on the cycle to return it
          </Text>

          <Button
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
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
    fontSize: 20,
    color: '#666',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  unfocusedContainer: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
  },
  leftOverlay: {
    flex: 1,
  },
  rightOverlay: {
    flex: 1,
  },
  focusedContainer: {
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  bottomOverlay: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    marginTop: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    width: '80%',
  },
});

export default QRScannerModal;
