import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logoutAsync } from '../../redux/slices/authSlice';

const StudentProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logoutAsync());
        },
      },
    ]);
  };

  const navigateToUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const ProfileItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={24} color="#4CAF50" />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: user?.profilePicture || 'https://via.placeholder.com/120',
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Student Name'}</Text>
        <Text style={styles.userRole}>Student • {user?.rollNo}</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <ProfileItem
          icon="person-outline"
          title="Update Profile"
          onPress={navigateToUpdateProfile}
        />

        <ProfileItem
          icon="lock-closed-outline"
          title="Change Password"
          onPress={navigateToChangePassword}
        />

        <ProfileItem icon="mail-outline" title="Email" value={user?.email} />

        <ProfileItem icon="call-outline" title="Phone" value={user?.phone} />
      </View>

      {/* Academic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>

        <ProfileItem
          icon="school-outline"
          title="Roll Number"
          value={user?.rollNo}
        />

        <ProfileItem
          icon="library-outline"
          title="Course"
          value={user?.course || 'Not specified'}
        />

        <ProfileItem
          icon="calendar-outline"
          title="Year"
          value={user?.year || 'Not specified'}
        />

        <ProfileItem
          icon="bed-outline"
          title="Hostel"
          value={user?.hostel || 'Not specified'}
        />
      </View>

      {/* Rental Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rental Statistics</Text>

        <ProfileItem
          icon="bicycle-outline"
          title="Total Rentals"
          value={user?.totalTimesRented?.toString() || '0'}
        />

        <ProfileItem
          icon="time-outline"
          title="Total Duration"
          value={
            user?.totalDurationOfRent
              ? `${Math.floor(user.totalDurationOfRent / 60)}h ${
                  user.totalDurationOfRent % 60
                }m`
              : '0m'
          }
        />

        <ProfileItem
          icon="card-outline"
          title="Outstanding Fine"
          value={user?.fine ? `₹${user.fine}` : '₹0'}
        />
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#f44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
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
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 15,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  profileItemValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
    marginLeft: 10,
  },
});

export default StudentProfileScreen;
