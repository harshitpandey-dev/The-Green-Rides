import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import AddGuardModal from './AddGuardModal';
import AddStudentModal from './AddStudentModal';

const AddUserModal = ({ visible, onClose, onSuccess }) => {
  const [showAddGuard, setShowAddGuard] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  const handleClose = () => {
    setShowAddGuard(false);
    setShowAddStudent(false);
    onClose();
  };

  const handleSuccess = () => {
    setShowAddGuard(false);
    setShowAddStudent(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New User</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.subtitle}>Select user type to add:</Text>

              <View style={styles.options}>
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => setShowAddStudent(true)}
                >
                  <Text style={styles.optionIcon}>👨‍🎓</Text>
                  <Text style={styles.optionTitle}>Student</Text>
                  <Text style={styles.optionDescription}>
                    Add a new student who can rent cycles
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => setShowAddGuard(true)}
                >
                  <Text style={styles.optionIcon}>👮‍♂️</Text>
                  <Text style={styles.optionTitle}>Guard</Text>
                  <Text style={styles.optionDescription}>
                    Add a new guard who can manage cycle returns
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <AddStudentModal
        visible={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSuccess={handleSuccess}
      />

      <AddGuardModal
        visible={showAddGuard}
        onClose={() => setShowAddGuard(false)}
        onSuccess={handleSuccess}
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
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    gap: 15,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AddUserModal;
