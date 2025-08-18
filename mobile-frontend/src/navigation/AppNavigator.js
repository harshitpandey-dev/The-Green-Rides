import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AccessDeniedScreen from '../screens/auth/AccessDeniedScreen';
import CycleListScreen from '../screens/cycles/CycleListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RentScreen from '../screens/rent/RentScreen';
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

// Main Tab Navigation for Guard and Student roles only
const MainTabs = ({ userRole }) => (
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
    {userRole === 'student' && (
      <Tab.Screen
        name="Rent"
        component={RentScreen}
        options={{ title: 'My Rentals' }}
      />
    )}
    {userRole === 'guard' && (
      <Tab.Screen
        name="Return"
        component={RentScreen}
        options={{ title: 'Process Returns' }}
      />
    )}
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isAuthReady, user } = useSelector(state => state.auth);

  // Check if user has access to mobile app (only guard and student)
  const hasAccess = user?.role === 'guard' || user?.role === 'student';

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  // If user is logged in but doesn't have mobile access (admin/finance)
  if (isLoggedIn && !hasAccess) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="AccessDenied"
            component={AccessDeniedScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs userRole={user?.role} /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
