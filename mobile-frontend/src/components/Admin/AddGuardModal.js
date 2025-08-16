import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { createUser } from '../../services/user.service';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const AddGuardModal = ({ visible, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter guard name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter password');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'guard',
        password: formData.password,
      });
      Alert.alert('Success', 'Guard added successfully!');
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add guard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    setShowPassword(false);
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
            <LoadingSpinner message="Adding guard..." />
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
        <ScrollView style={styles.scrollView}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New Guard</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={value => handleInputChange('name', value)}
                  placeholder="Enter guard's full name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={formData.password}
                    onChangeText={value => handleInputChange('password', value)}
                    placeholder="Enter password (min 6 chars)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Text style={styles.passwordToggleText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
                title="Add Guard"
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    width: '100%',
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
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordToggle: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  passwordToggleText: {
    color: '#4CAF50',
    fontWeight: '600',
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

export default AddGuardModal;
