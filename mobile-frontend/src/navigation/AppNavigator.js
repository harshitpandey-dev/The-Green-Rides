import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import AccessDeniedScreen from '../screens/auth/AccessDeniedScreen';

// Student screens
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import StudentQRScanner from '../components/QrScanner/StudentQRScanner';
import ActiveRentalScreen from '../screens/rent/ActiveRentalScreen';
import RentalHistoryScreen from '../screens/student/RentalHistoryScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import GenerateReceiptScreen from '../screens/student/GenerateReceiptScreen';

// Guard screens
import GuardHomeScreen from '../screens/guard/GuardHomeScreen';
import GuardRentingScreen from '../components/Guard/GuardRentingScreen';
import GuardReturnsScreen from '../screens/guard/GuardReturnsScreen';
import GuardProfileScreen from '../screens/guard/GuardProfileScreen';

import LoadingSpinner from '../components/common/LoadingSpinner';
import { loadTokenFromStorage } from '../redux/slices/authSlice';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#4CAF50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{
        title: 'Create Account',
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="OTPVerification"
      component={OTPVerificationScreen}
      options={{
        title: 'Verify OTP',
        headerBackTitleVisible: false,
        headerLeft: null,
      }}
    />
  </Stack.Navigator>
);

// Student Tab Navigation
const StudentTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'QRScan') {
          iconName = focused ? 'qr-code' : 'qr-code-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      headerStyle: {
        backgroundColor: '#4CAF50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={StudentHomeScreen}
      options={{ title: 'Green Rides' }}
    />
    <Tab.Screen
      name="QRScan"
      component={StudentQRScanner}
      options={{
        title: 'Scan QR',
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="History"
      component={RentalHistoryScreen}
      options={{ title: 'My Rentals' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Guard Tab Navigation
const GuardTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'RentCycle') {
          iconName = focused ? 'bicycle' : 'bicycle-outline';
        } else if (route.name === 'Returns') {
          iconName = focused ? 'return-down-back' : 'return-down-back-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
      headerStyle: {
        backgroundColor: '#4CAF50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={GuardHomeScreen}
      options={{ title: 'Guard Portal' }}
    />
    <Tab.Screen
      name="RentCycle"
      component={GuardRentingScreen}
      options={{ title: 'Rent Cycle' }}
    />
    <Tab.Screen
      name="Returns"
      component={GuardReturnsScreen}
      options={{ title: 'Returns' }}
    />
    <Tab.Screen
      name="Profile"
      component={GuardProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Main App Stack
const AppStack = ({ userRole }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#4CAF50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="MainTabs"
      component={userRole === 'student' ? StudentTabs : GuardTabs}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="StudentQRScanner"
      component={StudentQRScanner}
      options={{
        title: 'Scan QR Code',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ActiveRental"
      component={ActiveRentalScreen}
      options={{ title: 'Active Rental' }}
    />
    <Stack.Screen
      name="GuardRenting"
      component={GuardRentingScreen}
      options={{ title: 'Rent to Student' }}
    />
    <Stack.Screen
      name="GenerateReceipt"
      component={GenerateReceiptScreen}
      options={{ title: 'Generate Receipt' }}
    />
    <Stack.Screen
      name="RentalHistory"
      component={RentalHistoryScreen}
      options={{ title: 'Rental History' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, isAuthReady, user, isVerified, registrationStep } =
    useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  if (!isAuthReady) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (isLoggedIn && (!isVerified || registrationStep === 'otp_pending')) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn && user ? (
        user.role === 'student' || user.role === 'guard' ? (
          <AppStack userRole={user.role} />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AccessDenied" component={AccessDeniedScreen} />
          </Stack.Navigator>
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
