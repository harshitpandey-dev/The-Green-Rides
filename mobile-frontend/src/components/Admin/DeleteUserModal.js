import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { deleteUser } from '../../services/auth.service';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const DeleteUserModal = ({
  visible,
  onClose,
  onSuccess,
  userType = 'student',
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const title = `Delete ${userType}`;
    const message = `Are you sure you want to delete this ${userType}? This action cannot be undone.`;

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            await deleteUser({ email: email.trim().toLowerCase() });
            Alert.alert('Success', `${userType} deleted successfully!`);
            handleClose();
            if (onSuccess) onSuccess();
          } catch (error) {
            Alert.alert(
              'Error',
              error.message || `Failed to delete ${userType}`,
            );
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleClose = () => {
    setEmail('');
    onClose();
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
            <LoadingSpinner message={`Deleting ${userType}...`} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Delete {userType}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.warning}>⚠️ This action cannot be undone!</Text>
            <Text style={styles.instruction}>
              Enter the email address of the {userType} you want to delete:
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={`Enter ${userType}'s email address`}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={`Delete ${userType}`}
              onPress={handleSubmit}
              variant="destructive"
              style={styles.deleteButton}
            />
          </View>
        </View>
      </View>
    </Modal>
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
    marginBottom: 20,
  },
  warning: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
});

export default DeleteUserModal;
