import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#4CAF50',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  danger: {
    backgroundColor: '#f44336',
  },
  destructive: {
    backgroundColor: '#f44336',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#4CAF50',
  },
  outlineText: {
    color: '#4CAF50',
  },
  dangerText: {
    color: '#fff',
  },
  destructiveText: {
    color: '#fff',
  },
});

export default Button;
