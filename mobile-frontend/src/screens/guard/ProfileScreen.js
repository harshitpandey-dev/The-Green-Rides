import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  getGuardDashboard,
  updateGuardProfile,
  changePassword,
} from '../../services/user.service';
import { setUser, logout } from '../../redux/slices/authSlice';
import {
  COLORS,
  SIZES,
  SHADOWS,
  COMMON_STYLES,
  formatTime,
} from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuardProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  // Edit profile form
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const data = await getGuardDashboard(user?.id);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const selectProfileImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);

      const updateData = {
        ...editForm,
        profileImage: profileImage?.uri ? profileImage : undefined,
      };

      const updatedUser = await updateGuardProfile(user?.id, updateData);
      dispatch(setUser(updatedUser));

      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsUpdating(true);

      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setShowPasswordModal(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const renderDashboardStats = () => {
    if (!dashboardData) return null;

    const stats = [
      {
        icon: 'bicycle',
        label: 'Total Rentals Processed',
        value: dashboardData.totalRentals || 0,
        color: COLORS.info,
      },
      {
        icon: 'timer',
        label: 'Current Active Rentals',
        value: dashboardData.currentActiveRentals || 0,
        color: COLORS.success,
      },
      {
        icon: 'time',
        label: 'Total Hours Managed',
        value: formatTime((dashboardData.totalHoursManaged || 0) * 60),
        color: COLORS.primary,
      },
      {
        icon: 'calendar',
        label: 'Days on Duty',
        value: dashboardData.daysOnDuty || 0,
        color: COLORS.secondary,
      },
    ];

    return (
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={stat.icon} size={32} color={stat.color} />
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Update Profile</Text>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity
              onPress={selectProfileImage}
              style={styles.imageContainer}
            >
              {profileImage?.uri || user?.profileImage ? (
                <Image
                  source={{ uri: profileImage?.uri || user?.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons
                    name="person"
                    size={48}
                    color={COLORS.textSecondary}
                  />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageText}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={text =>
                  setEditForm(prev => ({ ...prev, name: text }))
                }
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone}
                onChangeText={text =>
                  setEditForm(prev => ({ ...prev, phone: text }))
                }
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={text =>
                  setEditForm(prev => ({ ...prev, email: text }))
                }
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={COMMON_STYLES.secondaryButton}
              onPress={() => setShowEditModal(false)}
              disabled={isUpdating}
            >
              <Text style={COMMON_STYLES.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[COMMON_STYLES.primaryButton, styles.updateButton]}
              onPress={handleUpdateProfile}
              disabled={
                isUpdating || !editForm.name.trim() || !editForm.phone.trim()
              }
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={COMMON_STYLES.primaryButtonText}>
                  Update Profile
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.currentPassword}
                onChangeText={text =>
                  setPasswordForm(prev => ({ ...prev, currentPassword: text }))
                }
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.newPassword}
                onChangeText={text =>
                  setPasswordForm(prev => ({ ...prev, newPassword: text }))
                }
                placeholder="Enter new password (min 6 characters)"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirmPassword}
                onChangeText={text =>
                  setPasswordForm(prev => ({ ...prev, confirmPassword: text }))
                }
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={COMMON_STYLES.secondaryButton}
              onPress={() => {
                setPasswordForm({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                setShowPasswordModal(false);
              }}
              disabled={isUpdating}
            >
              <Text style={COMMON_STYLES.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[COMMON_STYLES.primaryButton, styles.updateButton]}
              onPress={handleChangePassword}
              disabled={
                isUpdating ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword
              }
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={COMMON_STYLES.primaryButtonText}>
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={COMMON_STYLES.loadingContainer}>
        <LoadingSpinner />
        <Text style={COMMON_STYLES.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={COMMON_STYLES.header}>
          <View>
            <Text style={COMMON_STYLES.headerTitle}>Guard Profile</Text>
            <Text style={COMMON_STYLES.headerSubtitle}>
              Manage your account and view statistics
            </Text>
          </View>
          <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
            <Ionicons
              name="refresh"
              size={24}
              color={refreshing ? COLORS.textSecondary : COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons
                    name="person"
                    size={32}
                    color={COLORS.textSecondary}
                  />
                </View>
              )}
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>
                Guard •{' '}
                {user?.location === 'east_campus'
                  ? 'East Campus'
                  : 'West Campus'}
              </Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
              {user?.email && (
                <Text style={styles.userEmail}>{user.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setEditForm({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  email: user?.email || '',
                });
                setShowEditModal(true);
              }}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.secondary}
              />
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guard Dashboard</Text>
          {renderDashboardStats()}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('CreateRental')}
            >
              <Ionicons name="add-circle" size={32} color={COLORS.success} />
              <Text style={styles.quickActionText}>Create Rental</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('AcceptReturn')}
            >
              <Ionicons name="qr-code" size={32} color={COLORS.info} />
              <Text style={styles.quickActionText}>Scan Return</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('Rentals')}
            >
              <Ionicons name="list" size={32} color={COLORS.primary} />
              <Text style={styles.quickActionText}>View Rentals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('CycleList')}
            >
              <Ionicons name="bicycle" size={32} color={COLORS.warning} />
              <Text style={styles.quickActionText}>Manage Cycles</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                Alert.alert('Info', 'Help & Support feature coming soon!')
              }
            >
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={COLORS.info}
              />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('Info', 'About feature coming soon!')}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={COLORS.secondary}
              />
              <Text style={styles.settingText}>About</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={COLORS.danger}
              />
              <Text style={[styles.settingText, styles.logoutText]}>
                Logout
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {renderEditModal()}
      {renderPasswordModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  section: {
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
    marginHorizontal: SIZES.margin,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.margin,
    gap: 12,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    ...SHADOWS.light,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.margin,
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    ...SHADOWS.light,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginTop: 8,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SIZES.margin,
    ...SHADOWS.light,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 16,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: COLORS.danger,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
  },
  modalContent: {
    flex: 1,
    padding: SIZES.padding,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    fontSize: 16,
    color: COLORS.dark,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  updateButton: {
    flex: 1,
  },
});

export default GuardProfileScreen;
