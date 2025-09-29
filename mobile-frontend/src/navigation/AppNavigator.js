import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import AccessDeniedScreen from '../screens/auth/AccessDeniedScreen';

// Student screens
import ActiveRentalScreen from '../screens/student/ActiveRentalScreen';
import RentalHistoryScreen from '../screens/student/RentalHistoryScreen';
import StudentProfileScreen from '../screens/student/ProfileScreen';

// Guard screens
import GuardHomeScreen from '../screens/guard/GuardHomeScreen';
import GuardProfileScreen from '../screens/guard/ProfileScreen';
import CreateRentalScreen from '../screens/guard/CreateRentalScreen';
import AcceptReturnScreen from '../screens/guard/AcceptReturnScreen';
import RentalsScreen from '../screens/guard/RentalsScreen';
import CycleListScreen from '../screens/guard/CycleListScreen';

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
      component={require('../screens/student/StudentRentScreen').default}
      options={{ title: 'Green Rides', headerShown: false }}
    />
    <Tab.Screen
      name="History"
      component={RentalHistoryScreen}
      options={{ title: 'My Rentals' }}
    />
    <Tab.Screen
      name="Profile"
      component={StudentProfileScreen}
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
        } else if (route.name === 'Rentals') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Cycles') {
          iconName = focused ? 'bicycle' : 'bicycle-outline';
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
      options={{ title: 'Guard Portal', headerShown: false }}
    />
    <Tab.Screen
      name="Rentals"
      component={RentalsScreen}
      options={{ title: 'Rentals' }}
    />
    <Tab.Screen
      name="Cycles"
      component={CycleListScreen}
      options={{ title: 'Cycles' }}
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
      name="ActiveRental"
      component={ActiveRentalScreen}
      options={{ title: 'Active Rental' }}
    />

    <Stack.Screen
      name="StudentRentScreen"
      component={require('../screens/student/StudentRentScreen').default}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="StudentReturnScreen"
      component={require('../screens/student/StudentReturnScreen').default}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GenerateReceipt"
      component={require('../screens/student/GenerateReceiptScreen').default}
      options={{ title: 'Receipt' }}
    />

    {/* New Guard Screens */}
    <Stack.Screen
      name="CreateRental"
      component={CreateRentalScreen}
      options={{ title: 'Create Rental' }}
    />

    <Stack.Screen
      name="AcceptReturn"
      component={AcceptReturnScreen}
      options={{ title: 'Accept Return' }}
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
