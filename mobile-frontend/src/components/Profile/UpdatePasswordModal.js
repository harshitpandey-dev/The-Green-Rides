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
import Button from '../common/Button';

const UpdatePasswordModal = ({ visible, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return false;
    }

    if (oldPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from old password');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    onClose();
  };

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
            <Text style={styles.title}>Change Password</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={formData.oldPassword}
                onChangeText={value => handleInputChange('oldPassword', value)}
                placeholder="Enter current password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={value => handleInputChange('newPassword', value)}
                placeholder="Enter new password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={value =>
                  handleInputChange('confirmPassword', value)
                }
                placeholder="Confirm new password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="secondary"
              style={styles.cancelButton}
            />
            <Button
              title="Update Password"
              onPress={handleSubmit}
              disabled={isLoading}
              style={styles.submitButton}
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
    fontSize: 20,
    color: '#666',
  },
  form: {
    marginBottom: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  submitButton: {
    flex: 1,
  },
});

export default UpdatePasswordModal;
