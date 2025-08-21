import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import {
  verifyOTPAsync,
  resendOTPAsync,
  clearError,
} from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OTPVerificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { pendingEmail, isLoading, error } = useSelector(state => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error, dispatch]);

  const handleOTPChange = (value, index) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = `otp${index + 1}`;
      if (this[nextInput]) {
        this[nextInput].focus();
      }
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = `otp${index - 1}`;
      if (this[prevInput]) {
        this[prevInput].focus();
      }
    }
  };

  const handleVerifyOTP = async (otpCode = null) => {
    const otpToVerify = otpCode || otp.join('');

    if (otpToVerify.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits');
      return;
    }

    if (!pendingEmail) {
      Alert.alert('Error', 'No email found for verification');
      return;
    }

    try {
      await dispatch(
        verifyOTPAsync({ email: pendingEmail, otp: otpToVerify }),
      ).unwrap();
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      // Error is handled by useEffect
      // Clear the OTP inputs
      setOtp(['', '', '', '', '', '']);
      if (this.otp0) {
        this.otp0.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !pendingEmail) return;

    try {
      await dispatch(resendOTPAsync(pendingEmail)).unwrap();
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const maskEmail = email => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername =
      username.charAt(0) +
      '*'.repeat(username.length - 2) +
      username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  if (isLoading) {
    return <LoadingSpinner message="Verifying OTP..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={48} color="#4CAF50" />
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.emailText}>{maskEmail(pendingEmail)}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Enter verification code</Text>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  this[`otp${index}`] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  error && styles.otpInputError,
                ]}
                value={digit}
                onChangeText={value => handleOTPChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>
        </View>

        {/* Verify Button */}
        <Button
          title="Verify OTP"
          onPress={() => handleVerifyOTP()}
          disabled={otp.some(digit => !digit) || isLoading}
          loading={isLoading}
          style={styles.verifyButton}
        />

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={!canResend}
            style={styles.resendButton}
          >
            <Text
              style={[
                styles.resendButtonText,
                !canResend && styles.resendButtonTextDisabled,
              ]}
            >
              {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Having trouble? Check your spam folder or contact support.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'white',
  },
  otpInputFilled: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  otpInputError: {
    borderColor: '#f44336',
    backgroundColor: '#FFF8F8',
  },
  verifyButton: {
    marginBottom: 20,
    backgroundColor: '#4CAF50',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default OTPVerificationScreen;
