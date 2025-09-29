import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/common/Button';

const NotFoundScreen = ({ navigation }) => {
  const goHome = () => {
    navigation.navigate('Cycles');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚫</Text>
        <Text style={styles.title}>Page Not Found!</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist.
        </Text>
        <Button title="Go to Home" onPress={goHome} style={styles.button} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 40,
  },
});

export default NotFoundScreen;
