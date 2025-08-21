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

const ProfileScreen = ({ navigation }) => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    rollNo: user?.rollNo || '',
    course: user?.course || '',
    year: user?.year || '',
    hostel: user?.hostel || '',
    roomNo: user?.roomNo || '',
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    rental: true,
    reminders: true,
    promotions: false,
    maintenance: true,
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileStats, setProfileStats] = useState({
    totalRentals: 0,
    totalFines: 0,
    favoriteLocation: 'N/A',
    memberSince: null,
  });

  useEffect(() => {
    fetchProfileStats();
    setOriginalData(profileData);
  }, []);

  const fetchProfileStats = async () => {
    try {
      const stats = await userService.getProfileStats();
      setProfileStats(stats);
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
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

          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          <Text style={styles.userRole}>Student • {user?.rollNo || 'N/A'}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileStats.totalRentals}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{profileStats.totalFines}</Text>
              <Text style={styles.statLabel}>Total Fines</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatDate(profileStats.memberSince)}
              </Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
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
              <Text style={styles.inputLabel}>Roll Number</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={profileData.rollNo}
                editable={false}
                placeholder="Roll number"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Course</Text>
                <TextInput
                  style={[styles.textInput, !isEditing && styles.disabledInput]}
                  value={profileData.course}
                  onChangeText={text =>
                    setProfileData(prev => ({ ...prev, course: text }))
                  }
                  editable={isEditing}
                  placeholder="B.Tech"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={[styles.textInput, !isEditing && styles.disabledInput]}
                  value={profileData.year}
                  onChangeText={text =>
                    setProfileData(prev => ({ ...prev, year: text }))
                  }
                  editable={isEditing}
                  placeholder="1st"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Hostel</Text>
                <TextInput
                  style={[styles.textInput, !isEditing && styles.disabledInput]}
                  value={profileData.hostel}
                  onChangeText={text =>
                    setProfileData(prev => ({ ...prev, hostel: text }))
                  }
                  editable={isEditing}
                  placeholder="Hostel Name"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Room No.</Text>
                <TextInput
                  style={[styles.textInput, !isEditing && styles.disabledInput]}
                  value={profileData.roomNo}
                  onChangeText={text =>
                    setProfileData(prev => ({ ...prev, roomNo: text }))
                  }
                  editable={isEditing}
                  placeholder="Room"
                />
              </View>
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

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="notifications" size={24} color="#4CAF50" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  Rental Notifications
                </Text>
                <Text style={styles.notificationSubtitle}>
                  Get notified about rental confirmations and returns
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
              <Ionicons name="time" size={24} color="#ff9800" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Reminders</Text>
                <Text style={styles.notificationSubtitle}>
                  Return reminders and due time alerts
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.reminders}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, reminders: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.reminders ? '#4CAF50' : '#999'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="megaphone" size={24} color="#2196F3" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Promotions</Text>
                <Text style={styles.notificationSubtitle}>
                  Special offers and promotional messages
                </Text>
              </View>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={value =>
                setNotifications(prev => ({ ...prev, promotions: value }))
              }
              trackColor={{ false: '#ddd', true: '#c8e6c9' }}
              thumbColor={notifications.promotions ? '#4CAF50' : '#999'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="build" size={24} color="#f44336" />
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  Maintenance Updates
                </Text>
                <Text style={styles.notificationSubtitle}>
                  Cycle maintenance and system updates
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
            onPress={() => navigation.navigate('RentalHistory')}
          >
            <Ionicons name="time" size={24} color="#ff9800" />
            <Text style={styles.settingsText}>Rental History</Text>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default ProfileScreen;
