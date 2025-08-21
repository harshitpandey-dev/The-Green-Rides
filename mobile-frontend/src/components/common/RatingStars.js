import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RatingStars = ({
  rating = 0,
  onRatingChange,
  size = 24,
  color = '#FFD700',
  inactiveColor = '#E0E0E0',
  style,
  readonly = false,
}) => {
  const handleStarPress = newRating => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => handleStarPress(star)}
          disabled={readonly}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? color : inactiveColor}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginHorizontal: 2,
    padding: 2,
  },
});

export default RatingStars;
