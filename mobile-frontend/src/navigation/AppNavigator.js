import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import CycleListScreen from '../screens/cycles/CycleListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RentScreen from '../screens/rent/RentScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import NotFoundScreen from '../screens/notFound/NotFoundScreen';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: 'Sign Up' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigation
const MainTabs = ({ isAdmin }) => (
  <Tab.Navigator
    initialRouteName="Cycles"
    screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Cycles"
      component={CycleListScreen}
      options={{ title: 'Available Cycles' }}
    />
    <Tab.Screen
      name="Rent"
      component={RentScreen}
      options={{ title: 'My Rentals' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    {isAdmin && (
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Admin' }}
      />
    )}
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isAuthReady, user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs isAdmin={isAdmin} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
