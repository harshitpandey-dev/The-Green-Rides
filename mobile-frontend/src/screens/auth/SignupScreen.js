import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, rollNumber } = formData;

    if (!name || !email || !password || !confirmPassword || !rollNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
        registerAsync({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rollNumber: formData.rollNumber,
        }),
      ).unwrap();

      Alert.alert('Success', 'Account created successfully! Please sign in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating account..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up for Green Rides</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={value => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Roll Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.rollNumber}
                  onChangeText={value => handleInputChange('rollNumber', value)}
                  placeholder="Enter your roll number"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={value => handleInputChange('password', value)}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={value =>
                    handleInputChange('confirmPassword', value)
                  }
                  placeholder="Confirm your password"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title="Create Account"
                onPress={handleSignup}
                style={styles.signupButton}
              />

              <Button
                title="Already have an account? Sign In"
                onPress={goToLogin}
                variant="secondary"
                style={styles.loginButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    width: '100%',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    marginVertical: 16,
  },
  loginButton: {
    marginTop: 8,
  },
});

export default SignupScreen;
