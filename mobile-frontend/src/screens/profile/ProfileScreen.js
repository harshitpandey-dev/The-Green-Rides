import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changePasswordAsync } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import UpdatePasswordModal from '../../components/Profile/UpdatePasswordModal';

const ProfileScreen = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const handleChangePassword = async passwordData => {
    try {
      await dispatch(
        changePasswordAsync({
          email: user?.email,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      ).unwrap();

      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const getInitials = name => {
    return (
      name
        ?.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2) || 'U'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
          {user?.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Admin</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Roll Number</Text>
              <Text style={styles.infoValue}>{user?.rollNumber || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>
                {user?.role === 'admin' ? 'Administrator' : 'Student'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Change Password"
            onPress={() => setShowPasswordModal(true)}
            variant="secondary"
            style={styles.actionButton}
          />

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>

      <UpdatePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  adminBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default ProfileScreen;
