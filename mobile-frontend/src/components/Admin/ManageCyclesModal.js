import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import DeleteCycleModal from './DeleteCycleModal';
import DeleteUserModal from './DeleteUserModal';

const ManageCyclesModal = ({ visible, onClose, onSuccess }) => {
  const [showDeleteCycle, setShowDeleteCycle] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [deleteUserType, setDeleteUserType] = useState('student');

  const handleClose = () => {
    setShowDeleteCycle(false);
    setShowDeleteUser(false);
    onClose();
  };

  const handleSuccess = () => {
    setShowDeleteCycle(false);
    setShowDeleteUser(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  const openDeleteUser = userType => {
    setDeleteUserType(userType);
    setShowDeleteUser(true);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Manage System</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Delete/Remove items from system:
              </Text>

              <View style={styles.options}>
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => setShowDeleteCycle(true)}
                >
                  <Text style={styles.optionIcon}>🚲</Text>
                  <Text style={styles.optionTitle}>Delete Cycle</Text>
                  <Text style={styles.optionDescription}>
                    Remove a cycle from the system
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => openDeleteUser('student')}
                >
                  <Text style={styles.optionIcon}>👨‍🎓</Text>
                  <Text style={styles.optionTitle}>Delete Student</Text>
                  <Text style={styles.optionDescription}>
                    Remove a student account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => openDeleteUser('guard')}
                >
                  <Text style={styles.optionIcon}>👮‍♂️</Text>
                  <Text style={styles.optionTitle}>Delete Guard</Text>
                  <Text style={styles.optionDescription}>
                    Remove a guard account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <DeleteCycleModal
        visible={showDeleteCycle}
        onClose={() => setShowDeleteCycle(false)}
        onSuccess={handleSuccess}
      />

      <DeleteUserModal
        visible={showDeleteUser}
        onClose={() => setShowDeleteUser(false)}
        onSuccess={handleSuccess}
        userType={deleteUserType}
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
    flexDirection: 'column',
    gap: 15,
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
});

export default ManageCyclesModal;
