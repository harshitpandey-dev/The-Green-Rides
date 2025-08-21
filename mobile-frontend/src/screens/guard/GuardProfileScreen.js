import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';
import { setUser, logout } from '../../redux/slices/authSlice';

const GuardProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    employeeId: user?.employeeId || '',
    location: user?.location || '',
    shift: user?.shift || '',
    experience: user?.experience || '',
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    rental: true,
    maintenance: true,
    emergencies: true,
    shifts: true,
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [workStats, setWorkStats] = useState({
    totalRentalsProcessed: 0,
    totalReturnsProcessed: 0,
    cyclesInspected: 0,
    workingDays: 0,
    memberSince: null,
  });

  const shiftOptions = [
    { label: 'Morning (6 AM - 2 PM)', value: 'morning' },
    { label: 'Evening (2 PM - 10 PM)', value: 'evening' },
    { label: 'Night (10 PM - 6 AM)', value: 'night' },
    { label: 'Full Time', value: 'full_time' },
  ];

  const locationOptions = [
    { label: 'Main Gate', value: 'main_gate' },
    { label: 'Library', value: 'library' },
    { label: 'Hostel Area', value: 'hostel_area' },
    { label: 'Academic Block', value: 'academic_block' },
    { label: 'Cafeteria', value: 'cafeteria' },
    { label: 'Sports Complex', value: 'sports_complex' },
  ];

  useEffect(() => {
    fetchWorkStats();
    setOriginalData(profileData);
  }, []);

  const fetchWorkStats = async () => {
    try {
      const stats = await userService.getGuardStats();
      setWorkStats(stats);
    } catch (error) {
      console.error('Failed to fetch work stats:', error);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original data
      setProfileData(originalData);
    } else {
      // Start editing - save current data as original
      setOriginalData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(profileData);
      dispatch(setUser(updatedUser));
      setOriginalData(profileData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      Alert.alert('Success', 'Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant photo library permission',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Upload image logic would go here
        Alert.alert('Info', 'Image upload feature coming soon!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        },
      },
    ]);
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getShiftLabel = shiftValue => {
    const shift = shiftOptions.find(s => s.value === shiftValue);
    return shift ? shift.label : shiftValue;
  };

  const getLocationLabel = locationValue => {
    const location = locationOptions.find(l => l.value === locationValue);
    return location
      ? location.label
      : locationValue?.replace('_', ' ').toUpperCase();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handlePickImage}
          >
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={50} color="#999" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user?.name || 'Guard'}</Text>
          <Text style={styles.userRole}>
            Security Guard • {user?.employeeId || 'N/A'}
          </Text>
          <Text style={styles.userLocation}>
            {getLocationLabel(user?.location)} • {getShiftLabel(user?.shift)}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {workStats.totalRentalsProcessed}
              </Text>
              <Text style={styles.statLabel}>Rentals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {workStats.totalReturnsProcessed}
              </Text>
              <Text style={styles.statLabel}>Returns</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{workStats.cyclesInspected}</Text>
              <Text style={styles.statLabel}>Inspections</Text>
            </View>
          </View>
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditToggle}
            >
              <Ionicons
                name={isEditing ? 'close' : 'pencil'}
                size={20}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={profileData.name}
                onChangeText={text =>
                  setProfileData(prev => ({ ...prev, name: text }))
                }
                editable={isEditing}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={profileData.email}
                editable={false}
                placeholder="Email address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={profileData.phone}
                onChangeText={text =>
                  setProfileData(prev => ({ ...prev, phone: text }))
                }
                editable={isEditing}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employee ID</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={profileData.employeeId}
                editable={false}
                placeholder="Employee ID"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Assigned Location</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={getLocationLabel(profileData.location)}
                editable={false}
                placeholder="Location"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Shift</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={getShiftLabel(profileData.shift)}
                editable={false}
                placeholder="Shift"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Experience (Years)</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={profileData.experience}
                onChangeText={text =>
                  setProfileData(prev => ({ ...prev, experience: text }))
                }
                editable={isEditing}
                placeholder="Years of experience"
                keyboardType="numeric"
              />
            </View>

            {isEditing && (
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={loading}
                style={styles.saveButton}
              />
            )}
          </View>
        </View>

        {/* Work Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="bicycle" size={24} color="#4CAF50" />
              <Text style={styles.statCardNumber}>
                {workStats.totalRentalsProcessed}
              </Text>
              <Text style={styles.statCardLabel}>Total Rentals Processed</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#ff9800" />
              <Text style={styles.statCardNumber}>
                {workStats.totalReturnsProcessed}
              </Text>
              <Text style={styles.statCardLabel}>Returns Processed</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="build" size={24} color="#2196F3" />
              <Text style={styles.statCardNumber}>
                {workStats.cyclesInspected}
              </Text>
              <Text style={styles.statCardLabel}>Cycles Inspected</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#9c27b0" />
              <Text style={styles.statCardNumber}>{workStats.workingDays}</Text>
              <Text style={styles.statCardLabel}>Working Days</Text>
            </View>
          </View>

          <View style={styles.membershipInfo}>
            <Text style={styles.membershipText}>
              Working since: {formatDate(workStats.memberSince)}
            </Text>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="bicycle" size={24} color="#4CAF50" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  Rental Notifications
                </Text>
                <Text style={styles.notificationSubtitle}>
                  New rental requests and assignments
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.rental}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, rental: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.rental ? '#4CAF50' : '#999'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="build" size={24} color="#ff9800" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Maintenance Alerts</Text>
                <Text style={styles.notificationSubtitle}>
                  Cycle maintenance and repair notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.maintenance}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, maintenance: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.maintenance ? '#4CAF50' : '#999'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="warning" size={24} color="#f44336" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Emergency Alerts</Text>
                <Text style={styles.notificationSubtitle}>
                  Critical alerts and emergency notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.emergencies}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, emergencies: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.emergencies ? '#4CAF50' : '#999'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="time" size={24} color="#2196F3" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Shift Updates</Text>
                <Text style={styles.notificationSubtitle}>
                  Shift changes and schedule updates
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.shifts}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, shifts: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.shifts ? '#4CAF50' : '#999'}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => setShowChangePassword(true)}
          >
            <Ionicons name="lock-closed" size={24} color="#4CAF50" />
            <Text style={styles.settingsText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() => navigation.navigate('GuardReturns')}
          >
            <Ionicons name="list" size={24} color="#ff9800" />
            <Text style={styles.settingsText}>Manage Returns</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsItem}
            onPress={() =>
              Alert.alert('Info', 'Help & Support feature coming soon!')
            }
          >
            <Ionicons name="help-circle" size={24} color="#2196F3" />
            <Text style={styles.settingsText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={24} color="#f44336" />
            <Text style={[styles.settingsText, styles.logoutText]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowChangePassword(false)}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.textInput}
                value={passwordData.currentPassword}
                onChangeText={text =>
                  setPasswordData(prev => ({ ...prev, currentPassword: text }))
                }
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.textInput}
                value={passwordData.newPassword}
                onChangeText={text =>
                  setPasswordData(prev => ({ ...prev, newPassword: text }))
                }
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.textInput}
                value={passwordData.confirmPassword}
                onChangeText={text =>
                  setPasswordData(prev => ({ ...prev, confirmPassword: text }))
                }
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>

            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={loading}
              style={styles.changePasswordButton}
            />
          </ScrollView>
        </View>
      </Modal>

      {loading && <LoadingSpinner overlay message="Processing..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#666',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  statCardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  membershipInfo: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  membershipText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationText: {
    marginLeft: 15,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#f44336',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  changePasswordButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});

export default GuardProfileScreen;
