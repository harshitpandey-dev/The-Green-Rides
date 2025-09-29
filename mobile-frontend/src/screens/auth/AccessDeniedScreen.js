import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccessDeniedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Access Not Available</Text>
      <Text style={styles.subtitle}>
        Admin and Finance users should use the web portal for system management.
      </Text>
      <Text style={styles.description}>
        Please visit the web application to access your dashboard.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
});

export default AccessDeniedScreen;
